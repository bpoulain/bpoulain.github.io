import { clamp, territoryCenter } from './emotional-model.js';

// La même distance en pixels est perçue de la même façon sur les deux axes.
// Une marge de 18 px évite les changements de famille au moindre frémissement.
export function territoryResponse(x, y, seconds, width, height, { previous = -1, reduced = false } = {}) {
  const centers = Array.from({ length: 6 }, (_, i) => territoryCenter(i, seconds, reduced));
  const distances = centers.map(c => Math.hypot((x - c.x) * width, (y - c.y) * height));
  let index = distances.indexOf(Math.min(...distances));
  if (previous >= 0 && previous < 6 && distances[previous] <= distances[index] + 18) index = previous;
  const c = centers[index];
  const spacing = Math.min(...centers.filter((_, i) => i !== index).map(other => Math.hypot((c.x - other.x) * width, (c.y - other.y) * height)));
  const radius = Math.max(64, spacing * .82);
  const proximity = clamp(1 - distances[index] / radius, 0, 1);
  const smooth = proximity * proximity * (3 - 2 * proximity);
  return { index, distance: distances[index], radius, intensity: .06 + .94 * smooth };
}

// Un paquet mélangé par famille : chaque état est rencontré avant de recommencer,
// sans répétition immédiate à la jonction de deux paquets.
export function createExpressionPicker(states, random = Math.random) {
  const families = new Map(), bags = new Map(), last = new Map();
  for (const state of states) {
    if (!state.emotion || state.id === 'neutral') continue;
    const list = families.get(state.emotion) ?? [];
    if (!list.some(s => s.id === state.id)) list.push(state);
    families.set(state.emotion, list);
  }
  return family => {
    const choices = families.get(family) ?? [];
    if (!choices.length) return null;
    let bag = bags.get(family);
    if (!bag?.length) {
      bag = [...choices];
      for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
      if (bag.length > 1 && bag[0].id === last.get(family)) [bag[0], bag[1]] = [bag[1], bag[0]];
      bags.set(family, bag);
    }
    const picked = bag.shift(); last.set(family, picked.id); return picked;
  };
}

const rgb = hex => hex.match(/[0-9a-f]{2}/gi).map(h => parseInt(h, 16) / 255);
const luminance = hex => rgb(hex).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
export function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function hsl(hex) {
  const [r, g, b] = rgb(hex), max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  let h = 0;
  if (d) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; }
  return { h: (h * 60 + 360) % 360, s: d ? d / (1 - Math.abs(2 * l - 1)) : .3, l };
}
function fromHsl(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  const v = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + v.map(n => Math.round((n + m) * 255).toString(16).padStart(2, '0')).join('');
}
function contrastingHue(h, s, initial, background, minimum) {
  const lighter = luminance(background) < .3;
  let result;
  for (let i = 0; i <= 30; i++) {
    const l = clamp(initial + (lighter ? 1 : -1) * i * .025, .035, .965);
    result = fromHsl(h, s, l);
    if (contrast(result, background) >= minimum) return result;
  }
  return result;
}
function separatedHue(h, s, background, face, onBackground, fromFace) {
  let best = null, score = -Infinity;
  // Toujours plus foncé que la face : le même parti pour les six humeurs.
  for (let i = 3; i < hsl(face).l * 100; i++) {
    const candidate = fromHsl(h, s, i / 100);
    const value = Math.min(contrast(candidate, background) / onBackground, contrast(candidate, face) / fromFace);
    if (value > score) { score = value; best = candidate; }
  }
  return best;
}
export function organPalette(face) {
  const { h, s } = hsl(face);
  const light = '#fffaf2', dark = '#142036';
  const bowl = contrast(face, light) >= contrast(face, dark) ? light : dark;
  // Panse claire (thème clair) : l'œil sombre se détache déjà de la face.
  // Panse sombre (thème sombre) : la face est un pastel clair, et un œil encore plus clair
  // se confondrait avec elle. On cherche alors, dans la même teinte, le ton moyen qui se lit
  // à la fois sur la panse (4,5:1) et contre la face (1,8:1).
  const eye = bowl === light
    ? contrastingHue(h, clamp(s, .4, .75), .19, bowl, 4.5)
    : separatedHue(h, clamp(s, .55, .8), bowl, face, 4.5, 1.8);
  const stem = contrastingHue((h + 180) % 360, clamp(s, .45, .72), luminance(face) < .3 ? .72 : .24, face, 3);
  return { face, eye, stem, bowl };
}
