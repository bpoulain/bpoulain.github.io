// Splash screen : port du prototype « 15 · Nuances » (bp x GrainLab).
import { setupPage, print, pageColor, prefs } from './base.js';
import { EMOTIONS, clamp, territoryCenter, territoryAt, dragFeeling, springStep } from './emotional-model.js';
import { createTiltExplorer } from './tilt-explorer.js';
import { territoryResponse, createExpressionPicker, organPalette } from './nuance-model.js';
import { createRisoSurface } from './riso-surface.js';
import { landscapeField, createLandscapeRaster, paintLandscape } from './landscape-field.js';
import { t, dict, states as stateLabels } from './i18n.js';

// Libellés des émotions dans la langue de la page (le modèle les porte en français).
EMOTIONS.forEach(m => { if (dict.emotions?.[m.id]) m.label = dict.emotions[m.id]; });
const expressionName = e => (e && stateLabels[e.id]) || e?.label;

// Marqueur des territoires : un seul signe pour les six humeurs (disque ou ⌘, choisi par
// `data-marker` sur le splash). La couleur de l'émotion suffit à les distinguer.
const MARKER = '<svg class="marker" viewBox="0 0 24 24" aria-hidden="true">'
  + '<circle class="marker-disc" cx="12" cy="12" r="7.5"/>'
  + '<path class="marker-command" d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>';
const $ = (id) => document.getElementById(id);
const scene = $('splash'), logo = $('logo'), mark = $('mark');
const nuances = scene.dataset.experience === 'nuances';
const hybrid = nuances || scene.dataset.experience === 'drift';
const territories = hybrid || scene.dataset.experience === 'territories';
const risograph = hybrid || !territories;
const INKS = { light: ['#e7ad32', '#536ec1', '#df726c'], dark: ['#ebbd5e', '#9caee8', '#ea9694'] };
const found = new Set();
let frameId = 0, lastTime = 0, seconds = 0, playing = false, paused = false;
let current = -1, strength = .6, targetStrength = .6, blend = [0, 0, 0, 0, 0, 0];
let position = { x: 0, y: 0, vx: 0, vy: 0 };
let pointer = { x: innerWidth / 2, y: innerHeight / 2, inside: false, time: 0, speed: 0 };
let drag = null, toyDrag = null, suppressClick = false;
let pullTimes = [], gentleTime = 0, lastInput = 0, returnAt = 0, reactionUntil = 0;
let candidate = -1, dwell = 0, forcedRegion = -1, feelingTime = 0;
let trail = [], waves = [], bond = 0, nextKeyboard = 0;
let toyPosition = null, toyMoved = false;
let touchId = null, tilt = null;
let expressionPicker = null, expression = null, organs = true, revisitAfter = 0, keyboardIntensity = 1;
const lens = { x: innerWidth / 2, y: innerHeight / 2, r: 0 };
const fieldButtons = [];
let anchorGeometry = null, anchorDirty = true, lastGaze = null;
const styles = new WeakMap();
function setStyle(el, property, value) {
  let previous = styles.get(el);
  if (!previous) { previous = {}; styles.set(el, previous); }
  if (previous[property] === value) return;
  previous[property] = value; el.style.setProperty(property, value);
}
const px = value => `${(Math.round(value * 10) / 10).toFixed(1)}px`;
const nowSeconds = () => performance.now() / 1000;
const color = (m) => prefs.theme === 'dark' ? m.dark : m.color;
function status(text) { if ($('status').textContent !== text) $('status').textContent = text; }
function anchor() {
  if (!anchorGeometry || anchorDirty) {
    const r = document.querySelector('.anchor').getBoundingClientRect();
    anchorGeometry = { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width };
    anchorDirty = false;
  }
  return anchorGeometry;
}
function gazeAt(x, y, geometry) {
  // Même géométrie que lookAt(), sans lire une boîte après les écritures CSS.
  const dx = x - geometry.x - position.x, dy = y - geometry.y - position.y;
  const size = Math.max(40, geometry.size), distance = Math.hypot(dx, dy);
  const divisor = Math.hypot(distance, 1.2 * size);
  const gaze = [dx / divisor, dy / divisor, clamp(1 - (distance / size - .6) / 2.4, 0, 1)];
  if (!lastGaze || gaze.some((value, i) => Math.abs(value - lastGaze[i]) > .002)) { logo.look(...gaze); lastGaze = gaze; }
}
function announceDiscovery(i) {
  if (found.has(i)) return;
  found.add(i);
  $('found').textContent = found.size === 6 ? t('foundAll') : t(found.size > 1 ? 'foundMany' : 'foundOne', { n: found.size });
  fieldButtons[i]?.classList.add('revealed');
}
function applyMoodColors() {
  const face = current >= 0 ? color(EMOTIONS[current]) : prefs.theme === 'dark' ? '#dae1ec' : '#243147';
  if (current >= 0) logo.style.setProperty('--face-color', face);
  else logo.style.removeProperty('--face-color');
  if (!nuances) return;
  const palette = organPalette(face);
  for (const part of ['face', 'eye', 'stem', 'bowl']) {
    if (organs) logo.style.setProperty(`--bp-${part}`, palette[part]);
    else logo.style.removeProperty(`--bp-${part}`);
    $(`swatch-${part}`).style.background = palette[part];
  }
  fieldButtons.forEach((b, i) => b.style.setProperty('--emotion-color', color(EMOTIONS[i])));
  document.querySelectorAll('.mood-actions [data-emotion]').forEach((b, i) => b.style.setProperty('--emotion-color', color(EMOTIONS[i])));
}
function feel(id, intensity = .65, hold = 0, discover = true, newVisit = false) {
  const i = EMOTIONS.findIndex(m => m.id === id);
  targetStrength = intensity;
  if (hold) reactionUntil = Math.max(reactionUntil, nowSeconds() + hold);
  const renew = nuances && i >= 0 && (newVisit || (revisitAfter > 0 && nowSeconds() >= revisitAfter));
  if (nuances) revisitAfter = 0;
  if (current !== i || renew) {
    current = i;
    feelingTime = 0;
    if (nuances && i >= 0) {
      expressionPicker ??= createExpressionPicker(logo.states);
      expression = expressionPicker(id) ?? { id: EMOTIONS[i].state, label: EMOTIONS[i].label };
      logo.state = expression.id;
    } else { expression = null; logo.state = i < 0 ? 'neutral' : EMOTIONS[i].state; }
    scene.dataset.emotion = id;
    if (nuances) {
      revisitAfter = 0;
      scene.dataset.expression = expression?.id ?? 'neutral';
      $('expression-label').textContent = expressionName(expression) ?? t('expression');
      fieldButtons.forEach((b, j) => b.classList.toggle('is-current', j === i));
    }
    applyMoodColors();
    if (i < 0) { status(t('rest')); }
    else {
      // Seule la piste Nuances est conservée sur le site : le statut nomme l'émotion.
      status(EMOTIONS[i].label);
    }
    document.querySelectorAll('.mood-actions [data-emotion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.emotion === id)));
  }
  if (discover && i >= 0) announceDiscovery(i);
  wake();
}

// Les zones de détection et le champ d'encre sont indépendants. Les six
// contributions se chevauchent ; aucune frontière de zone n'est imprimée.
function currentField() {
  return landscapeField({ seconds, reduced: prefs.reduced, territories, hybrid, blend, inks: INKS[prefs.theme], trail, waves });
}
const rasterize = createLandscapeRaster();
function landscape(ctx, _time, dimensions) { paintLandscape(ctx, currentField(), dimensions); }
const printOptions = (theme, size) => ({ renderer: 'webgl', source: landscape, process: 'riso', inks: INKS[theme], separation: 'auto',
  screening: { type: risograph ? 'am' : 'bayer', shape: 'round', size: territories ? size : 5, softness: .04 }, registration: 0,
  ink: { density: .7, irregularity: 0, spread: 0, wobble: 0 }, paper: { color: pageColor(), grain: 0, tooth: 0 },
  overprint: theme === 'dark' ? 'opaque' : 'multiply', animation: { speed: 0, amount: 0 } });
const legacyPrints = () => (territories ? (hybrid ? [5, 1.25] : [6, 1]) : [4]).map((size, i) => print($(i ? 'fine' : 'coarse'), {
  fps: 12, seed: 73,
  options: theme => printOptions(theme, size),
}));
let impressions = [];
let surface = hybrid && new URLSearchParams(location.search).get('renderer') !== 'legacy' ? createRisoSurface({
  host: $('ground'), source: landscape, sourcePixels: ({ width, height, pixelWidth, pixelHeight }) => rasterize(currentField(), pixelWidth, pixelHeight, width, height), options: () => ({ ...printOptions(prefs.theme, 5), seed: 73 }),
  onLost: () => { surface = null; impressions = legacyPrints(); syncAnimation(); wake(); },
}) : null;
if (!surface) impressions = legacyPrints();

// Mesure locale facultative pour les comparaisons entre navigateurs ; aucune télémétrie.
let meter = null, meterStart = 0, meterFrames = 0;
if (new URLSearchParams(location.search).has('perf')) {
  meter = document.createElement('output'); meter.className = 'render-perf'; meter.id = 'render-perf'; document.body.append(meter);
}

function tick(now) {
  frameId = 0;
  if (!playing || document.hidden) { lastTime = 0; return; }
  const dt = lastTime ? Math.min((now - lastTime) / 1000, .04) : 1 / 60; lastTime = now;
  if (meter) {
    meterStart ||= now; meterFrames++;
    if (now - meterStart >= 1000) { meter.textContent = `boucle ${Math.round(meterFrames * 1000 / (now - meterStart))} i/s · ${surface ? '1 canvas · source ≤ 384 px' : 'rendu standard'}`; meterFrames = 0; meterStart = now; }
  }
  const time = now / 1000;
  if (!paused && !prefs.reduced) seconds += dt;
  const a = anchor();
  if (drag) {
    const k = prefs.reduced ? 1 : 1 - Math.exp(-23 * dt);
    position.x += (drag.tx - position.x) * k; position.y += (drag.ty - position.y) * k;
  } else position = springStep(position, dt, prefs.reduced);
  const stretching = drag && !prefs.reduced ? clamp(Math.hypot(position.x, position.y) / 1800, 0, .08) : 0;
  setStyle(mark, 'transform', `translate3d(${px(position.x)}, ${px(position.y)}, 0) rotate(${prefs.reduced ? 0 : position.x * .025}deg) scale(${1 + stretching},${1 - stretching * .6})`);
  const moving = Math.abs(position.x) + Math.abs(position.y) + Math.abs(position.vx) + Math.abs(position.vy) > 0;
  const tether = drag || moving ? `M ${a.size / 2} ${a.size / 2} Q ${a.size / 2 + position.x * .15} ${a.size / 2 + position.y * .85} ${a.size / 2 + position.x} ${a.size / 2 + position.y}` : '';
  if ($('tether').getAttribute('d') !== tether) $('tether').setAttribute('d', tether);
  strength += (targetStrength - strength) * Math.min(1, dt * 8);
  if (Math.abs(logo.intensity - strength) > .015) logo.intensity = +strength.toFixed(2);
  if (nuances) {
    if (scene.dataset.intensity !== strength.toFixed(2)) scene.dataset.intensity = strength.toFixed(2);
    setStyle($('intensity-fill'), 'transform', `scaleX(${strength.toFixed(2)})`);
    const label = t(`intensity.${current < 0 ? 'rest' : strength < .2 ? 'faint' : strength < .5 ? 'subtle' : strength < .8 ? 'strong' : 'intense'}`);
    if ($('intensity-label').textContent !== label) $('intensity-label').textContent = label;
    if (current >= 0) setStyle(fieldButtons[current], '--intensity', strength.toFixed(2));
  }
  let settling = false;
  blend = blend.map((v, i) => { const goal = current === i ? strength : 0; const next = v + (goal - v) * Math.min(1, dt * 6); settling ||= Math.abs(next - goal) > .005; return next; });
  if (current >= 0) feelingTime += dt;

  if (territories) {
    fieldButtons.forEach((b, i) => { const c = territoryCenter(i, seconds, prefs.reduced); setStyle(b, 'transform', `translate3d(${px(c.x * innerWidth)}, ${px(c.y * innerHeight)}, 0)`); });
    if (!paused && (pointer.inside || forcedRegion >= 0) && !drag && time > reactionUntil) {
      const hit = forcedRegion >= 0 ? { index: forcedRegion, strength: .85, intensity: keyboardIntensity } : nuances
        ? territoryResponse(pointer.x / innerWidth, pointer.y / innerHeight, seconds, innerWidth, innerHeight, { previous: current, reduced: prefs.reduced })
        : territoryAt(pointer.x / innerWidth, pointer.y / innerHeight, seconds, innerWidth / innerHeight, prefs.reduced);
      if (candidate !== hit.index) { candidate = hit.index; dwell = 0; }
      dwell += dt;
      feel(EMOTIONS[hit.index].id, nuances ? hit.intensity : .3 + hit.strength * .65, 0, false);
      if (dwell > 1.05 && !found.has(hit.index)) {
        announceDiscovery(hit.index);
        status(t('refuge', { label: EMOTIONS[hit.index].label }));
        waves.push({ x: pointer.x / innerWidth, y: pointer.y / innerHeight, time: seconds });
      }
    }
    const tx = forcedRegion >= 0 ? territoryCenter(forcedRegion, seconds, prefs.reduced).x * innerWidth : pointer.x;
    const ty = forcedRegion >= 0 ? territoryCenter(forcedRegion, seconds, prefs.reduced).y * innerHeight : pointer.y;
    const k = prefs.reduced ? 1 : Math.min(1, dt * 9);
    lens.x += (tx - lens.x) * k; lens.y += (ty - lens.y) * k;
    lens.r += (((pointer.inside || forcedRegion >= 0) ? Math.min(innerWidth, innerHeight) * .25 : 0) - lens.r) * k;
    if (!surface) { setStyle($('ground'), '--x', px(lens.x)); setStyle($('ground'), '--y', px(lens.y)); setStyle($('ground'), '--r', px(lens.r)); }
    $('probe').classList.toggle('on', pointer.inside || forcedRegion >= 0);
    setStyle($('probe'), 'transform', `translate3d(${px(tx)}, ${px(ty)}, 0)`);
    if (hybrid) setStyle($('probe'), '--dwell', Math.min(1, dwell / 1.05).toFixed(2));
    if (pointer.inside || forcedRegion >= 0) gazeAt(tx, ty, a);
  } else if (!paused && !drag && !toyDrag && time > reactionUntil) {
    const distance = Math.hypot(pointer.x - a.x, pointer.y - a.y);
    if (pointer.inside && distance < a.size * 1.3 && pointer.speed < 180) {
      gentleTime += dt;
      if (gentleTime > 1.2) { bond = Math.min(1, bond + dt * .04); feel('joy', .45 + bond * .4); }
    } else gentleTime = 0;
    if (current >= 0 && time - lastInput > (bond > .1 ? 7 : 4) && current !== 5) {
      if (bond > .1 && !prefs.reduced) { feel('sadness', .4, 2); lastInput = time - 3; }
      else feel('neutral', 1);
    }
    if (current === 5 && time - lastInput > 10) feel('neutral', 1);
  }
  if (returnAt && time > returnAt && !drag) { returnAt = 0; feel('neutral', 1); }
  if (pointer.inside && !territories) gazeAt(pointer.x, pointer.y, a);
  else if (!pointer.inside && forcedRegion < 0 && !drag && lastGaze) { logo.look(null); lastGaze = null; }
  pointer.speed *= Math.exp(-5 * dt);
  trail = trail.filter(p => seconds - p.time < 8); waves = waves.filter(p => seconds - p.time < 1.6);
  if ((prefs.reduced || paused) && settling) impressions.forEach(p => p.hold(0, 0));
  updateReserves(now);
  surface?.render(now, lens, !paused && !prefs.reduced, settling);
  if ((!paused && !prefs.reduced) || drag || moving || settling || returnAt > time || (territories && (pointer.inside || forcedRegion >= 0)) || (!territories && pointer.inside && !paused)) wake();
  else lastTime = 0;
}
// Réserve tramée sous les textes : la trame s'éclaircit autour d'eux pour qu'ils se lisent,
// sans plaque ni cadre. Les rectangles suivent la mise en page (mesurés au plus 5 fois/s).
const RESERVED = ['.lang-switch', '.lockup .name', '.lockup .sig', '#status', '#hint', '#nuance-readout', '#found', '#input-hint'];
let reservesAt = -Infinity, reservesKey = '';
function updateReserves(now) {
  if (!surface || now - reservesAt < 200) return;
  reservesAt = now;
  const pad = 6;
  const rects = RESERVED.map(sel => document.querySelector(sel)).filter(el => el && el.offsetParent !== null && !el.closest('.notes') && el.textContent.trim())
    .map(el => { const r = el.getBoundingClientRect(); return { x: r.x - pad, y: r.y - pad, width: r.width + pad * 2, height: r.height + pad * 2 }; })
    .filter(r => r.width > pad * 2 && r.height > pad * 2);
  const key = rects.map(r => [r.x, r.y, r.width, r.height].map(Math.round).join(',')).join(';');
  if (key === reservesKey) return;
  reservesKey = key; surface.setReserves(rects);
}
function wake() { if (playing && !document.hidden) frameId ||= requestAnimationFrame(tick); }
function interactiveTarget(e) { return e.target.closest('button,a,select,input,aside,.tools'); }
function explorationPoint(e) {
  if (hybrid && e.pointerType === 'touch' && !drag) return { x: clamp(e.clientX, 16, innerWidth - 16), y: clamp(e.clientY - 42, 90, innerHeight - 105) };
  return { x: e.clientX, y: e.clientY };
}

scene.addEventListener('pointermove', e => {
  if (!playing || (drag && drag.id !== e.pointerId) || (toyDrag && toyDrag.id !== e.pointerId)) return;
  if (hybrid && e.pointerType === 'touch' && touchId !== null && touchId !== e.pointerId) return;
  if (hybrid && e.pointerType === 'mouse' && tilt?.active && !drag) return;
  if (hybrid && e.pointerType === 'mouse') scene.dataset.input = 'mouse';
  const time = nowSeconds(), elapsed = Math.max(.016, time - pointer.time);
  const speed = Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) / elapsed;
  const point = explorationPoint(e);
  pointer = { ...point, inside: !interactiveTarget(e) || !!drag || !!toyDrag || !!e.target.closest('#mark,.field-target') || touchId === e.pointerId, time, speed };
  lastInput = time; forcedRegion = -1;
  const a = anchor();
  if (drag) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, distance = Math.hypot(dx, dy);
    drag.moved ||= distance > 6;
    drag.tx = clamp(dx * .58, -a.x + a.size * .45, innerWidth - a.x - a.size * .45);
    drag.ty = clamp(dy * .58, -a.y + a.size * .45, innerHeight - a.y - a.size * .45);
    const f = dragFeeling({ distance, speed, pulls: pullTimes.length });
    feel(f.id, f.intensity, .2);
    if (seconds - (trail.at(-1)?.time ?? -1) > .14) trail.push({ x: (a.x + drag.tx) / innerWidth, y: (a.y + drag.ty) / innerHeight, ink: EMOTIONS[current]?.ink ?? 1, time: seconds });
  } else if (toyDrag) {
    toyMoved ||= Math.hypot(e.clientX - toyDrag.x, e.clientY - toyDrag.y) > 6;
    toyPosition = { x: clamp(e.clientX, 25, innerWidth - 25), y: clamp(e.clientY, 100, innerHeight - 90) };
    $('ink-toy').style.left = `${toyPosition.x - 22}px`; $('ink-toy').style.top = `${toyPosition.y - 22}px`;
    if (Math.hypot(toyPosition.x - a.x, toyPosition.y - a.y) < a.size * .8) feel('disgust', .9, 2);
  } else if (!territories && !paused && time > reactionUntil && speed > 1100 && Math.hypot(e.clientX - a.x, e.clientY - a.y) < a.size * 1.1) {
    gentleTime = 0; feel('fear', .8, 1.2);
  }
  wake();
});
scene.addEventListener('pointerdown', e => {
  if (!territories || interactiveTarget(e) || e.button !== 0) return;
  if (hybrid && touchId !== null && e.pointerId !== touchId) return;
  if (hybrid && e.pointerType === 'touch') {
    tilt?.stop(t('touchLift'));
    touchId = e.pointerId; scene.setPointerCapture(e.pointerId); scene.dataset.input = 'touch';
  }
  const p = explorationPoint(e);
  pointer.x = p.x; pointer.y = p.y; pointer.inside = true; forcedRegion = -1; wake();
});
function releaseTouch(e) {
  if (touchId !== e.pointerId) return;
  touchId = null;
  if (scene.hasPointerCapture(e.pointerId)) scene.releasePointerCapture(e.pointerId);
  // Le doigt peut quitter l'écran : le curseur demeure, et la découverte continue.
  pointer.inside = e.type === 'pointerup'; wake();
}
function cancelTouch() {
  const id = touchId; touchId = null;
  if (id !== null && scene.hasPointerCapture(id)) scene.releasePointerCapture(id);
}
if (hybrid) {
  scene.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' && !e.target.closest('.mobile-exploration')) tilt?.stop(t('touchStay'));
  }, true);
  scene.addEventListener('pointerup', releaseTouch);
  scene.addEventListener('pointercancel', releaseTouch);
  scene.addEventListener('lostpointercapture', releaseTouch);
}
scene.addEventListener('pointerleave', () => { if (drag || toyDrag || (hybrid && (touchId !== null || scene.dataset.input === 'touch' || tilt?.active))) return; pointer.inside = false; if (nuances) revisitAfter = nowSeconds() + .65; gentleTime = 0; candidate = -1; dwell = 0; wake(); });
mark.addEventListener('pointerdown', e => {
  if (!playing || e.button !== 0 || drag || toyDrag || touchId !== null) return;
  e.preventDefault();
  if (hybrid && e.pointerType === 'touch') tilt?.stop(t('touch'));
  const time = nowSeconds();
  pullTimes = pullTimes.filter(t => time - t < 7); pullTimes.push(time);
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, tx: position.x, ty: position.y, moved: false, family: current };
  returnAt = 0; suppressClick = false; mark.setPointerCapture(e.pointerId); mark.classList.add('dragging');
  if (!nuances) feel('surprise', .25);
  wake();
});
function release(cancelled = false) {
  if (!drag) return;
  const old = drag; drag = null; suppressClick = true;
  if (mark.hasPointerCapture(old.id)) mark.releasePointerCapture(old.id);
  mark.classList.remove('dragging');
  if (cancelled) { returnAt = 0; feel('neutral', 1); }
  else if (nuances && !old.moved) {
    const family = old.family >= 0 ? old.family : nextKeyboard++ % 6;
    feel(EMOTIONS[family].id, targetStrength, .9, true, true);
    returnAt = 0;
  }
  else {
    feel('surprise', old.moved ? .85 : .5, .9);
    const a = anchor(); waves.push({ x: (a.x + position.x) / innerWidth, y: (a.y + position.y) / innerHeight, time: seconds });
    returnAt = nowSeconds() + (prefs.reduced ? .25 : 1.2);
    bond = clamp(bond + .06, 0, 1);
  }
  lastInput = nowSeconds(); wake();
}
mark.addEventListener('pointerup', e => { if (e.pointerId === drag?.id) release(); });
mark.addEventListener('pointercancel', e => { if (e.pointerId === drag?.id) release(true); });
mark.addEventListener('lostpointercapture', e => { if (e.pointerId === drag?.id) release(true); });
mark.addEventListener('click', e => {
  if (e.detail && suppressClick) { suppressClick = false; return; }
  if (e.detail === 0) { const m = nuances && current >= 0 ? EMOTIONS[current] : EMOTIONS[nextKeyboard++ % 6]; feel(m.id, nuances ? keyboardIntensity : .8, 2, true, nuances); if (territories) forcedRegion = EMOTIONS.indexOf(m); lastInput = nowSeconds(); }
});
const toy = $('ink-toy');
if (toy) {
  toy.addEventListener('pointerdown', e => { if (e.button !== 0 || drag || toyDrag) return; e.preventDefault(); toyMoved = false; toyDrag = { id: e.pointerId, x: e.clientX, y: e.clientY }; toy.setPointerCapture(e.pointerId); });
  const releaseToy = e => { if (toyDrag?.id !== e.pointerId) return; toyDrag = null; if (toy.hasPointerCapture(e.pointerId)) toy.releasePointerCapture(e.pointerId); wake(); };
  toy.addEventListener('pointerup', releaseToy); toy.addEventListener('pointercancel', releaseToy); toy.addEventListener('lostpointercapture', releaseToy);
  toy.addEventListener('click', e => { if (e.detail === 0 || !toyMoved) { feel('disgust', .9, 2); lastInput = nowSeconds(); } });
}
EMOTIONS.forEach((m, i) => {
  const invitation = document.createElement('button'); invitation.type = 'button'; invitation.dataset.emotion = m.id; invitation.setAttribute('aria-pressed', 'false');
  const invitationHint = nuances ? t('invitations', { n: logo.states.filter(s => s.emotion === m.id).length }) : m.hint;
  invitation.innerHTML = `${MARKER}${m.label}<small>${invitationHint}</small>`;
  invitation.addEventListener('click', () => { returnAt = 0; feel(m.id, nuances ? keyboardIntensity : .8, 2, true, nuances); lastInput = nowSeconds(); if (territories) forcedRegion = i; });
  $('mood-actions').append(invitation);
  if (territories) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'field-target'; b.setAttribute('aria-label', t('territory', { label: m.label })); b.innerHTML = `<span aria-hidden="true">${MARKER}</span>`;
    b.addEventListener('focus', () => { forcedRegion = i; if (nuances) keyboardIntensity = 1; wake(); });
    b.addEventListener('blur', () => { if (forcedRegion === i) forcedRegion = -1; wake(); });
    b.addEventListener('click', () => { forcedRegion = i; feel(m.id, nuances ? keyboardIntensity : .85, 0, true, nuances); lastInput = nowSeconds(); wake(); });
    if (nuances) b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault(); e.stopPropagation(); forcedRegion = i;
      keyboardIntensity = clamp(keyboardIntensity + (e.key === 'ArrowUp' ? .1 : -.1), .06, 1);
      feel(m.id, keyboardIntensity, 0, false); wake();
    });
    $('targets').append(b); fieldButtons.push(b);
  }
});
// Écran compact (téléphone) : seuls le nom et la signature restent sur la scène (CSS).
// L'inclinaison, son message et la pause passent dans « Quelques indices » : ce sont les
// mêmes nœuds, déplacés, donc leurs écouteurs les suivent.
const compact = matchMedia('(max-width: 700px)');
const movable = [scene.querySelector('.mobile-exploration'), $('pause')];
function placeControls() {
  movable.forEach(el => (compact.matches ? $('notes-controls') : scene).append(el));
}
placeControls();
compact.addEventListener('change', placeControls);
function notes(open, restore = true) {
  $('notes').hidden = !open; $('notes').inert = !open; $('help').setAttribute('aria-expanded', String(open));
  if (open) { pointer.inside = false; $('notes').querySelector('button').focus(); }
  else if (restore) $('help').focus();
}
$('help').addEventListener('click', () => notes($('notes').hidden));
$('notes').querySelector('.close-notes').addEventListener('click', () => notes(false));
if (nuances) $('organ-toggle').addEventListener('click', () => {
  organs = !organs; $('organ-toggle').setAttribute('aria-pressed', String(organs)); applyMoodColors();
});
if (hybrid) {
  tilt = createTiltExplorer({
    messages: dict.tiltMessages,
    onPoint: p => {
      if (drag || paused || !$('notes').hidden) return;
      pointer.x = p.x * innerWidth; pointer.y = p.y * innerHeight; pointer.inside = true;
      forcedRegion = -1; lastInput = nowSeconds(); scene.dataset.input = 'tilt'; wake();
    },
    onMessage: text => { $('input-hint').textContent = text; },
    onActive: (active, waiting) => {
      $('tilt-toggle').textContent = active || waiting ? t('tiltOn') : t('tiltOff');
      $('tilt-toggle').setAttribute('aria-pressed', String(active || waiting));
      $('tilt-center').hidden = !active;
      if (!active && !waiting) scene.dataset.input = 'touch';
      // Sur écran compact, le bouton vit dans les indices : on les referme pour explorer.
      if (active && compact.matches && !$('notes').hidden) notes(false, false);
    },
  });
  $('tilt-toggle').addEventListener('click', () => tilt.active ? tilt.stop(t('touchStay')) : tilt.start());
  $('tilt-center').addEventListener('click', () => tilt.recenter());
}
function syncAnimation() {
  logo.setAttribute('life', paused || prefs.reduced ? 'off' : 'on');
  impressions.forEach(p => paused || prefs.reduced ? p.hold(0, 0) : p.idle());
  $('pause').setAttribute('aria-pressed', String(paused)); $('pause').textContent = paused ? t('resume') : t('pause');
  lastTime = 0; wake();
}
$('pause').addEventListener('click', () => { paused = !paused; if (paused) tilt?.stop(t('paused')); syncAnimation(); });
// Capture : les flèches employées dans ces contrôles restent dans ces contrôles.
addEventListener('keydown', e => {
  if (e.key === 'Escape') { tilt?.stop(t('escape')); cancelTouch(); release(true); toyDrag = null; forcedRegion = -1; returnAt = 0; reactionUntil = 0; pointer.inside = false; feel('neutral', 1); notes(false, !$('notes').hidden); }
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.target.closest('.notes,.field-target,#mark')) e.stopImmediatePropagation();
}, true);
addEventListener('blur', () => { cancelTouch(); release(true); toyDrag = null; pointer.inside = false; });
addEventListener('resize', () => { anchorDirty = true; surface?.resize(); cancelTouch(); release(true); toyDrag = null; toyPosition = null; if (toy) { toy.style.left = ''; toy.style.top = ''; } wake(); });
document.fonts?.ready.then(() => { anchorDirty = true; wake(); });
addEventListener('prefs', () => { surface?.configure(); applyMoodColors(); syncAnimation(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { tilt?.stop(t('hidden')); cancelTouch(); release(true); cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; } else wake(); });
addEventListener('pagehide', () => tilt?.stop());

setupPage({
  play: async ({ ready }) => {
    tilt?.stop(); cancelTouch(); release(true); anchorDirty = true; position = { x: 0, y: 0, vx: 0, vy: 0 }; playing = true;
    returnAt = reactionUntil = 0; gentleTime = bond = 0; candidate = forcedRegion = -1; dwell = 0; pullTimes = []; trail = []; waves = [];
    pointer.inside = false; found.clear(); fieldButtons.forEach(b => b.classList.remove('revealed'));
    revisitAfter = 0; keyboardIntensity = 1;
    $('found').textContent = t('foundNone'); lastInput = nowSeconds();
    feel('neutral', 1); status(t('start'));
    await logo.ready; applyMoodColors(); ready(); syncAnimation(); wake();
  },
});
