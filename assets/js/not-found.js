// 404 : MoodGlyph central, inspiré de MadeMark (« 404 · MoodGlyph central »).
// Le monogramme statique reste affiché tant que le moteur n'est pas prêt, et en cas d'échec.
// Toucher le visage le fait passer de l'abattement (T1) à l'épuisement (T4), et inversement.
//
// Langue : GitHub Pages sert ce seul fichier pour toute adresse inconnue. Il est rendu dans la
// langue par défaut ; si l'adresse demandée commence par le préfixe d'une autre langue
// (`/fr/…`), on traduit la page et le lien de retour pointe vers l'accueil de cette langue.

const config = JSON.parse(document.getElementById('nf-i18n').textContent);
const visual = document.getElementById('nf-visual');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');

function requestedLocale() {
  const base = config.pathPrefix.replace(/\/+$/, '');
  let path = location.pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
  const match = Object.entries(config.locales).find(([, l]) => l.prefix && (path === l.prefix || path.startsWith(`${l.prefix}/`)));
  return match ? match[0] : config.defaultLocale;
}

const locale = requestedLocale();
const text = config.texts[locale]?.page ?? config.texts[config.defaultLocale].page;

if (locale !== config.defaultLocale) {
  const meta = config.texts[locale].meta;
  document.documentElement.lang = locale;
  document.title = `${meta.title} · ${config.siteTitle}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = text[el.dataset.i18n]; });
  // Textes du dictionnaire du site (seul `<br>` y figure), jamais l'adresse demandée.
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = text[el.dataset.i18nHtml]; });
  const base = config.pathPrefix.replace(/\/+$/, '');
  document.getElementById('nf-home').href = `${base}${config.locales[locale].prefix}/`;
  visual.setAttribute('aria-label', text.loading);
}

const MOODS = {
  sad: { state: 'T1', intensity: '.85', label: text.sad },
  exhausted: { state: 'T4', intensity: '.95', label: text.exhausted },
};

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
    visual.dataset.engine = 'unavailable';
    visual.setAttribute('aria-label', text.unavailable);
    visual.disabled = true;
    return;
  }

  const glyph = document.createElement('bp-monogram');
  const attrs = { fit: 'contain', fps: '24', seed: '404', label: MOODS.sad.label };
  for (const [name, value] of Object.entries(attrs)) glyph.setAttribute(name, value);

  let mood = 'sad';
  const apply = () => {
    const m = MOODS[mood];
    document.documentElement.dataset.theme = theme();
    glyph.setAttribute('state', m.state);
    glyph.setAttribute('intensity', m.intensity);
    glyph.setAttribute('label', m.label);
    glyph.setAttribute('theme', theme());
    glyph.setAttribute('motion', reduced() ? 'reduce' : 'full');
    glyph.setAttribute('life', reduced() ? 'off' : 'on');
    visual.setAttribute('aria-label', `${m.label}. ${text.toggle}`);
    visual.setAttribute('aria-pressed', String(mood === 'exhausted'));
  };
  apply();
  visual.append(glyph);
  await glyph.ready;
  visual.dataset.engine = 'ready';

  visual.addEventListener('click', () => {
    mood = mood === 'sad' ? 'exhausted' : 'sad';
    apply();
  });
  darkQuery.addEventListener('change', apply);
  motionQuery.addEventListener('change', apply);
}

init();
