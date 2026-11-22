// Rendu spécialisé de la presse « clean » de Dérive / Nuances.
// Encres, séparation et tuiles proviennent de GrainLab. Une seule passe remplace
// les deux grandes impressions masquées ; la source douce est calculée une fois.
import { normalize, parseHex, separationWeights, screenValues, roll } from '../../vendor/GrainLab/grainlab.all.min.js';

export const SOURCE_EDGE = 384;
export const MAX_RENDER_PIXELS = 9_000_000;
// Un pixel de trame doit couvrir un nombre ENTIER de pixels d'écran. Rendre à 1,5× puis laisser
// le navigateur étirer à 2× double une rangée sur trois : la trame se raye de traits réguliers,
// horizontaux et verticaux. On rend donc à la densité de l'écran, ou à une fraction entière
// (1/2, 1/3…) quand le budget de pixels est dépassé ; le canvas est alors agrandi sans lissage.
export function surfaceSize(width, height, dpr = 1) {
  let divisor = 1;
  while (divisor < 8 && width * height * (dpr / divisor) ** 2 > MAX_RENDER_PIXELS) divisor++;
  const scale = dpr / divisor;
  const sourceScale = Math.min(1, SOURCE_EDGE / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)),
    sourceWidth: Math.max(1, Math.round(width * sourceScale)), sourceHeight: Math.max(1, Math.round(height * sourceScale)) };
}
const VERT = `#version 300 es
in vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `#version 300 es
precision highp float;
uniform sampler2D sourceImage,c0,c1,c2,f0,f1,f2;
uniform vec2 size,bufferSize;
uniform vec3 lens,weights[3],bias,density,colors[3],paper,coarseTiles,fineTiles;
uniform float k,m,fineDetail,reserveAmount,reserveFeather;
uniform bool opaque;
uniform vec4 reserves[8];
uniform int reserveCount;
out vec4 pixel;
vec3 thresholds(vec2 p,bool fine){
  // Le focus varie par fragment : aucun calcul implicite de dérivées dans
  // ces branches. Toutes nos textures n'ont qu'un niveau, explicitement lu.
  if(fine)return vec3(textureLod(f0,p/fineTiles.x,0.).r,textureLod(f1,p/fineTiles.y,0.).r,textureLod(f2,p/fineTiles.z,0.).r);
  return vec3(textureLod(c0,p/coarseTiles.x,0.).r,textureLod(c1,p/coarseTiles.y,0.).r,textureLod(c2,p/coarseTiles.z,0.).r);
}
vec3 impression(vec3 d,vec3 threshold,bool fine){
  vec3 a=clamp(k*(d-(1.-2.*m)*threshold-m)+.5,0.,1.);
  if(fine)a=mix(d,a,fineDetail);
  a*=density;
  vec3 result=paper;
  for(int i=0;i<3;i++)result=opaque?mix(result,colors[i],a[i]):result*mix(vec3(1.),colors[i],a[i]);
  return result;
}
// Réserve tramée : sous un texte, la demande d'encre baisse en douceur. Les points
// rétrécissent jusqu'au papier, sans aplat ni bord net. reserves[i] = (x, y, w, h) en px CSS.
float reserve(vec2 p){
  float w=0.;
  for(int i=0;i<8;i++){
    if(i>=reserveCount)break;
    // Forme de pilule (rayon = demi-hauteur) : pas d'angle, donc pas de « plaque ».
    vec4 r=reserves[i];
    vec2 hs=r.zw*.5;
    float radius=min(hs.x,hs.y);
    vec2 q=abs(p-(r.xy+hs))-(hs-radius);
    float dist=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
    w=max(w,1.-smoothstep(0.,reserveFeather,dist));
  }
  return w*reserveAmount;
}
void main(){
  vec2 p=vec2(gl_FragCoord.x,bufferSize.y-gl_FragCoord.y)*size/bufferSize;
  vec3 absorption=1.-textureLod(sourceImage,p/size,0.).rgb;
  vec3 d=clamp(bias-vec3(dot(weights[0],1.-absorption),dot(weights[1],1.-absorption),dot(weights[2],1.-absorption)),0.,1.);
  d*=1.-reserve(p);
  float focus=lens.z>.1?1.-smoothstep(lens.z*.65,lens.z,distance(p,lens.xy)):0.;
  // Même chemin de calcul dans tous les quadrants du curseur. Seul le poids
  // radial varie : aucune branche par zone ne peut interrompre une lecture.
  vec3 coarse=impression(d,thresholds(p,false),false);
  vec3 fine=impression(d,thresholds(p,true),true);
  vec3 result=mix(coarse,fine,focus);
  pixel=vec4(result,1.);
}`;

export function createRisoSurface({ host, source: paint, sourcePixels = null, options, onLost = () => {} }) {
  const canvas = document.createElement('canvas');
  const source = sourcePixels ? { width: 0, height: 0 } : document.createElement('canvas');
  // Petite source lisible en mémoire : éviter le transfert direct entre un
  // canvas 2D accéléré et WebGL (chemin de copie spécifique à chaque moteur).
  const ctx = sourcePixels ? null : source.getContext('2d', { alpha: false, willReadFrequently: true, colorSpace: 'srgb' });
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
  if ((!ctx && !sourcePixels) || !gl) return null;
  let program, buffer, textures = [], shaders = [], done = false, width = 0, height = 0;
  let lastSource = -Infinity, lastDraw = -Infinity, lastLens = [NaN, NaN, NaN], dirty = true;
  let textureWidth = 0, textureHeight = 0;
  const uniforms = new Map();
  const uniform = name => { if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(program, name)); return uniforms.get(name); };
  function cleanup() {
    if (done) return;
    done = true;
    textures.forEach(t => gl.deleteTexture(t)); shaders.forEach(s => gl.deleteShader(s));
    if (program) gl.deleteProgram(program); if (buffer) gl.deleteBuffer(buffer);
    canvas.remove(); host.classList.remove('gpu-lens');
  }
  try {
    program = gl.createProgram();
    for (const [type, code] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
      const shader = gl.createShader(type); shaders.push(shader); gl.shaderSource(shader, code); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    gl.bindAttribLocation(program, 0, 'p'); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program); buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    textures = ['sourceImage', 'c0', 'c1', 'c2', 'f0', 'f1', 'f2'].map((name, unit) => {
      const texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniform(name), unit);
      for (const key of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, key, unit ? gl.NEAREST : gl.LINEAR);
      for (const key of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, key, unit ? gl.REPEAT : gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
      return texture;
    });
  } catch (error) {
    cleanup(); console.warn('Riso : repli sur le rendu GrainLab standard.', error.message); return null;
  }
  canvas.className = 'riso-surface'; canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.renderer = 'grainlab-clean-lens';
  canvas.dataset.upload = sourcePixels ? 'continuous-field-v1' : 'rgba-buffer-v1';
  host.append(canvas); host.classList.add('gpu-lens');
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); if (!done) { cleanup(); onLost(); } });

  function resize() {
    if (done) return;
    width = Math.max(1, innerWidth); height = Math.max(1, innerHeight);
    const dimensions = surfaceSize(width, height, devicePixelRatio || 1);
    canvas.width = dimensions.width; canvas.height = dimensions.height;
    source.width = dimensions.sourceWidth; source.height = dimensions.sourceHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniform('size'), width, height); gl.uniform2f(uniform('bufferSize'), canvas.width, canvas.height);
    // Les points sous-échantillonnés tendent vers leur couverture moyenne,
    // plutôt que de disparaître en une zone de papier vide sur un écran 1×.
    gl.uniform1f(uniform('fineDetail'), Math.max(0, Math.min(1, 1.25 * canvas.width / width - 1)));
    dirty = true; lastSource = -Infinity;
  }
  function configure() {
    if (done) return;
    const config = normalize(options());
    const colors = config.inks.map(ink => parseHex(ink.color));
    const gain = 1 / .9;
    const weights = separationWeights(colors, 'auto').map((w, i) => w.map(v => v * config.inks[i].coverage * gain));
    gl.uniform3fv(uniform('weights'), weights.flat());
    gl.uniform3fv(uniform('bias'), weights.map((w, i) => w.reduce((a, b) => a + b, 0) - .05 * gain * config.inks[i].coverage));
    gl.uniform3fv(uniform('colors'), colors.flat()); gl.uniform3fv(uniform('paper'), parseHex(config.paper.color));
    gl.uniform3fv(uniform('density'), config.inks.map(ink => ink.density));
    const softness = Math.max(.01, config.screening.softness);
    gl.uniform1f(uniform('k'), 1 / softness); gl.uniform1f(uniform('m'), softness / 2 + .01);
    gl.uniform1i(uniform('opaque'), config.overprint === 'opaque' ? 1 : 0);
    const ratio = Math.max(2, Math.ceil(canvas.width / width));
    [5, 1.25].forEach((size, pass) => {
      const tiles = config.inks.map((ink, i) => {
        const tile = screenValues({ type: 'am', shape: 'round', size, angle: ink.angle }, config.seed, ratio);
        const values = roll(tile.values, tile.px, ink.phase);
        const pixels = Uint8Array.from(values, value => Math.round(value * 255));
        const unit = 1 + pass * 3 + i; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, tile.px, tile.px, 0, gl.RED, gl.UNSIGNED_BYTE, pixels);
        return tile.tile;
      });
      gl.uniform3fv(uniform(pass ? 'fineTiles' : 'coarseTiles'), tiles);
    });
    dirty = true; lastSource = -Infinity;
  }
  function render(now, lens, animate, sourceDirty = false) {
    if (done) return;
    // L'écran peut rafraîchir à 120 Hz ; la presse n'a pas besoin de doubler sa charge.
    if (!dirty && now - lastDraw < 1000 / 60 - .2) return;
    const updateSource = dirty || (now - lastSource >= 1000 / 12 && (animate || sourceDirty));
    const moved = [lens.x, lens.y, lens.r].some((value, i) => Math.abs(value - lastLens[i]) > .15 || !Number.isFinite(lastLens[i]));
    if (!updateSource && !moved) return;
    if (updateSource) {
      let pixels;
      if (sourcePixels) pixels = sourcePixels({ width, height, pixelWidth: source.width, pixelHeight: source.height });
      else {
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, source.width, source.height);
        paint(ctx, now / 1000, { width, height, dpr: source.width / width });
        const image = ctx.getImageData(0, 0, source.width, source.height);
        pixels = new Uint8Array(image.data.buffer, image.data.byteOffset, image.data.byteLength);
      }
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      if (textureWidth !== source.width || textureHeight !== source.height) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, source.width, source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        textureWidth = source.width; textureHeight = source.height;
      }
      // Toujours transférer le rectangle complet, dans un stockage réutilisé.
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, source.width, source.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      lastSource = now; dirty = false;
    }
    lastLens = [lens.x, lens.y, lens.r]; gl.uniform3f(uniform('lens'), ...lastLens);
    gl.drawArrays(gl.TRIANGLES, 0, 3); lastDraw = now;
  }
  /** Zones de réserve (rectangles en px CSS, 8 au plus), intensité 0–1 et fondu en px. */
  function setReserves(rects, { amount = .78, feather = 64 } = {}) {
    if (done) return;
    const list = rects.slice(0, 8);
    const flat = new Float32Array(32);
    list.forEach((r, i) => flat.set([r.x, r.y, r.width, r.height], i * 4));
    gl.uniform4fv(uniform('reserves'), flat); gl.uniform1i(uniform('reserveCount'), list.length);
    gl.uniform1f(uniform('reserveAmount'), amount); gl.uniform1f(uniform('reserveFeather'), feather);
    dirty = true;
  }
  resize(); configure(); setReserves([]);
  return { render, resize, configure, setReserves, destroy: cleanup };
}
