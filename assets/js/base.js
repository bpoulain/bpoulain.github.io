// Socle commun du site : préférences (thème, mouvement), impression GrainLab qui suit ces
// préférences, et lancement de la séquence d'entrée.
// Repris du prototype « 15 · Nuances » (bp x GrainLab), sans la barre d'outils ni la fiche
// propres à l'exploration des directions.

// GrainLab 0.12, fichier unique `grainlab.all` : cœur, renderer WebGL (enregistré à l'import)
// et fonctions internes utilisées par la surface riso. Un seul module, donc un seul cœur.
import { GrainLab, findInk } from '../../vendor/GrainLab/grainlab.all.min.js';
import '../../vendor/MoodGlyph/bp-monogram.min.js';

export { GrainLab, findInk };

// ---------- Préférences ----------

const store = {
  get(key, fallback) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
};

const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');

export const prefs = {
  themePref: store.get('bp.theme', 'auto'), // auto | light | dark
  motionPref: store.get('bp.motion', 'auto'), // auto | reduce | full
  get theme() {
    if (this.themePref === 'auto') return darkQuery.matches ? 'dark' : 'light';
    return this.themePref;
  },
  get reduced() {
    if (this.motionPref === 'auto') return motionQuery.matches;
    return this.motionPref === 'reduce';
  },
};

function applyPrefs({ silent = false } = {}) {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.motion = prefs.reduced ? 'reduce' : 'full';
  document.querySelectorAll('bp-monogram').forEach((m) => {
    m.setAttribute('theme', prefs.theme);
    m.setAttribute('motion', prefs.reduced ? 'reduce' : 'full');
  });
  if (!silent) window.dispatchEvent(new CustomEvent('prefs', { detail: { theme: prefs.theme, reduced: prefs.reduced } }));
}

applyPrefs({ silent: true });
darkQuery.addEventListener('change', () => prefs.themePref === 'auto' && applyPrefs());
motionQuery.addEventListener('change', () => prefs.motionPref === 'auto' && applyPrefs());

// ---------- Impression ----------

/**
 * Applique un effet GrainLab qui se reconstruit à chaque changement de thème ou de mouvement.
 * `options(theme)` renvoie les options GrainLab ; le seed reste le même d'un thème à l'autre.
 * Sans papier, le mode de fusion par défaut suit le thème : multiply sur clair, normal sur sombre.
 */
export function print(target, { options, fps = 12, animate = true, seed } = {}) {
  const fixedSeed = seed ?? Math.floor(Math.random() * 1e6);
  let effect = null;
  let held = null;

  const ctl = {
    get effect() {
      return effect;
    },
    build() {
      const theme = prefs.theme;
      const opts = {
        seed: fixedSeed,
        motion: prefs.reduced ? 'reduce' : 'full',
        ...(typeof options === 'function' ? options(theme) : options),
      };
      if (!('blend' in opts)) opts.blend = theme === 'dark' ? 'normal' : 'multiply';
      effect?.destroy();
      effect = GrainLab.apply(target, opts);
      if (held) effect.render(held);
      else ctl.idle();
      return ctl;
    },
    /** Animation de repos : le calage respire, sauf mouvement réduit. */
    idle() {
      held = null;
      effect.stop();
      if (animate && !prefs.reduced) effect.start({ fps });
      return ctl;
    },
    /** Fige l'effet à un instant et une amplitude donnés (pilotage par la page). */
    hold(time, amount) {
      held = { time, amount };
      effect.stop();
      effect.render(held);
      return ctl;
    },
    update(next) {
      effect.update(next);
      return ctl;
    },
  };

  window.addEventListener('prefs', () => ctl.build());
  return ctl.build();
}

/**
 * Couleur de fond de la page, pour le papier des effets WebGL (qui en demandent un).
 * Safari peut exécuter les modules avant d'appliquer `base.css` : `--bg` est alors vide, et
 * GrainLab refuse un papier vide (l'erreur interrompt tout le splash). On retombe sur les
 * valeurs de `base.css` pour le thème courant.
 */
const PAPER = { light: '#f3f0e9', dark: '#19181c' };
export const pageColor = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || PAPER[prefs.theme];

// ---------- Page ----------

/** Joue la séquence d'entrée dès que le monogramme est défini. */
export function setupPage({ play }) {
  applyPrefs({ silent: true });
  const splash = document.querySelector('.splash');
  customElements.whenDefined('bp-monogram').then(async () => {
    splash.classList.remove('is-ready');
    await play({ ready: () => splash.classList.add('is-ready') });
    splash.classList.add('is-ready');
  });
}
