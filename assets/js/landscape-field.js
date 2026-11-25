import { EMOTIONS, territoryCenter } from './emotional-model.js';

const colors = new Map();
function rgb(hex) {
  if (!colors.has(hex)) colors.set(hex, hex.match(/[0-9a-f]{2}/gi).map(v => parseInt(v, 16) / 255));
  return colors.get(hex);
}
const smooth = t => t * t * (3 - 2 * t);
export function fieldFalloff(distance) {
  if (distance >= 1) return 0;
  if (distance <= 0) return 1;
  return distance < .24 ? 1 - .15 * smooth(distance / .24) : .85 * (1 - smooth((distance - .24) / .76));
}

// Aucun « territoire gagnant » ici : chaque point peut recevoir toutes les
// encres. Les zones de détection servent uniquement au choix de l'expression.
export function landscapeField({ seconds, drift, reduced, territories, hybrid, blend, inks, trail = [], waves = [] }) {
  const t = reduced ? 0 : seconds;
  const masses = [];
  const mass = (x, y, rx, ry, color, opacity) => {
    if (opacity > 0) masses.push({ x, y, rx, ry, color, rgb: rgb(color), opacity });
  };
  mass(.22 + Math.sin(t * .06) * .12, .28, 1.05, .98, inks[0], .42);
  mass(.82, .55 + Math.sin(t * .08) * .12, .95, 1.05, inks[1], .34);
  mass(.36, .9, 1, .8, inks[2], .28);
  EMOTIONS.forEach((m, i) => {
    const c = territories ? territoryCenter(i, drift ?? t, reduced) : { x: .5 + Math.cos(t * .07 + i * 1.05) * .4, y: .5 + Math.sin(t * .09 + i * 1.05) * .38 };
    const active = blend[i];
    let rx = .4 + active * .19, ry = .48 + (reduced ? 0 : Math.sin(t * m.speed + i) * .035);
    if (m.id === 'sadness') { c.y += active * .1; ry += active * .25; }
    if (m.id === 'fear') { rx -= active * .14; ry -= active * .1; }
    if (m.id === 'joy') { rx += active * .12; c.y -= active * .06; }
    if (m.id === 'anger' && !reduced) c.x += Math.sin(t * 3.5) * active * .012;
    if (m.id === 'disgust') c.x += active * .1;
    mass(c.x, c.y, rx, ry, inks[m.ink], (territories && !hybrid ? .27 : .08) + active * .35);
    if (m.id === 'disgust') mass(c.x, c.y, rx * .9, ry * .9, inks[1], .12 + active * .16);
  });
  trail.forEach(p => mass(p.x, p.y, .09, .12, inks[p.ink], Math.max(0, .2 * (1 - (seconds - p.time) / 8))));
  const rings = reduced ? [] : waves.filter(p => seconds - p.time < 1.6).map(p => ({
    x: p.x, y: p.y, rx: 20 + (seconds - p.time) * 170, ry: 14 + (seconds - p.time) * 110,
    rgb: rgb(inks[2]), color: inks[2], opacity: .35 * (1 - (seconds - p.time) / 1.6), angle: -.25,
  }));
  return { masses, rings };
}

// Source calculée en mémoire, indépendante du moteur Canvas 2D du navigateur.
// Les limites d'ellipse ont une valeur ET une pente nulles : pas de bord de
// rectangle ni de frontière de Voronoï susceptible d'apparaître à l'impression.
export function createLandscapeRaster() {
  let pixels, channels, width = 0, height = 0;
  return (field, nextWidth, nextHeight, viewportWidth = nextWidth, viewportHeight = nextHeight) => {
    if (width !== nextWidth || height !== nextHeight) {
      width = nextWidth; height = nextHeight;
      pixels = new Uint8Array(width * height * 4); channels = new Float32Array(width * height * 3);
    }
    channels.fill(1);
    for (const m of field.masses) {
      const cx = m.x * width, cy = m.y * height, rx = m.rx * width, ry = m.ry * height;
      const x0 = Math.max(0, Math.ceil(cx - rx - .5)), x1 = Math.min(width - 1, Math.floor(cx + rx - .5));
      const y0 = Math.max(0, Math.ceil(cy - ry - .5)), y1 = Math.min(height - 1, Math.floor(cy + ry - .5));
      const absorption = m.rgb.map(c => (1 - c) * m.opacity);
      const xs = new Float32Array(Math.max(0, x1 - x0 + 1));
      for (let x = x0; x <= x1; x++) xs[x - x0] = ((x + .5 - cx) / rx) ** 2;
      for (let y = y0; y <= y1; y++) {
        const yy = ((y + .5 - cy) / ry) ** 2;
        for (let x = x0; x <= x1; x++) {
          const rr = xs[x - x0] + yy;
          if (rr >= 1) continue;
          const alpha = fieldFalloff(Math.sqrt(rr)), at = (y * width + x) * 3;
          channels[at] *= 1 - absorption[0] * alpha;
          channels[at + 1] *= 1 - absorption[1] * alpha;
          channels[at + 2] *= 1 - absorption[2] * alpha;
        }
      }
    }
    // Ondes de découverte, elles aussi calculées sans clip Canvas 2D.
    for (const ring of field.rings) {
      const cx = ring.x * width, cy = ring.y * height;
      const rx = ring.rx * width / viewportWidth, ry = ring.ry * height / viewportHeight;
      const cos = Math.cos(ring.angle), sin = Math.sin(ring.angle);
      const reach = Math.max(rx, ry) + 2, halfWidth = Math.max(.5, width / viewportWidth);
      for (let y = Math.max(0, Math.floor(cy - reach)); y < Math.min(height, Math.ceil(cy + reach)); y++) {
        for (let x = Math.max(0, Math.floor(cx - reach)); x < Math.min(width, Math.ceil(cx + reach)); x++) {
          const dx = x + .5 - cx, dy = y + .5 - cy;
          const distance = Math.hypot((cos * dx + sin * dy) / rx, (-sin * dx + cos * dy) / ry);
          const alpha = Math.max(0, 1 - Math.abs(distance - 1) * Math.min(rx, ry) / halfWidth) * ring.opacity;
          if (!alpha) continue;
          const at = (y * width + x) * 3;
          for (let c = 0; c < 3; c++) channels[at + c] *= 1 - (1 - ring.rgb[c]) * alpha;
        }
      }
    }
    for (let i = 0, j = 0; i < channels.length; i += 3, j += 4) {
      pixels[j] = Math.round(channels[i] * 255); pixels[j + 1] = Math.round(channels[i + 1] * 255);
      pixels[j + 2] = Math.round(channels[i + 2] * 255); pixels[j + 3] = 255;
    }
    return pixels;
  };
}

// Repli GrainLab standard : la même géométrie, peinte sur toute la feuille.
export function paintLandscape(ctx, field, { width, height, dpr }) {
  const w = width * dpr, h = height * dpr;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  for (const m of field.masses) {
    ctx.save(); ctx.translate(m.x * w, m.y * h); ctx.scale(m.rx * w, m.ry * h);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    for (let i = 0; i <= 12; i++) gradient.addColorStop(i / 12, `rgba(${m.rgb.map(c => Math.round(c * 255)).join(',')},${m.opacity * fieldFalloff(i / 12)})`);
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = gradient;
    ctx.fillRect(-m.x / m.rx, -m.y / m.ry, 1 / m.rx, 1 / m.ry); ctx.restore();
  }
  for (const r of field.rings) {
    ctx.save(); ctx.scale(dpr, dpr); ctx.strokeStyle = `rgba(${r.rgb.map(c => Math.round(c * 255)).join(',')},${r.opacity})`;
    ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(r.x * width, r.y * height, r.rx, r.ry, r.angle, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
}
