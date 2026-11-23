// À propos : MoodGlyph tendre (J4) en tête de page, monogramme statique en secours tant que le
// moteur n'est pas prêt ou s'il est indisponible. Décoratif : le nom est dans la légende.

const figure = document.getElementById('about-figure');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
const theme = () => {
  const t = read('bp.theme');
  return !t || t === 'auto' ? (darkQuery.matches ? 'dark' : 'light') : t;
};
const reduced = () => {
  const m = read('bp.motion');
  return !m || m === 'auto' ? motionQuery.matches : m === 'reduce';
};

async function init() {
  try {
    await import('../../vendor/MoodGlyph/bp-monogram.min.js');
  } catch {
    figure.dataset.engine = 'unavailable';
    return;
  }
  const glyph = document.createElement('bp-monogram');
  glyph.setAttribute('aria-hidden', 'true');
  const attrs = { fit: 'contain', fps: '24', seed: '73', state: 'J4', intensity: '.8' };
  for (const [name, value] of Object.entries(attrs)) glyph.setAttribute(name, value);
  const apply = () => {
    document.documentElement.dataset.theme = theme();
    glyph.setAttribute('theme', theme());
    glyph.setAttribute('motion', reduced() ? 'reduce' : 'full');
    glyph.setAttribute('life', reduced() ? 'off' : 'on');
  };
  apply();
  figure.prepend(glyph);
  await glyph.ready;
  figure.dataset.engine = 'ready';
  darkQuery.addEventListener('change', apply);
  motionQuery.addEventListener('change', apply);
}

init();
