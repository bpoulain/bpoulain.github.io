// Textes des scripts, dans la langue de la page. Le template les injecte en JSON dans
// `<script type="application/json" id="i18n">` (voir `src/_data/i18n.js`).
// Sans ce bloc, `t()` renvoie la clé : un oubli se voit à l'écran sans casser la page.

const node = document.getElementById('i18n');
const data = node ? JSON.parse(node.textContent) : {};

export const lang = document.documentElement.lang || 'en';
export const dict = data.script ?? {};
export const states = data.states ?? {};

/** `t('foundMany', { n: 3 })` : lit une clé (chemin pointé possible) et remplace `{n}`, `{label}`… */
export function t(key, vars = {}) {
  const value = key.split('.').reduce((o, k) => o?.[k], dict);
  if (typeof value !== 'string') return key;
  return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}
