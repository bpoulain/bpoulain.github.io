// Les règles de comportement sont séparées du dessin : souris, toucher et clavier
// utilisent les mêmes émotions, et les territoires partagent leur géométrie avec le fond.
export const EMOTIONS = [
  { id: 'joy', label: 'joie', state: 'J2', color: '#a95818', dark: '#e9b462', ink: 0, symbol: '✳', hint: 'Un mouvement doux, une présence qui revient.', x: .16, y: .2, speed: .37 },
  { id: 'surprise', label: 'surprise', state: 'S1', color: '#a83c64', dark: '#e897ba', ink: 2, symbol: '✦', hint: 'Un relâchement, un petit imprévu.', x: .52, y: .12, speed: .64 },
  { id: 'fear', label: 'peur', state: 'P1', color: '#604a9c', dark: '#b3a4e8', ink: 1, symbol: '⋆', hint: 'Une arrivée brusque peut le faire sursauter.', x: .85, y: .28, speed: .85 },
  { id: 'anger', label: 'colère', state: 'C2', color: '#a22f31', dark: '#e98c84', ink: 2, symbol: 'ϟ', hint: 'Tirer, recommencer… il finit par résister.', x: .82, y: .76, speed: 1.1 },
  { id: 'disgust', label: 'dégoût', state: 'D1', color: '#366448', dark: '#9ac78f', ink: 0, symbol: '∿', hint: 'Cette petite tache ne lui plaît pas beaucoup.', x: .47, y: .87, speed: .48 },
  { id: 'sadness', label: 'tristesse', state: 'T1', color: '#355b9a', dark: '#95b5e8', ink: 1, symbol: '≈', hint: 'Un peu de distance, puis le laisser rêver.', x: .12, y: .72, speed: .25 },
];
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
// `seconds` : une horloge commune, ou une horloge par territoire (tableau) pour qu'une cible
// puisse s'immobiliser pendant qu'on l'explore.
export function territoryCenter(index, seconds, reduced = false) {
  const m = EMOTIONS[index], t = reduced ? 0 : Array.isArray(seconds) ? seconds[index] : seconds;
  return { x: m.x + Math.sin(t * .07 * m.speed + index * 1.9) * .065,
    y: m.y + Math.cos(t * .09 * m.speed + index * 1.3) * .055 };
}
export function territoryAt(x, y, seconds, aspect = 1, reduced = false) {
  let index = 0, distance = Infinity;
  EMOTIONS.forEach((m, i) => {
    const c = territoryCenter(i, seconds, reduced);
    const d = Math.hypot((x - c.x) * Math.sqrt(aspect), (y - c.y) / Math.sqrt(aspect));
    if (d < distance) { distance = d; index = i; }
  });
  return { index, strength: clamp(1 - distance / .6, .2, 1) };
}
export function dragFeeling({ distance, speed, pulls }) {
  if (pulls >= 3 && distance > 70) return { id: 'anger', intensity: clamp(.4 + distance / 300, .4, 1) };
  if (speed > 1100 && distance > 35) return { id: 'fear', intensity: .85 };
  if (distance > 115) return { id: 'sadness', intensity: clamp(distance / 350, .35, 1) };
  return { id: 'surprise', intensity: clamp(.18 + distance / 300, .18, .65) };
}
export function springStep(position, dt, reduced = false) {
  if (reduced) return { x: 0, y: 0, vx: 0, vy: 0 };
  const step = Math.min(.025, dt);
  const vx = position.vx + (-155 * position.x - 17 * position.vx) * step;
  const vy = position.vy + (-155 * position.y - 17 * position.vy) * step;
  const next = { x: position.x + vx * step, y: position.y + vy * step, vx, vy };
  return Math.abs(next.x) + Math.abs(next.y) + Math.abs(vx) + Math.abs(vy) < .15 ? { x: 0, y: 0, vx: 0, vy: 0 } : next;
}
