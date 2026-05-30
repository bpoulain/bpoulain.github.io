/*!
 *  markitlab v1.0.0
 *  © 2026 Benoît Poulain
 *
 *  ██████╗ ██████╗
 *  ██╔══██╗██╔══██╗
 *  ██████╔╝██████╔╝
 *  ██╔══██╗██╔═══╝
 *  ██████╔╝██║
 *  ╚═════╝ ╚═╝
 *
 *  nodus v1.0.0 — © 2026 benoit poulain
 */
console.info('%c' + "markitlab" + '%c  v' + "1.0.0" + '  ·  © 2026 Benoît Poulain','color:#3b82f6;font-weight:700;font-size:13px','color:#6b7280;font-size:11px');

import { signal, component } from 'reefjs';
import { marked } from 'marked';

// core/icons.js
// Registre portable — changer de lib d'icônes = changer un seul registerIcons()
// dans le projet, zéro impact sur les composants.

const _registry = new Map();

/**
 * Enregistrer un set d'icônes.
 * iconSet = { name: '<path d="..."/>' }  — contenu SVG sans la balise <svg>.
 * Peut être appelé plusieurs fois pour merger des sets.
 *
 * @param {Record<string, string>} iconSet
 */
function registerIcons(iconSet) {
  for (const [name, content] of Object.entries(iconSet)) {
    _registry.set(name, content);
  }
}

/**
 * Retourne un SVG inline prêt à injecter dans un template string.
 *
 * @param {string} name
 * @param {object} [opts]
 * @param {number} [opts.size=16]          — largeur et hauteur en px
 * @param {string} [opts.label]            — si présent : role="img" aria-label (icône non-décorative)
 * @param {string} [opts.className='']
 * @param {number} [opts.strokeWidth=2]    — épaisseur du trait
 * @param {string} [opts.fill='none']      — remplissage (ex: 'currentColor' pour les icônes pleines)
 * @param {string} [opts.stroke='currentColor'] — couleur du trait ('none' pour les icônes pleines)
 * @returns {string}
 */
function Icon(name, {
  size = 16,
  label,
  className = '',
  strokeWidth = 2,
  fill = 'none',
  stroke = 'currentColor',
} = {}) {
  const content = _registry.get(name);
  if (!content) {
    console.warn(`[nodus] Icon "${name}" not registered`);
    return '';
  }
  return `<svg
    width="${size}" height="${size}"
    viewBox="0 0 24 24"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="${label ? 'false' : 'true'}"
    ${label     ? `role="img" aria-label="${label}"` : ''}
    ${className ? `class="${className}"`             : ''}
  >${content}</svg>`;
}

// core/icons-lucide.js
// Subset Lucide optimisé pour Nodus — paths SVG sans balise <svg>.
//
// Deux groupes :
//   nodusSystemIcons   (15) — icônes utilisées en interne par les composants Nodus
//   nodusExtendedIcons (22) — icônes utiles dans les applications / démos
//   nodusIcons         (37) — union des deux (export principal)
//
// Usage :
//   import { registerIcons } from 'nodus/core/icons.js';
//   import { nodusIcons }    from 'nodus/core/icons-lucide.js';
//   registerIcons(nodusIcons);
//
//   import { Icon } from 'nodus/core/icons.js';
//   const svg = Icon('chevron-down');          // inline SVG 16×16
//   const svg = Icon('trash', { size: 14 });  // inline SVG 14×14

// ── System — composants Nodus ────────────────────────────────────────────────

const nodusSystemIcons = {

  // Navigation / chevrons
  'chevron-down':  `<polyline points="6 9 12 15 18 9"/>`,
  'chevron-up':    `<polyline points="18 15 12 9 6 15"/>`,
  'chevron-left':  `<polyline points="15 18 9 12 15 6"/>`,
  'chevron-right': `<polyline points="9 18 15 12 9 6"/>`,

  // Recherche
  'search': `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,

  // Validation / fermeture
  'check': `<polyline points="20 6 9 17 4 12"/>`,
  'x':     `<path d="M18 6 6 18M6 6l12 12"/>`,

  // Calendrier
  'calendar': `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>` +
              `<line x1="16" y1="2" x2="16" y2="6"/>` +
              `<line x1="8" y1="2" x2="8" y2="6"/>` +
              `<line x1="3" y1="10" x2="21" y2="10"/>`,

  // Navigation applicative
  'menu':        `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`,
  'arrow-right': `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,

  // Feedback / Toast
  'info':           `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,
  'check-circle':   `<circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/>`,
  'alert-circle':   `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
  'alert-triangle': `<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  'loader':         `<path d="M21 12a9 9 0 1 1-6.219-8.56"/>`,

  // Indicateur radio (fill required — utiliser Icon('dot', { fill:'currentColor', stroke:'none' }))
  'dot':            `<circle cx="12" cy="12" r="8"/>`,

  // Composants Input — stepper
  'plus':  `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  'minus': `<line x1="5" y1="12" x2="19" y2="12"/>`,

  // CopyButton
  'copy':  `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,

};

// ── Extended — démos & applications ─────────────────────────────────────────

const nodusExtendedIcons = {

  // Génériques
  'star':  `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  'heart': `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
  'plus':  `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  'trash': `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>`,
  'user':  `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  'bell':  `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  'copy':  `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
  'cut':   `<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>`,

  // Settings / config
  'settings': `<circle cx="12" cy="12" r="3"/>` +
              `<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33` +
              ` 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06` +
              `a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09` +
              `A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68` +
              ` a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06` +
              `a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09` +
              `a1.65 1.65 0 0 0-1.51 1z"/>`,

  // Édition de texte
  'bold':      `<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>`,
  'italic':    `<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>`,
  'underline': `<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/>`,

  // Alignement
  'align_l': `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>`,
  'align_c': `<line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>`,
  'align_r': `<line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>`,

  // Fichiers / navigation applicative
  'file':   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
  'logout': `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,

  // Formulaires
  'at':   `<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>`,
  'lock': `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,

  // Visibilité
  'eye':     `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  'eye-off': `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`,

  // États vides
  'inbox': `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>` +
           `<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,

};

// ── Union ─────────────────────────────────────────────────────────────────────

/** Set complet — passer à registerIcons() au boot de l'application. */
const nodusIcons = { ...nodusSystemIcons, ...nodusExtendedIcons };

const state = signal({
  original:    '',
  current:     '',
  past:        [],
  future:      [],
  previewMode: 'none',   // 'none' | 'split' | 'diff'
  outlineOpen: false,
  settings: {
    headingShiftValue:  1,
    skipHeadings:       [],
    autoCopy:           false,
    autoSave:           true,
    cleanerMode:        'OFF',
    flattenBlockquotes: true,
    scrollSync:         true,
  },
});

// ── Persistence ───────────────────────────────────────────────

const LS = {
  ORIGINAL:     'markitlab:original',
  CURRENT:      'markitlab:current',
  PAST:         'markitlab:past',
  SETTINGS:     'markitlab:settings',
  PREVIEW_MODE: 'markitlab:preview-mode',
};

function persist() {
  try {
    localStorage.setItem(LS.ORIGINAL,     state.original);
    localStorage.setItem(LS.CURRENT,      state.current);
    localStorage.setItem(LS.PAST,         JSON.stringify(state.past));
    localStorage.setItem(LS.SETTINGS,     JSON.stringify(state.settings));
    localStorage.setItem(LS.PREVIEW_MODE, state.previewMode);
  } catch {
    // localStorage quota exceeded — silent fail
  }
}

function restore() {
  try {
    const original    = localStorage.getItem(LS.ORIGINAL)     ?? '';
    const current     = localStorage.getItem(LS.CURRENT)      ?? '';
    const past        = JSON.parse(localStorage.getItem(LS.PAST)     ?? '[]');
    const settings    = JSON.parse(localStorage.getItem(LS.SETTINGS) ?? '{}');
    const previewMode = localStorage.getItem(LS.PREVIEW_MODE) ?? 'none';
    const outlineOpen = localStorage.getItem('markitlab:outline-open') === '1';
    Object.assign(state, {
      original,
      current,
      past,
      future: [],
      previewMode,
      outlineOpen,
      settings: { ...state.settings, ...settings },
    });
  } catch {
    // Corrupt localStorage — ignore, keep defaults
  }
}

// ── Mutations ─────────────────────────────────────────────────

function applyTransform(newDoc) {
  const past = [...state.past.slice(-49), state.current];
  Object.assign(state, { past, future: [], current: newDoc });
  if (state.settings.autoSave) persist();
  if (state.settings.autoCopy) navigator.clipboard.writeText(newDoc).catch(() => {});
}

function setDocument(text) {
  Object.assign(state, { original: text, current: text, past: [], future: [] });
  if (state.settings.autoSave) persist();
}

function undo() {
  if (!state.past.length) return;
  Object.assign(state, {
    future:  [state.current, ...state.future],
    current: state.past.at(-1),
    past:    state.past.slice(0, -1),
  });
  if (state.settings.autoSave) persist();
}

function redo() {
  if (!state.future.length) return;
  Object.assign(state, {
    past:    [...state.past, state.current],
    current: state.future[0],
    future:  state.future.slice(1),
  });
  if (state.settings.autoSave) persist();
}

function reset() { applyTransform(state.original); }

function updateSettings(partial) {
  state.settings = { ...state.settings, ...partial };
  if (state.settings.autoSave) persist();
}

// protected-blocks.js
// Extrait les blocs protégés avant un transform, remplace par des placeholders,
// applique fn, puis restaure.
// Protège : code fences, inline code, tables, URLs Markdown.

const MARK_RE = /PROT_(\d+)/g;

function mark(blocks, text) {
  const idx = blocks.length;
  blocks.push(text);
  return `PROT_${idx}`;
}

function withProtectedBlocks(doc, fn) {
  const blocks = [];
  const lines  = doc.split('\n');
  const processed = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code fence (``` or ~~~)
    const fenceMatch = line.match(/^(\s*)(```+|~~~+)/);
    if (fenceMatch) {
      const fence = fenceMatch[2];
      const collected = [line];
      i++;
      while (i < lines.length) {
        collected.push(lines[i]);
        if (lines[i].trimStart().startsWith(fence)) { i++; break; }
        i++;
      }
      processed.push(mark(blocks, collected.join('\n')));
      continue;
    }

    // Markdown table
    if (/^\s*\|.*\|/.test(line)) {
      const collected = [line];
      i++;
      while (i < lines.length && /^\s*\|.*\|/.test(lines[i])) {
        collected.push(lines[i]);
        i++;
      }
      processed.push(mark(blocks, collected.join('\n')));
      continue;
    }

    processed.push(line);
    i++;
  }

  // Protect inline code
  let interim = processed.join('\n');
  interim = interim.replace(/`[^`\n]+`/g, match => mark(blocks, match));

  // Protect Markdown URLs : [text](url) and <https://...> autolinks
  // Évite que le cleaner ne modifie les espaces ou caractères dans les URLs
  interim = interim.replace(/\[[^\]]*\]\([^)]+\)/g, match => mark(blocks, match));
  interim = interim.replace(/<https?:\/\/[^>]+>/g, match => mark(blocks, match));

  const result = fn(interim);

  return result.replace(MARK_RE, (_, idx) => blocks[parseInt(idx, 10)]);
}

// shiftHeadings(doc, delta, skip?) → string
// delta: +1 / -1 (or any int)
// skip:  array of heading levels (1–6) to leave untouched

function shiftHeadings(doc, delta, skip = []) {
  return withProtectedBlocks(doc, text =>
    text.replace(/^(#{1,6})(\s)/gm, (_, hashes, space) => {
      const level = hashes.length;
      if (skip.includes(level)) return hashes + space;
      const next = Math.max(1, Math.min(6, level + delta));
      return '#'.repeat(next) + space;
    })
  );
}

// removeBlockquotes(doc) → string
// Supprime les préfixes '>' sur toutes les lignes blockquote.
// Préserve la structure des paragraphes (règles SPECS §7.3).

function removeBlockquotes(doc) {
  return withProtectedBlocks(doc, text => {
    const lines = text.split('\n');
    const out   = [];

    for (const line of lines) {
      if (/^\s*>/.test(line)) {
        // Retire tous les '>' et un espace optionnel
        const stripped = line.replace(/^\s*>+[ \t]?/, '');
        out.push(stripped);
      } else {
        out.push(line);
      }
    }

    // Normalise : pas plus de 2 sauts de ligne consécutifs
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
  });
}

// clean(doc, mode, settings?) → string
// mode: 'OFF' | 'SAFE' | 'AGGRESSIVE'

function clean(doc, mode, settings = {}) {
  if (mode === 'OFF') return doc;

  let result = cleanSafe(doc);

  if (mode === 'AGGRESSIVE') {
    result = cleanAggressive(result, settings);
  }

  return result;
}

// SAFE — non-destructif, préserve 100% du sens
function cleanSafe(doc) {
  return withProtectedBlocks(doc, text => {
    let r = text;

    // CRLF → LF
    r = r.replace(/\r\n/g, '\n');
    r = r.replace(/\r/g, '\n');

    // Correction espaces après # de heading (ex: "#Titre" → "# Titre")
    r = r.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

    // Normalisation bullet lists : * et + → -
    r = r.replace(/^(\s*)([*+])(\s)/gm, '$1-$3');

    // Suppression des trailing spaces
    r = r.replace(/[ \t]+$/gm, '');

    // Normalisation des espaces multiples (hors indentation de début de ligne)
    r = r.replace(/([^\n])  +/g, '$1 ');

    // Suppression des lignes vides multiples → max 1
    r = r.replace(/\n{3,}/g, '\n\n');

    // Supprime la ligne vide finale si le document n'en avait pas
    r = r.replace(/\n+$/, '');

    return r;
  });
}

// AGGRESSIVE — optimisation structurelle (inclut SAFE)
function cleanAggressive(doc, settings = {}) {
  let result = doc;

  // Flatten blockquotes si activé
  if (settings.flattenBlockquotes !== false) {
    result = removeBlockquotes(result);
  }

  return withProtectedBlocks(result, text => {
    const lines  = text.split('\n');
    const out    = [];
    let para = [];

    function flushPara() {
      if (para.length > 0) {
        out.push(para.join(' '));
        para = [];
      }
    }

    for (const line of lines) {
      const t = line.trim();

      // Ligne vide → séparateur de bloc
      if (t === '') {
        flushPara();
        // Évite les doublons de ligne vide
        if (out.length > 0 && out[out.length - 1] !== '') out.push('');
        continue;
      }

      // Heading
      if (/^#{1,6}\s/.test(t)) {
        flushPara();
        out.push(line);
        continue;
      }

      // List item (-, *, +, 1.)
      if (/^[-*+]\s/.test(t) || /^\d+\.\s/.test(t)) {
        flushPara();
        out.push(line);
        continue;
      }

      // Placeholder (bloc protégé)
      if (/^PROT_\d+$/.test(t)) {
        flushPara();
        out.push(line);
        continue;
      }

      // Ligne de contenu normal → accumuler dans le paragraphe
      para.push(t);
    }

    flushPara();

    return out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '');
  });
}

// components/toast/toast.js — Pattern B+sig (singleton)


/**
 * Toast / Sonner — système de notifications.
 *
 * Usage :
 *   import { toast } from 'nodus/components/toast/toast.js';
 *   toast('Fichier sauvegardé');
 *   toast.success('Opération réussie');
 *   toast.error('Une erreur est survenue', { description: 'Code 500' });
 *   toast.promise(fetch('/api'), { loading: 'Chargement…', success: 'OK', error: 'Erreur' });
 */

let _portal = null;
let _counter = 0;
const _toasts = new Map();

const DURATION = {
  default: 4000,
  persist: Infinity,
};

// ── Configuration globale ──────────────────────────────────────
const _config = {
  maxToasts:    5,
  pauseOnHover: true,
  position:     'bottom-right',
};

function getPortal() {
  if (_portal) return _portal;
  _portal = document.createElement('ol');
  _portal.className = 'toast-portal';
  _portal.dataset.position = _config.position;
  _portal.setAttribute('aria-label', 'Notifications');
  _portal.setAttribute('aria-live', 'polite');
  _portal.setAttribute('aria-atomic', 'false');
  document.body.appendChild(_portal);
  return _portal;
}

function createToastEl({ id, type, message, description, action, duration }) {
  const li = document.createElement('li');
  li.id        = `toast-${id}`;
  li.className = `toast toast-${type}`;
  // A11Y : role="alert" pour les erreurs (lecture immédiate) ; status pour les autres
  // aria-atomic="true" sur les alertes : garantit la lecture complète du message (WCAG 4.1.3)
  li.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');
  if (type === 'error' || type === 'warning') {
    li.setAttribute('aria-atomic', 'true');
  }
  li.dataset.state = 'entering';

  const icons = {
    success: Icon('check-circle',   { size: 16, className: 'toast-icon' }),
    error:   Icon('alert-circle',   { size: 16, className: 'toast-icon' }),
    warning: Icon('alert-triangle', { size: 16, className: 'toast-icon' }),
    info:    Icon('info',           { size: 16, className: 'toast-icon' }),
    loading: Icon('loader',         { size: 16, className: 'toast-icon toast-icon--spin' }),
  };

  const iconHtml = icons[type] ?? '';

  const descHtml = description
    ? `<p class="toast-description">${description}</p>`
    : '';

  const actionHtml = action
    ? `<button type="button" class="toast-action" data-toast-action>${action.label}</button>`
    : '';

  li.innerHTML = `
    <div class="toast-body">
      ${iconHtml}
      <div class="toast-text">
        <p class="toast-message">${message}</p>
        ${descHtml}
      </div>
    </div>
    ${actionHtml}
    <button type="button" class="toast-dismiss" data-toast-dismiss aria-label="Fermer">
      ${Icon('x', { size: 14 })}
    </button>
  `.trim();

  // Dismiss
  li.querySelector('[data-toast-dismiss]')?.addEventListener('click', () => dismiss(id));

  // Action callback
  if (action?.onClick) {
    li.querySelector('[data-toast-action]')?.addEventListener('click', () => {
      action.onClick();
      dismiss(id);
    });
  }

  return li;
}

function dismiss(id) {
  const el = document.getElementById(`toast-${id}`);
  if (!el) return;
  el.dataset.state = 'exiting';
  el.addEventListener('animationend', () => {
    el.remove();
    _toasts.delete(id);
    if (_portal?.children.length === 0) {
      _portal.remove();
      _portal = null;
    }
  }, { once: true });
}

function show(message, { type = 'default', description, action, duration } = {}) {
  const id  = ++_counter;
  const dur = duration ?? (type === 'loading' ? DURATION.persist : DURATION.default);
  const portal = getPortal();

  // ── Limite de toasts (P1c) ─────────────────────────────────
  if (_toasts.size >= _config.maxToasts) {
    // Retirer le plus ancien (plus petit id) sauf les toasts persistants
    for (const [oldId, entry] of _toasts) {
      if (entry.timer !== null || entry.remaining !== Infinity) {
        dismiss(oldId);
        break;
      }
    }
  }

  const el = createToastEl({ id, type, message, description, action });
  portal.appendChild(el);

  // Trigger enter animation on next frame
  requestAnimationFrame(() => {
    el.dataset.state = 'visible';
  });

  if (dur !== Infinity) {
    const startTime = Date.now();
    const timer = setTimeout(() => dismiss(id), dur);
    const entry = { el, timer, startTime, remaining: dur };
    _toasts.set(id, entry);

    // ── Pause on hover (P1c) ───────────────────────────────
    if (_config.pauseOnHover) {
      el.addEventListener('mouseenter', () => {
        const e = _toasts.get(id);
        if (!e || e.timer === null) return;
        clearTimeout(e.timer);
        e.remaining = e.remaining - (Date.now() - e.startTime);
        e.timer = null;
      });
      el.addEventListener('mouseleave', () => {
        const e = _toasts.get(id);
        if (!e || e.timer !== null || e.remaining <= 0) return;
        e.startTime = Date.now();
        e.timer = setTimeout(() => dismiss(id), e.remaining);
      });
    }
  } else {
    _toasts.set(id, { el, timer: null, startTime: null, remaining: Infinity });
  }

  return id;
}

/** Update an existing toast (useful for promise pattern) */
function update(id, opts) {
  const entry = _toasts.get(id);
  if (!entry) return;
  clearTimeout(entry.timer);
  const el = entry.el;
  const { type = 'default', message, description } = opts;

  el.className = `toast toast-${type}`;
  el.querySelector('.toast-message').textContent = message ?? '';
  const descEl = el.querySelector('.toast-description');
  if (descEl) descEl.textContent = description ?? '';

  const dur = opts.duration ?? DURATION.default;
  if (dur !== Infinity) {
    const timer = setTimeout(() => dismiss(id), dur);
    _toasts.set(id, { ...entry, timer, startTime: Date.now(), remaining: dur });
  }
}

// Public API

/**
 * Système de notifications éphémères (Sonner pattern). API impérative.
 *
 * @status stable
 * @since 1.0.0
 * @accessibility role="status" (aria-live polite) pour les variantes default/success/info/loading. role="alert" (assertif) pour error/warning. Le portail .toast-portal est créé dans body hors du flux principal.
 * @tokens --toast-width
 * @example toast('Fichier sauvegardé')
 * @example toast.success('Opération réussie', { description: 'Sauvegardé dans /documents/' })
 * @example toast.promise(fetch('/api/save'), { loading: 'Sauvegarde…', success: 'Sauvegardé', error: 'Erreur' })
 *
 * Affiche une notification toast.
 *
 * @param {string} message               — Message principal
 * @param {object} [opts]
 * @param {string} [opts.description]    — Texte secondaire sous le message
 * @param {'default'|'success'|'error'|'warning'|'info'|'loading'} [opts.type='default'] — Variante visuelle
 * @param {number} [opts.duration=4000]  — Durée d'affichage en ms (0 = persistant)
 * @param {string} [opts.action]         — HTML d'un bouton d'action
 * @param {string} [opts.id]             — id personnalisé (pour mise à jour)
 * @returns {string}                     — id du toast créé
 */
function toast(message, opts) { return show(message, opts); }

toast.success = (message, opts) => show(message, { ...opts, type: 'success' }); // Variante succès
toast.error   = (message, opts) => show(message, { ...opts, type: 'error' });   // Variante erreur
toast.warning = (message, opts) => show(message, { ...opts, type: 'warning' }); // Variante avertissement
toast.info    = (message, opts) => show(message, { ...opts, type: 'info' });    // Variante info
toast.loading = (message, opts) => show(message, { ...opts, type: 'loading' }); // Variante chargement (persistant par défaut)
toast.dismiss = dismiss; // Ferme un toast par son id

/**
 * Configure le comportement global du système de toasts.
 *
 * @param {object} [opts]
 * @param {number}  [opts.maxToasts=5]       Nombre maximum de toasts simultanés. Le plus ancien est retiré si dépassé.
 * @param {boolean} [opts.pauseOnHover=true]  Suspend le timer de fermeture quand la souris est sur le toast.
 * @param {'bottom-right'|'bottom-left'|'bottom-center'|'top-right'|'top-left'|'top-center'} [opts.position='bottom-right']  Position du portail sur l'écran.
 */
toast.configure = function({ maxToasts, pauseOnHover, position } = {}) {
  if (maxToasts    !== undefined) _config.maxToasts    = maxToasts;
  if (pauseOnHover !== undefined) _config.pauseOnHover = pauseOnHover;
  if (position     !== undefined) {
    _config.position = position;
    // Mettre à jour le portail existant si déjà créé
    if (_portal) _portal.dataset.position = position;
  }
};

toast.promise = (promise, { loading = 'Chargement…', success = 'Succès', error = 'Erreur' } = {}) => {
  const id = toast.loading(loading);
  Promise.resolve(promise).then(
    () => update(id, { type: 'success', message: success }),
    () => update(id, { type: 'error',   message: error }),
  );
  return id;
};

// components/switch/switch.js — Pattern A
// Utilise input[type=checkbox role=switch] : sémantique native, pas de JS.

/**
 * Interrupteur ON/OFF. Implémenté via input[type=checkbox role=switch].
 *
 * @status stable
 * @since 1.0.0
 * @accessibility input[type=checkbox role=switch] natif — aria-checked géré par le browser. Aucun JS requis.
 * @keyboard {Space} Active / désactive le switch.
 * @keyboard {Tab} Passe au contrôle suivant.
 * @tokens --switch-height-sm --switch-height-md --switch-height-lg --switch-width-sm --switch-width-md --switch-width-lg --switch-duration
 * @example Switch({ id: 'notifs', label: 'Notifications', checked: true })
 * @example Switch({ id: 'dark', label: 'Mode sombre', size: 'lg' })
 * @see Checkbox, Toggle
 * @param {object}  [props]
 * @param {string}  [props.id]
 * @param {string}  [props.name]
 * @param {boolean} [props.checked=false]
 * @param {boolean} [props.disabled=false]
 * @param {'sm'|'md'|'lg'} [props.size='md']  sm | md | lg
 * @param {string}  [props.label]              Label inline à droite du switch
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function Switch({
  id,
  name,
  checked  = false,
  disabled = false,
  size     = 'md',
  label,
  attrs    = {},
} = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  const input = `<input
    type="checkbox"
    role="switch"
    class="switch switch--${size}"
    ${id       ? `id="${id}"`                     : ''}
    ${name     ? `name="${name}"`                 : ''}
    ${checked  ? 'checked'                        : ''}
    ${disabled ? 'disabled aria-disabled="true"'  : ''}
    ${extraAttrs}
  />`;

  if (!label) return input.trim();

  return `<label class="switch-wrapper${disabled ? ' switch-wrapper--disabled' : ''}">
    ${input}
    <span class="switch-label">${label}</span>
  </label>`.trim();
}

// components/native-select/native-select.js — Pattern A

/**
 * Sélecteur natif HTML — liste déroulante accessible sans JavaScript.
 *
 * @status stable
 * @since 1.0.0
 * @accessibility <select> natif — accessibilité navigateur complète, mobile-friendly. Pas de JS nécessaire.
 * @aria Utilise le <select> natif : role="listbox" implicite, options via <option>, groupes via <optgroup>.
 * @tokens --native-select-height-sm --native-select-height-md --native-select-height-lg --native-select-radius
 * @example NativeSelect({ placeholder: 'Choisir…', children: '<option value="a">Option A</option>' })
 * @keyboard {Tab / Shift+Tab} Focus / blur
 * @keyboard {ArrowUp / ArrowDown} Naviguer dans les options (picker natif)
 * @keyboard {Enter / Space} Ouvrir le picker natif (comportement OS)
 * @see Select, Combobox
 * @param {object}  [props]
 * @param {string}  [props.id]
 * @param {string}  [props.name]
 * @param {string}  [props.placeholder]       première option disabled+selected si fourni
 * @param {string}  [props.value]             option pré-sélectionnée (comparée à la value de chaque option)
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.required=false]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'error'|'success'|undefined} [props.state]
 * @param {string}  [props.children='']       <option> et <optgroup> HTML natifs
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function NativeSelect({
  id,
  name,
  placeholder,
  value,
  disabled  = false,
  required  = false,
  size      = 'md',
  state,
  children  = '',
  attrs     = {},
} = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  const stateClass = state ? ` native-select--${state}` : '';
  const dataState  = state ? ` data-state="${state}"`   : '';

  const placeholderOption = placeholder
    ? `<option value="" disabled selected>${placeholder}</option>`
    : '';

  return `<div class="native-select native-select--${size}${stateClass}"${dataState}>
  <select
    class="native-select__input"
    ${id       ? `id="${id}"`                         : ''}
    ${name     ? `name="${name}"`                     : ''}
    ${disabled ? 'disabled aria-disabled="true"'      : ''}
    ${required ? 'required aria-required="true"'      : ''}
    ${state === 'error' ? 'aria-invalid="true"'        : ''}
    ${value != null ? `data-value="${value}"`          : ''}
    ${extraAttrs}
  >${placeholderOption}${children}</select>
</div>`.trim();
}

// components/input/input.js — Pattern A + Pattern A+sig


/**
 * Champ de saisie texte natif — Pattern A, template statique.
 *
 * Modes enrichis (wrappers Pattern B — activer un seul à la fois) :
 * - `showToggle=true`  + `type="password"` → bouton œil (InputPasswordBehavior)
 * - `stepper=true`     + `type="number"`   → boutons +/− (InputNumberBehavior)
 * - `clearable=true`                        → bouton × de vidage (InputClearableBehavior)
 * - `showCounter=true` + `maxlength`        → compteur n / max (InputCounterBehavior)
 *
 * @status stable
 * @since 1.0.0
 * @tokens --input-height --input-px --input-py --input-bg --input-border --input-radius --input-font-size
 * @accessibility Doit être associé à un Label via htmlFor/id ou via le composant Field. Utiliser aria-describedby pour lier les messages d'erreur. État error exprimé via aria-invalid="true". Le bouton toggle porte aria-label + aria-pressed.
 * @example Input({ id: 'email', type: 'email', placeholder: 'Email' })
 * @example Input({ id: 'pwd', type: 'password', showToggle: true, placeholder: 'Mot de passe' })
 * @example Input({ id: 'q', type: 'search', clearable: true, placeholder: 'Rechercher…' })
 * @example Input({ id: 'qty', type: 'number', stepper: true, value: '1', min: '0', max: '10' })
 * @example Input({ id: 'bio', maxlength: 120, showCounter: true, placeholder: 'Bio courte…' })
 * @keyboard {Tab} Focus / blur
 * @keyboard {Shift+Tab} Focus précédent
 * @keyboard {ArrowUp / ArrowDown} Incrémenter / décrémenter la valeur (mode stepper, type="number")
 * @keyboard {Escape} Vider le champ si une valeur est saisie (mode clearable)
 * @event {input} Émis sur le `<input>` natif lors d'un changement programmatique (vidage via clearable ×, incrément/décrément via stepper)
 * @event {change} Émis sur le `<input>` natif lors d'une validation programmatique (vidage via clearable ×, incrément/décrément via stepper)
 * @see Label
 * @param {object}  [props]
 * @param {string}  [props.id]
 * @param {string}  [props.name]
 * @param {'text'|'email'|'password'|'number'|'search'|'tel'|'url'|'file'} [props.type='text']
 * @param {string}  [props.placeholder='']
 * @param {string}  [props.value]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.readonly=false]
 * @param {boolean} [props.required=false]
 * @param {number}  [props.maxlength]          Limite dure — le browser bloque la saisie. Requis pour showCounter en mode hard.
 * @param {number}  [props.maxCount]           Limite souple — pas de blocage, compteur passe en "-N" si dépassé (mode Twitter). Requis pour showCounter en mode soft.
 * @param {string}  [props.min]                Valeur min (type="number")
 * @param {string}  [props.max]                Valeur max (type="number")
 * @param {string}  [props.step]               Pas (type="number")
 * @param {string}  [props.pattern]            Regex de validation native
 * @param {boolean} [props.showToggle=false]   Bouton œil show/hide (type="password" uniquement)
 * @param {boolean} [props.clearable=false]    Bouton × pour vider le champ
 * @param {boolean} [props.stepper=false]      Boutons +/− (type="number" uniquement)
 * @param {boolean} [props.showCounter=false]  Compteur n/max. Associer à maxlength (hard) ou maxCount (soft).
 * @param {'default'|'error'|'success'|'warning'} [props.state='default']
 * @param {string}  [props.describedby]        id du message d'erreur/aide
 * @param {string}  [props.autocomplete]
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function Input({
  id,
  name,
  type        = 'text',
  placeholder = '',
  value,
  disabled    = false,
  readonly    = false,
  required    = false,
  maxlength,
  maxCount,
  min,
  max,
  step,
  pattern,
  showToggle  = false,
  clearable   = false,
  stepper     = false,
  showCounter = false,
  state       = 'default',
  describedby,
  autocomplete,
  attrs       = {},
} = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  // Classes d'état + variantes
  const modeClass =
    (showToggle && type === 'password') ? ' input-password' :
    clearable                           ? ' input-clearable' :
    (stepper && type === 'number')      ? ' input-number'    : '';

  const inputEl = `<input
    ${id          ? `id="${id}"`                           : ''}
    ${name        ? `name="${name}"`                       : ''}
    type="${type}"
    class="input${state !== 'default' ? ` input-${state}` : ''}${modeClass}"
    ${placeholder  ? `placeholder="${placeholder}"`        : ''}
    ${value != null ? `value="${value}"`                   : ''}
    ${maxlength    ? `maxlength="${maxlength}"`                  : ''}
    ${maxCount     ? `data-max-count="${maxCount}"`            : ''}
    ${min != null  ? `min="${min}"`                            : ''}
    ${max != null  ? `max="${max}"`                        : ''}
    ${step != null ? `step="${step}"`                      : ''}
    ${pattern      ? `pattern="${pattern}"`                : ''}
    ${disabled     ? 'disabled aria-disabled="true"'       : ''}
    ${readonly     ? 'readonly'                            : ''}
    ${required     ? 'required aria-required="true"'       : ''}
    ${state === 'error' ? 'aria-invalid="true"'            : ''}
    ${describedby  ? `aria-describedby="${describedby}"`   : ''}
    ${autocomplete ? `autocomplete="${autocomplete}"`      : ''}
    ${extraAttrs}
  />`.trim();

  // ── Password toggle ──────────────────────────────────────────
  if (showToggle && type === 'password') {
    return `<div class="input-password-wrap" data-component="input-password" reef-ignore>${inputEl
    }<button type="button" class="input-password-toggle" aria-label="Afficher le mot de passe" aria-pressed="false">${
      Icon('eye', { size: 16 })
    }</button></div>`;
  }

  // ── Number stepper ───────────────────────────────────────────
  if (stepper && type === 'number') {
    return `<div class="input-number-wrap" data-component="input-number" reef-ignore
    ><button type="button" class="input-number-btn input-number-btn--dec" aria-label="Diminuer">${
      Icon('minus', { size: 14 })
    }</button>${inputEl
    }<button type="button" class="input-number-btn input-number-btn--inc" aria-label="Augmenter">${
      Icon('plus', { size: 14 })
    }</button></div>`;
  }

  // ── Clearable ────────────────────────────────────────────────
  if (clearable) {
    return `<div class="input-clearable-wrap" data-component="input-clearable" reef-ignore>${inputEl
    }<button type="button" class="input-clear-btn" aria-label="Effacer" hidden>${
      Icon('x', { size: 14 })
    }</button></div>`;
  }

  // ── Character counter ────────────────────────────────────────
  if (showCounter && maxlength) {
    return `<div class="input-counter-wrap" data-component="input-counter" reef-ignore>${inputEl
    }<span class="input-counter" aria-live="polite">0 / ${maxlength}</span></div>`;
  }
  if (showCounter && maxCount) {
    return `<div class="input-counter-wrap" data-component="input-counter" reef-ignore>${inputEl
    }<span class="input-counter" aria-live="polite">0 / ${maxCount}</span></div>`;
  }

  return inputEl;
}

const CLEANER_DESCS = {
  'OFF':        'Aucune modification. Les transforms s\'appliquent directement sur le contenu brut.',
  'SAFE':       'Normalisation non-destructive : CRLF→LF, espaces, headings, bullets. Préserve 100% du sens.',
  'AGGRESSIVE': 'Nettoyage structurel : fusionne les paragraphes fragmentés et aplatit les blockquotes.',
};

function SettingsView({ settings } = {}) {
  const {
    cleanerMode        = 'OFF',
    flattenBlockquotes = true,
    headingShiftValue  = 1,
    skipHeadings       = [],
    autoSave           = true,
    autoCopy           = false,
    scrollSync         = true,
  } = settings ?? {};

  const cleanerOptions = ['OFF', 'SAFE', 'AGGRESSIVE']
    .map(m => `<option value="${m}"${m === cleanerMode ? ' selected' : ''}>${m}</option>`)
    .join('');

  const skipCheckboxes = [1, 2, 3, 4, 5, 6].map(level => `
    <label class="settings-skip-item">
      <input type="checkbox"
        class="checkbox"
        data-change="settings:skip-heading"
        data-level="${level}"
        ${skipHeadings.includes(level) ? 'checked' : ''}>
      H${level}
    </label>`).join('');

  return `<div class="settings-content">

    <div class="settings-group">
      <p class="settings-group-title">Cleaner</p>

      <div class="settings-field">
        <label class="settings-label" for="cleaner-mode">Mode</label>
        ${NativeSelect({ id: 'cleaner-mode', size: 'sm', children: cleanerOptions, attrs: { 'data-change': 'settings:cleaner-mode' } })}
      </div>
      <p id="cleaner-mode-desc" class="settings-mode-desc">${CLEANER_DESCS[cleanerMode] ?? ''}</p>

      <div class="settings-field settings-field--switch">
        ${Switch({ id: 'flatten-blockquotes', label: 'Flatten blockquotes (Aggressive)', checked: flattenBlockquotes, size: 'sm', attrs: { 'data-change': 'settings:flatten-blockquotes' } })}
      </div>
    </div>

    <div class="settings-group">
      <p class="settings-group-title">Titres</p>

      <div class="settings-field">
        <label class="settings-label" for="heading-shift-value">Décalage (H+/H−)</label>
        ${Input({ id: 'heading-shift-value', type: 'number', stepper: true, value: String(headingShiftValue), min: '1', max: '5', step: '1', attrs: { 'data-input': 'settings:heading-shift-value' } })}
      </div>

      <div class="settings-field settings-field--skip">
        <span class="settings-label">Exclure niveaux</span>
        <div class="settings-skip-group">${skipCheckboxes}</div>
      </div>
    </div>

    <div class="settings-group">
      <p class="settings-group-title">Automatisations</p>

      <div class="settings-field settings-field--switch">
        ${Switch({ id: 'auto-save', label: 'Auto-save (localStorage)', checked: autoSave, size: 'sm', attrs: { 'data-change': 'settings:auto-save' } })}
      </div>
      <div class="settings-field settings-field--switch">
        ${Switch({ id: 'auto-copy', label: 'Auto-copy après transform', checked: autoCopy, size: 'sm', attrs: { 'data-change': 'settings:auto-copy' } })}
      </div>
      <div class="settings-field settings-field--switch">
        ${Switch({ id: 'scroll-sync', label: 'Synchroniser le scroll (Rendu / Diff)', checked: scrollSync, size: 'sm', attrs: { 'data-change': 'settings:scroll-sync' } })}
      </div>
    </div>

  </div>`;
}

// outline-state.js — singleton partagé (hors signal Reef)
// Importé par app.js et events.js pour éviter l'import circulaire.

const outlineState = {
  flat:      [],
  nodes:     [],
  activeId:  null,
  collapsed: (() => {
    try { return new Set(JSON.parse(localStorage.getItem('markitlab:outline-collapsed') ?? '[]')); }
    catch { return new Set(); }
  })(),
};

function saveCollapsed() {
  try { localStorage.setItem('markitlab:outline-collapsed', JSON.stringify([...outlineState.collapsed])); }
  catch {}
}

// utils/measure-line.js
// measureLineTop(ta, lineNumber) → number (pixels)
//
// Renvoie la position Y du début de lineNumber dans le scrollable container
// de la textarea, en tenant compte du wrapping des lignes longues.
// Utilise une textarea miroir hors-écran pour mesurer la hauteur exacte.

function measureLineTop(ta, lineNumber) {
  if (lineNumber <= 0) return 0;

  const style   = getComputedStyle(ta);
  const mirror  = document.createElement('textarea');
  const w       = ta.getBoundingClientRect().width;

  mirror.style.cssText = [
    'position:absolute', 'top:-9999px', 'left:-9999px',
    'visibility:hidden', 'overflow:hidden', 'resize:none',
    `width:${w}px`,
    `font-family:${style.fontFamily}`,
    `font-size:${style.fontSize}`,
    `font-weight:${style.fontWeight}`,
    `font-style:${style.fontStyle}`,
    `line-height:${style.lineHeight}`,
    `letter-spacing:${style.letterSpacing}`,
    `padding-top:${style.paddingTop}`,
    `padding-right:${style.paddingRight}`,
    `padding-bottom:0px`,       // on supprime le padding bas pour mesurer proprement
    `padding-left:${style.paddingLeft}`,
    `border:none`,
    `box-sizing:border-box`,
    `tab-size:${style.tabSize || 4}`,
  ].join(';');

  // On insère uniquement le texte AVANT lineNumber
  const lines = ta.value.split('\n');
  mirror.value = lines.slice(0, lineNumber).join('\n');

  document.body.appendChild(mirror);
  // scrollHeight = paddingTop + hauteur du contenu inséré (pas de paddingBottom ici)
  const top = mirror.scrollHeight;
  document.body.removeChild(mirror);

  return top;
}

// events.js — registre de délégation centralisé (GUIDELINES §2)


// ── Registre ──────────────────────────────────────────────────

const registry = { click: new Map(), input: new Map(), change: new Map() };
const ATTR = { click: 'action', input: 'input', change: 'change' };

function register(evType, name, fn) { registry[evType]?.set(name, fn); }

function dispatch(evType, e) {
  const attr = ATTR[evType];
  if (!attr) return;
  const el = e.target.closest(`[data-${attr}]`);
  if (!el) return;
  const fn = registry[evType]?.get(el.dataset[attr]);
  if (fn) fn(e, el);
}

function installAll() {
  document.addEventListener('click',  e => dispatch('click', e));
  document.addEventListener('input',  e => dispatch('input', e));
  document.addEventListener('change', e => dispatch('change', e));

  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    if (!e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
    else if ((e.shiftKey && e.key.toLowerCase() === 'z') || e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
  });
}

// ── Helpers ───────────────────────────────────────────────────

function withCleaner(doc) {
  const { cleanerMode, flattenBlockquotes } = state.settings;
  if (cleanerMode === 'OFF') return doc;
  return clean(doc, cleanerMode, { flattenBlockquotes });
}

function guardEmpty() {
  if (!state.current.trim()) { toast.info('Document vide'); return true; }
  return false;
}

function savedSuffix() {
  return state.settings.autoSave ? ' — Saved ✔' : '';
}

// Wrapper try/catch : safe no-op + notification sur erreur transform
function safeTransform(fn, successMsg) {
  try {
    fn();
    toast.success(successMsg + savedSuffix());
  } catch (err) {
    console.error('Transform error:', err);
    toast.error(`Erreur transform — annulé`);
  }
}

// ── Toolbar ───────────────────────────────────────────────────

register('click', 'toolbar:heading-up', () => {
  if (guardEmpty()) return;
  safeTransform(() => {
    const { headingShiftValue, skipHeadings } = state.settings;
    applyTransform(withCleaner(shiftHeadings(state.current, headingShiftValue, skipHeadings)));
  }, `Titres +${state.settings.headingShiftValue}`);
});

register('click', 'toolbar:heading-down', () => {
  if (guardEmpty()) return;
  safeTransform(() => {
    const { headingShiftValue, skipHeadings } = state.settings;
    applyTransform(withCleaner(shiftHeadings(state.current, -headingShiftValue, skipHeadings)));
  }, `Titres −${state.settings.headingShiftValue}`);
});

register('click', 'toolbar:remove-quotes', () => {
  if (guardEmpty()) return;
  safeTransform(() => applyTransform(withCleaner(removeBlockquotes(state.current))), 'Blockquotes supprimés');
});

register('click', 'toolbar:undo',  () => { undo();  toast.default('Undo' + savedSuffix()); });
register('click', 'toolbar:redo',  () => { redo();  toast.default('Redo' + savedSuffix()); });
register('click', 'toolbar:reset', () => { if (!state.original) return; reset(); toast.default('Réinitialisé' + savedSuffix()); });

register('click', 'toolbar:import', () => {
  document.querySelector('.import-file-input')?.click();
});

register('click', 'toolbar:clean', () => {
  if (guardEmpty()) return;
  const { cleanerMode, flattenBlockquotes } = state.settings;
  if (cleanerMode === 'OFF') { toast.info('Cleaner désactivé — activez-le dans Paramètres'); return; }
  safeTransform(() => applyTransform(clean(state.current, cleanerMode, { flattenBlockquotes })), `Clean (${cleanerMode})`);
});

register('click', 'toolbar:copy', () => {
  if (!state.current) { toast.info('Rien à copier'); return; }
  navigator.clipboard.writeText(state.current)
    .then(() => toast.success('Copied ✔'))
    .catch(() => toast.error('Presse-papier inaccessible'));
});

register('click', 'toolbar:back-to-editor', () => { state.previewMode = 'none'; });

register('click', 'toolbar:outline-toggle', () => {
  state.outlineOpen = !state.outlineOpen;
  try { localStorage.setItem('markitlab:outline-open', state.outlineOpen ? '1' : '0'); } catch {}
});

// ── Éditeur ───────────────────────────────────────────────────

register('input', 'editor:change', (e) => {
  state.current = e.target.value;
  if (state.settings.autoSave) persist();
});

// ── Preview mode ──────────────────────────────────────────────

register('click', 'preview:mode', (e, el) => {
  const mode = el.dataset.value;
  if (!['none', 'split', 'diff'].includes(mode)) return;
  state.previewMode = mode;
});

// ── Settings ──────────────────────────────────────────────────

register('change', 'settings:cleaner-mode', (e) => {
  updateSettings({ cleanerMode: e.target.value });
  const desc = document.getElementById('cleaner-mode-desc');
  if (desc) desc.textContent = CLEANER_DESCS[e.target.value] ?? '';
});

register('change', 'settings:flatten-blockquotes', (e) => { updateSettings({ flattenBlockquotes: e.target.checked }); });
register('change', 'settings:auto-save',  (e) => { updateSettings({ autoSave: e.target.checked });  if (e.target.checked) persist(); });
register('change', 'settings:auto-copy',  (e) => { updateSettings({ autoCopy:   e.target.checked }); });
register('change', 'settings:scroll-sync', (e) => { updateSettings({ scrollSync: e.target.checked }); });

register('input', 'settings:heading-shift-value', (e) => {
  const val = parseInt(e.target.value, 10);
  if (!isNaN(val) && val >= 1 && val <= 5) updateSettings({ headingShiftValue: val });
});

register('change', 'settings:skip-heading', (e) => {
  const level   = parseInt(e.target.dataset.level);
  const skipped = new Set(state.settings.skipHeadings);
  if (e.target.checked) skipped.add(level); else skipped.delete(level);
  updateSettings({ skipHeadings: [...skipped].sort((a, b) => a - b) });
});

// ── Import fichier ────────────────────────────────────────────

register('change', 'editor:import-file', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    setDocument(ev.target.result);
    toast.success(`Importé : ${file.name}`);
    const ta = document.getElementById('editor');
    if (ta) { ta.value = state.current; ta.focus(); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ── Outline ───────────────────────────────────────────────────

register('click', 'outline:navigate', (e, el) => {
  const nodeId = el.dataset.nodeId;
  const node   = outlineState.flat.find(n => n.id === nodeId);
  if (!node) return;

  const ta = document.getElementById('editor');
  if (!ta) return;

  const lines  = ta.value.split('\n');
  let charPos  = 0;
  for (let i = 0; i < node.lineNumber; i++) charPos += lines[i].length + 1;

  ta.setSelectionRange(charPos, charPos);
  ta.focus();

  // measureLineTop utilise une textarea miroir pour tenir compte du wrapping
  ta.scrollTop = measureLineTop(ta, node.lineNumber);

  outlineState.activeId = nodeId;
  document.dispatchEvent(new CustomEvent('outline:update'));
});

register('click', 'outline:toggle', (e, el) => {
  const nodeId = el.dataset.nodeId;
  if (outlineState.collapsed.has(nodeId)) outlineState.collapsed.delete(nodeId);
  else outlineState.collapsed.add(nodeId);
  saveCollapsed();
  document.dispatchEvent(new CustomEvent('outline:update'));
});

// components/app-header/app-header.js — Pattern A
// Fonction template pure → string HTML. Zéro JS comportemental.

/**
 * En-tête d'application — landmark `<header>` avec trois slots flexibles.
 *
 * Utilise l'élément sémantique `<header>` qui expose implicitement `role="banner"`
 * quand il est un descendant direct de `<body>`. Un seul AppHeader par page.
 *
 * @status stable
 * @since 1.6.0
 * @tokens --app-header-height --app-header-px --app-header-bg --app-header-border --app-header-shadow
 * @accessibility Utilise `<header>` comme landmark de page (role="banner" implicite). Un seul AppHeader par page. Les éléments interactifs dans les slots doivent avoir des labels accessibles.
 * @example AppHeader({ start: '<a href="/">Logo</a>', end: Button({ label: 'Connexion' }) })
 * @example AppHeader({ start: logo, center: NavigationMenu({…}), end: Avatar({…}), sticky: true, bordered: true })
 * @see NavigationMenu, Avatar, Button, Sidebar
 * @param {object}  [props]
 * @param {string}  [props.start='']            — Slot gauche : logo, marque, breadcrumb
 * @param {string}  [props.center='']           — Slot centre : navigation, titre de page
 * @param {string}  [props.end='']              — Slot droite : actions, avatar, badges
 * @param {boolean} [props.sticky=false]        — position: sticky; top: 0; z-index: var(--z-sticky)
 * @param {boolean} [props.bordered=false]      — Bordure inférieure
 * @param {'default'|'elevated'} [props.variant='default']  — default | elevated (box-shadow)
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function AppHeader({
  start    = '',
  center   = '',
  end      = '',
  sticky   = false,
  bordered = false,
  variant  = 'default',
  attrs    = {},
} = {}) {
  const extra = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`).join(' ');

  const classes = [
    'app-header',
    `app-header--${variant}`,
    sticky   ? 'app-header--sticky'   : '',
    bordered ? 'app-header--bordered' : '',
  ].filter(Boolean).join(' ');

  return `<header class="${classes}" ${extra}>
  <div class="app-header-start">${start}</div>
  <div class="app-header-center">${center}</div>
  <div class="app-header-end">${end}</div>
</header>`.trim();
}

// components/textarea/textarea.js — Pattern A

/**
 * Zone de texte multi-ligne — mêmes états de validation que Input.
 *
 * Modes enrichis (Pattern B — cumulables) :
 * - `autoResize=true`              → hauteur auto selon contenu (TextareaAutoResizeBehavior)
 * - `showCounter=true` + maxlength → compteur n/max sous le champ (InputCounterBehavior)
 *
 * @status stable
 * @since 1.0.0
 * @tokens --input-px --input-py --input-bg --input-border --input-radius --input-font-size
 * @accessibility Doit être associé à un Label via htmlFor/id ou via Field. Utiliser aria-describedby pour les messages d'erreur. État error exprimé via aria-invalid="true".
 * @example Textarea({ id: 'comment', placeholder: 'Votre commentaire…', rows: 4 })
 * @example Textarea({ id: 'desc', state: 'error', describedby: 'desc-error', rows: 3 })
 * @example Textarea({ id: 'bio', maxlength: 200, showCounter: true, rows: 3 })
 * @example Textarea({ id: 'notes', autoResize: true, placeholder: 'Grandit avec le contenu…' })
 * @keyboard {Tab} Focus / blur (le Tab insère une tabulation dans certains contextes — préférer Shift+Tab pour quitter)
 * @keyboard {Shift+Tab} Quitter la zone de texte
 * @see Label
 * @param {object}  [props]
 * @param {string}  [props.id]
 * @param {string}  [props.name]
 * @param {string}  [props.placeholder='']
 * @param {string}  [props.value='']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.readonly=false]
 * @param {boolean} [props.required=false]
 * @param {'default'|'error'|'success'|'warning'} [props.state='default']
 * @param {'vertical'|'none'|'both'} [props.resize='vertical']
 * @param {number}  [props.rows=3]
 * @param {number}  [props.maxlength]          Limite dure — bloque la saisie à la limite (browser natif). Requis pour showCounter en mode hard.
 * @param {number}  [props.maxCount]           Limite souple — pas de blocage, compteur passe en "-N" si dépassé (mode Twitter). Requis pour showCounter en mode soft.
 * @param {boolean} [props.autoResize=false]   Hauteur auto selon le contenu (TextareaAutoResizeBehavior)
 * @param {boolean} [props.showCounter=false]  Compteur n/max. Associer à maxlength (hard) ou maxCount (soft).
 * @param {string}  [props.describedby]
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function Textarea({
  id,
  name,
  placeholder = '',
  value       = '',
  disabled    = false,
  readonly    = false,
  required    = false,
  state       = 'default',
  resize      = 'vertical',
  rows        = 3,
  maxlength,
  maxCount,
  autoResize  = false,
  showCounter = false,
  describedby,
  attrs       = {},
} = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  // autoResize force resize:none et enregistre le composant Pattern B
  const effectiveResize = autoResize ? 'none' : resize;

  const textareaEl = `<textarea
    ${id          ? `id="${id}"`                            : ''}
    ${name        ? `name="${name}"`                        : ''}
    class="textarea${state !== 'default' ? ` textarea-${state}` : ''}"
    style="resize: ${effectiveResize}"
    rows="${rows}"
    ${placeholder  ? `placeholder="${placeholder}"`         : ''}
    ${maxlength    ? `maxlength="${maxlength}"`             : ''}
    ${maxCount     ? `data-max-count="${maxCount}"`        : ''}
    ${autoResize   ? 'data-component="textarea-auto"'      : ''}
    ${disabled     ? 'disabled aria-disabled="true"'        : ''}
    ${readonly     ? 'readonly'                             : ''}
    ${required     ? 'required aria-required="true"'        : ''}
    ${state === 'error' ? 'aria-invalid="true"'             : ''}
    ${describedby  ? `aria-describedby="${describedby}"`    : ''}
    ${extraAttrs}
  >${value}</textarea>`.trim();

  // ── Character counter (nécessite un wrapper) ──────────────
  if (showCounter && maxlength) {
    return `<div class="input-counter-wrap" data-component="input-counter" reef-ignore>${textareaEl
    }<span class="input-counter" aria-live="polite">0 / ${maxlength}</span></div>`;
  }
  if (showCounter && maxCount) {
    return `<div class="input-counter-wrap" data-component="input-counter" reef-ignore>${textareaEl
    }<span class="input-counter" aria-live="polite">0 / ${maxCount}</span></div>`;
  }

  return textareaEl;
}

// EditorView() → string HTML
// La textarea porte reef-ignore : Reef ne la touche jamais.
// La valeur initiale est définie par value= à la première render.
// Les changements undo/redo la mettent à jour via le subscriber dans app.js.

function EditorView({ current = '' } = {}) {
  return `<div class="editor-pane">
    ${Textarea({
      id:          'editor',
      value:       current,
      resize:      'none',
      rows:        20,
      placeholder: 'Collez ou tapez votre Markdown ici…\n\nCtrl+V pour importer, ou glissez un fichier .md',
      attrs: {
        'reef-ignore':    true,
        'key':            'editor',
        'data-input':     'editor:change',
        'spellcheck':     'false',
        'autocorrect':    'off',
        'autocapitalize': 'off',
      },
    })}
  </div>`;
}

// components/button/button.js — Pattern A
// Fonction template pure → string HTML. Zéro JS comportemental.
// Events via event delegation sur le conteneur parent.

/**
 * Bouton d'action — action principale, secondaire, destructive ou navigation.
 *
 * @status stable
 * @since 1.0.0
 * @tokens --btn-radius --btn-height-sm --btn-height-md --btn-height-lg --btn-px-sm --btn-px-md --btn-px-lg
 * @accessibility Focus visible via :focus-visible. État loading exprimé via aria-busy="true". État désactivé via l'attribut natif disabled (aria-disabled non redondant). Pour un bouton visuellement désactivé mais focusable, utiliser uniquement aria-disabled="true" via attrs. Le spinner est aria-hidden="true".
 * @example Button({ label: 'Envoyer' })
 * @example Button({ label: 'Supprimer', variant: 'destructive', size: 'sm' })
 * @example Button({ label: 'Chargement…', loading: true })
 * @param {object}  [props]
 * @param {string}  [props.label='']
 * @param {'default'|'secondary'|'destructive'|'outline'|'ghost'|'link'} [props.variant='default']  default | secondary | destructive | outline | ghost | link
 * @param {'sm'|'md'|'lg'|'icon'} [props.size='md']          sm | md | lg | icon
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false]      Affiche un spinner. Désactive l'interaction.
 * @param {'button'|'submit'|'reset'} [props.type='button']      button | submit | reset
 * @param {string}  [props.iconStart]          SVG string positionné avant le label
 * @param {string}  [props.iconEnd]            SVG string positionné après le label
 * @param {Record<string, string|boolean>} [props.attrs={}]  Attributs HTML pass-through (event delegation)
 * @returns {string}
 */
function Button({
  label      = '',
  variant    = 'default',
  size       = 'md',
  disabled   = false,
  loading    = false,
  type       = 'button',
  iconStart,
  iconEnd,
  attrs      = {},
} = {}) {
  const isDisabled = disabled || loading;

  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  const content = [
    loading  ? spinner() : '',
    iconStart ? iconStart : '',
    label     ? `<span>${label}</span>` : '',
    iconEnd   ? iconEnd  : '',
  ].filter(Boolean).join('');

  return `<button
    type="${type}"
    class="btn btn-${variant} btn-${size}"
    ${isDisabled ? 'disabled' : ''}
    ${loading    ? 'aria-busy="true"'              : ''}
    ${extraAttrs}
  >${content}</button>`.trim();
}

function spinner() {
  return `<svg class="btn-spinner" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>`;
}

// components/button-group/button-group.js — Pattern A
// Fonction template pure → string HTML. Zéro JS comportemental.

/**
 * Groupe de boutons — conteneur sémantique pour un ensemble de Button().
 *
 * @status stable
 * @since 1.0.0
 * @accessibility role="group" sur le conteneur. Fournir aria-label pour identifier le groupe aux lecteurs d'écran.
 * @aria role="group" aria-label
 * @tokens (aucun — hérite des tokens Button)
 * @example ButtonGroup({ label: 'Alignement', children: Button({ label: 'Gauche', variant: 'outline' }) + Button({ label: 'Centre', variant: 'outline' }) + Button({ label: 'Droite', variant: 'outline' }) })
 * @see Button, ToggleGroup
 * @param {object}  [props]
 * @param {string}  [props.label='']             aria-label du groupe
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']  horizontal | vertical
 * @param {boolean} [props.attached=true]        true = boutons visuellement joints (shared border), false = gap
 * @param {string}  [props.children='']          Button() HTML strings
 * @param {Record<string, string|boolean>} [props.attrs={}]  Attributs HTML pass-through
 * @returns {string}
 */
function ButtonGroup({
  label       = '',
  orientation = 'horizontal',
  attached    = true,
  children    = '',
  attrs       = {},
} = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  const classes = [
    'btn-group',
    `btn-group--${orientation}`,
    attached ? 'btn-group--attached' : '',
  ].filter(Boolean).join(' ');

  const ariaLabel = label ? `aria-label="${label}"` : '';

  return `<div
    class="${classes}"
    role="group"
    ${ariaLabel}
    ${extraAttrs}
  >${children}</div>`.trim();
}

// components/sheet/sheet.js — Pattern B

/**
 * Panneau latéral glissant depuis les bords de l'écran.
 *
 * @status stable
 * @since 1.0.0
 * @accessibility Même pattern que Dialog. role="dialog", aria-modal="true", FocusTrap actif pendant l'ouverture. Retour du focus sur le déclencheur à la fermeture.
 * @aria role="dialog" aria-modal="true" aria-labelledby aria-describedby
 * @keyboard {Escape} Ferme le sheet.
 * @keyboard {Tab} Navigue dans le sheet (focus trap actif).
 * @keyboard {Shift + Tab} Navigue en sens inverse.
 * @tokens --sheet-width --sheet-height --sheet-duration
 * @example Sheet({ id: 'cart', side: 'end', title: 'Panier', children: '<p>Articles du panier</p>' })
 * @see Dialog, Drawer, SheetBehavior
 * @param {object}  [props]
 * @param {string}  [props.id]
 * @param {'top'|'end'|'bottom'|'start'} [props.side='end']  top | end | bottom | start
 * @param {string}  [props.title]
 * @param {string}  [props.description]
 * @param {string}  [props.children='']
 * @param {string}  [props.footer='']
 * @param {boolean} [props.closeButton=true]
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function Sheet({ id, side = 'end', title, description, children = '', footer = '', closeButton = true, attrs = {} } = {}) {
  const sheetId = id ?? `sheet-${Math.random().toString(36).slice(2, 7)}`;
  const titleId = `${sheetId}-title`;
  const descId  = `${sheetId}-desc`;

  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`).join(' ');

  const closeBtn = closeButton ? `
    <button
      type="button"
      class="sheet-close"
      data-sheet-close
      aria-label="Fermer"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>` : '';

  const footerHtml = footer ? `<div class="sheet-footer">${footer}</div>` : '';

  return `<div
    class="sheet"
    data-component="sheet"
    data-side="${side}"
    id="${sheetId}"
    reef-ignore
    key="${sheetId}"
    ${extraAttrs}
  >
    <div class="sheet-backdrop" data-sheet-backdrop aria-hidden="true"></div>
    <div
      class="sheet-panel"
      role="dialog"
      aria-modal="true"
      ${title ? `aria-labelledby="${titleId}"` : ''}
      ${description ? `aria-describedby="${descId}"` : ''}
      tabindex="-1"
    >
      <div class="sheet-header">
        <div class="sheet-header-text">
          ${title       ? `<h2 class="sheet-title" id="${titleId}">${title}</h2>` : ''}
          ${description ? `<p class="sheet-description" id="${descId}">${description}</p>` : ''}
        </div>
        ${closeBtn}
      </div>
      <div class="sheet-body">${children}</div>
      ${footerHtml}
    </div>
  </div>`.replace(/\n\s*\n/g, '\n');
}

/**
 * Bouton déclencheur d'un Sheet.
 *
 * @param {object}  [props]
 * @param {string}  [props.sheetId]     — id du Sheet à ouvrir
 * @param {string}  [props.children=''] — Contenu du bouton (texte ou HTML)
 * @param {Record<string,string|boolean>} [props.attrs={}] — Attributs HTML pass-through
 * @returns {string}
 */
function SheetTrigger({ sheetId, children = '', attrs = {} } = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`).join(' ');
  const injected = `data-sheet-trigger="${sheetId}" aria-haspopup="dialog" aria-expanded="false" aria-controls="${sheetId}" ${extraAttrs}`;
  return children.replace(/^(<[\w-]+)(\s|>)/, `$1 ${injected}$2`);
}

// components/separator/separator.js — Pattern A

/**
 * Séparateur visuel horizontal ou vertical entre sections de contenu.
 *
 * @status stable
 * @since 1.0.0
 * @tokens --separator-color --separator-thickness
 * @accessibility decorative=true (défaut) → role="none". decorative=false → role="separator" + aria-orientation exposés nativement via l'élément <hr>.
 * @example Separator({ orientation: 'horizontal' })
 * @example Separator({ orientation: 'vertical', decorative: false })
 * @param {object}  [props]
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']   horizontal | vertical
 * @param {boolean} [props.decorative=true]            false → role="separator" pour a11y
 * @param {Record<string, string|boolean>} [props.attrs={}]
 * @returns {string}
 */
function Separator({
  orientation = 'horizontal',
  decorative  = true,
  attrs       = {},
} = {}) {
  const extraAttrs = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`)
    .join(' ');

  return `<hr
    class="separator separator--${orientation}"
    role="${decorative ? 'none' : 'separator'}"
    ${!decorative && orientation === 'vertical' ? 'aria-orientation="vertical"' : ''}
    ${extraAttrs}
  />`.trim();
}

function ToolbarView({ past = [], future = [], original = '', settings, previewMode = 'none', outlineOpen = false, darkMode = false } = {}) {
  const canUndo  = past.length > 0;
  const canRedo  = future.length > 0;
  const canReset = original !== '';

  const cleanLabel = { OFF: 'Off', SAFE: 'Safe', AGGRESSIVE: 'Agg.' }[settings?.cleanerMode ?? 'OFF'];

  const transformGroup = ButtonGroup({
    label: 'Transforms', attached: true,
    children:
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('heading', { size: 14 }), label: '+',         attrs: { 'data-action': 'toolbar:heading-up',    'title': 'Titres +1' } }) +
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('heading', { size: 14 }), label: '−',         attrs: { 'data-action': 'toolbar:heading-down',  'title': 'Titres −1' } }) +
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('quote',   { size: 14 }),                     attrs: { 'data-action': 'toolbar:remove-quotes', 'title': 'Supprimer blockquotes' } }) +
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('sparkles', { size: 14 }), label: cleanLabel, attrs: { 'data-action': 'toolbar:clean',         'title': `Nettoyer (mode ${settings?.cleanerMode ?? 'OFF'})` } }),
  });

  const historyGroup = ButtonGroup({
    label: 'Historique', attached: true,
    children:
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('undo',       { size: 14 }), disabled: !canUndo,  attrs: { 'data-action': 'toolbar:undo',  'title': 'Annuler (Ctrl+Z)' } }) +
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('redo',       { size: 14 }), disabled: !canRedo,  attrs: { 'data-action': 'toolbar:redo',  'title': 'Rétablir' } }) +
      Button({ size: 'sm', variant: 'outline', iconStart: Icon('rotate-ccw', { size: 14 }), disabled: !canReset, attrs: { 'data-action': 'toolbar:reset', 'title': 'Réinitialiser' } }),
  });

  const importBtn =
    Button({ size: 'sm', variant: 'outline', iconStart: Icon('file-up', { size: 14 }), attrs: { 'data-action': 'toolbar:import', 'title': 'Importer .md / .txt', 'aria-label': 'Importer un fichier' } }) +
    `<input type="file" accept=".md,.txt,.markdown" data-change="editor:import-file" class="import-file-input" aria-label="Importer un fichier">`;

  const copyBtn = Button({ size: 'sm', variant: 'outline', iconStart: Icon('copy', { size: 14 }), label: 'Copy', attrs: { 'data-action': 'toolbar:copy' } });

  const previewGroup = ButtonGroup({
    label: 'Mode de prévisualisation', attached: true,
    children:
      Button({ label: 'Aucun', size: 'sm', variant: previewMode === 'none'  ? 'default' : 'outline', attrs: { 'data-action': 'preview:mode', 'data-value': 'none'  } }) +
      Button({ label: 'Rendu', size: 'sm', variant: previewMode === 'split' ? 'default' : 'outline', attrs: { 'data-action': 'preview:mode', 'data-value': 'split' } }) +
      Button({ label: 'Diff',  size: 'sm', variant: previewMode === 'diff'  ? 'default' : 'outline', attrs: { 'data-action': 'preview:mode', 'data-value': 'diff'  } }),
  });

  const outlineBtn = Button({
    size: 'sm', variant: outlineOpen ? 'default' : 'outline',
    iconStart: Icon('sidebar', { size: 14 }),
    attrs: { 'data-action': 'toolbar:outline-toggle', 'title': outlineOpen ? 'Masquer l\'outline' : 'Afficher l\'outline' },
  });

  const darkModeBtn = Button({
    size: 'sm', variant: 'ghost',
    iconStart: darkMode ? Icon('sun', { size: 14 }) : Icon('moon', { size: 14 }),
    attrs: { 'data-action': 'toolbar:dark-mode', 'title': darkMode ? 'Mode clair' : 'Mode sombre', 'aria-label': 'Basculer le thème' },
  });

  const settingsBtn = SheetTrigger({
    sheetId: 'settings-sheet',
    children: Button({ size: 'sm', variant: 'outline', iconStart: Icon('settings', { size: 14 }), attrs: { 'title': 'Paramètres', 'aria-label': 'Paramètres' } }),
  });

  const backBtn = `<span class="toolbar-back">${Button({ size: 'sm', variant: 'ghost', label: '← Éditer', iconStart: Icon('arrow-left', { size: 14 }), attrs: { 'data-action': 'toolbar:back-to-editor' } })}</span>`;

  const settingsSheet = Sheet({ id: 'settings-sheet', side: 'end', title: 'Paramètres', children: SettingsView({ settings }) });

  return `
    <div class="app-toolbar">
      <div class="toolbar-row">
        ${backBtn}
        ${outlineBtn}
        ${Separator({ orientation: 'vertical' })}
        ${transformGroup}
        ${Separator({ orientation: 'vertical' })}
        ${historyGroup}
        ${Separator({ orientation: 'vertical' })}
        ${importBtn}
        ${copyBtn}
        <span class="toolbar-spacer"></span>
        ${previewGroup}
        <span class="toolbar-spacer"></span>
        ${darkModeBtn}
        ${settingsBtn}
      </div>
    </div>
    ${settingsSheet}
  `;
}

// Pattern A — wrapper pour HTML rendu par marked()
// Prose({ children, attrs }) → string HTML

function Prose({ children = '', attrs = {} } = {}) {
  const extra = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`).join(' ');
  return `<div class="prose" ${extra}>${children}</div>`;
}

// diff-engine.js — LCS line-based diff
// lineDiff(a, b) → {type: 'add'|'remove'|'equal', line: string}[]

function lineDiff(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const m = aLines.length;
  const n = bLines.length;

  // Build LCS table
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = aLines[i - 1] === bLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack to build hunks
  const hunks = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      hunks.unshift({ type: 'equal', line: aLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      hunks.unshift({ type: 'add', line: bLines[j - 1] });
      j--;
    } else {
      hunks.unshift({ type: 'remove', line: aLines[i - 1] });
      i--;
    }
  }

  return hunks;
}

// Pattern A — affichage diff ligne par ligne
// DiffView({ original, current, attrs }) → string HTML

function DiffView({ original = '', current = '', attrs = {} } = {}) {
  const hunks = lineDiff(original, current);

  const lines = hunks.map(({ type, line }) => {
    const esc = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (type === 'add') {
      return `<ins class="diff-line diff-line--add" aria-label="ajouté">+ ${esc}</ins>`;
    }
    if (type === 'remove') {
      return `<del class="diff-line diff-line--remove" aria-label="supprimé">- ${esc}</del>`;
    }
    return `<span class="diff-line diff-line--equal">  ${esc}</span>`;
  });

  const extra = Object.entries(attrs)
    .map(([k, v]) => v === true ? k : `${k}="${v}"`).join(' ');

  return `<div class="diff-view" aria-label="Comparaison original / courant" ${extra}>${lines.join('\n')}</div>`;
}

// updatePreviewPane(mode, original, current)
// Mise à jour impérative du panneau preview (reef-ignore → pas de re-render Reef).
// Appelé depuis le subscriber dans app.js à chaque changement de state.

function updatePreviewPane(mode, original, current) {
  const pane = document.querySelector('.preview-pane');
  if (!pane) return;

  if (mode === 'split') {
    pane.innerHTML = Prose({ children: marked.parse(current || '') });
  } else if (mode === 'diff') {
    pane.innerHTML = DiffView({ original, current });
  } else {
    pane.innerHTML = '';
  }
}

// OutlineView — Pattern A, rendu impératif (reef-ignore sur le panneau)

function esc(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function trunc(t, max = 52) {
  return t.length > max ? t.slice(0, max) + '…' : t;
}

function renderNodes(nodes, activeId, collapsed) {
  return nodes.map(node => {
    const isActive    = node.id === activeId;
    const hasKids     = node.children.length > 0;
    const isCollapsed = collapsed.has(node.id);

    const chevron = hasKids
      ? `<button type="button" class="outline-toggle" data-action="outline:toggle" data-node-id="${node.id}" aria-label="${isCollapsed ? 'Déplier' : 'Replier'}">${isCollapsed ? '›' : '⌄'}</button>`
      : `<span class="outline-toggle outline-toggle--leaf" aria-hidden="true"></span>`;

    const children = hasKids && !isCollapsed
      ? `<div class="outline-children">${renderNodes(node.children, activeId, collapsed)}</div>`
      : '';

    return `<div class="outline-item outline-item--h${node.level}${isActive ? ' outline-item--active' : ''}">
      <div class="outline-item-row">
        ${chevron}
        <button type="button" class="outline-nav" data-action="outline:navigate" data-node-id="${node.id}">${esc(trunc(node.text))}</button>
      </div>
      ${children}
    </div>`;
  }).join('');
}

function OutlineView({ nodes = [], activeId = null, collapsed = new Set() } = {}) {
  if (!nodes.length) {
    return `<p class="outline-empty">Aucune section dans ce document.</p>`;
  }
  return `<nav class="outline-tree" aria-label="Structure du document">${renderNodes(nodes, activeId, collapsed)}</nav>`;
}

// outline-engine.js — fonctions pures pour l'Outline System (§20)

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 40);
}

// extractFlat(doc) → OutlineNode[] (liste plate, triée par lineNumber)
// O(n) — un passage, sortie rapide sur charCode '#'
function extractFlat(doc) {
  const lines   = doc.split('\n');
  const flat    = [];
  let inFence   = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fence toggle
    if (/^(`{3,}|~{3,})/.test(line.trimStart())) { inFence = !inFence; continue; }
    if (inFence) continue;

    // Sortie rapide : '#' = charCode 35
    if (line.charCodeAt(0) !== 35) continue;

    const m = line.match(/^(#{1,6}) (.+)/);
    if (!m) continue;

    flat.push({
      id:         `h-${i}-${slugify(m[2].trim())}`,
      level:      m[1].length,
      text:       m[2].trim(),
      lineNumber: i,
      children:   [],
    });
  }

  return flat;
}

// buildTree(flat) → OutlineNode[] (nœuds racines avec children imbriqués)
// O(k) — algorithme de pile
function buildTree(flat) {
  const result = [];
  const stack  = [];

  for (const node of flat) {
    node.children = []; // reset (flat nodes sont toujours fresh depuis extractFlat)

    while (stack.length && stack[stack.length - 1].level >= node.level) stack.pop();

    if (stack.length === 0) result.push(node);
    else stack[stack.length - 1].children.push(node);

    stack.push(node);
  }

  return result;
}

// isSameFlat(a, b) → boolean — comparaison O(k), court-circuit au premier écart
function isSameFlat(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].lineNumber !== b[i].lineNumber) return false;
    if (a[i].level      !== b[i].level)      return false;
    if (a[i].text       !== b[i].text)        return false;
  }
  return true;
}

// findActiveNode(flat, cursorLine) → OutlineNode | null
// Renvoie le heading le plus proche au-dessus du curseur
function findActiveNode(flat, cursorLine) {
  let active = null;
  for (const node of flat) {
    if (node.lineNumber <= cursorLine) active = node;
    else break;
  }
  return active;
}

// getCursorLine(textarea) → number (0-based)
function getCursorLine(ta) {
  return ta.value.substring(0, ta.selectionStart).split('\n').length - 1;
}

registerIcons(nodusIcons);
registerIcons({
  'undo':        `<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>`,
  'redo':        `<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>`,
  'heading':     `<path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12l3-2v8"/>`,
  'quote':       `<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>`,
  'rotate-ccw':  `<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.1"/>`,
  'arrow-left':  `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
  'moon':        `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  'sun':         `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`,
  'file-up':     `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/>`,
  'sidebar':     `<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>`,
  'sparkles':    `<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>`,
});

// ── Restore session ───────────────────────────────────────────
restore();

// Thème sauvegardé
const savedTheme = localStorage.getItem('markitlab:theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

// ── Template ──────────────────────────────────────────────────

function App() {
  const outlinePanelHTML = state.outlineOpen
    ? `<div class="outline-pane" reef-ignore key="outline-pane">
         <div class="outline-header">Structure</div>
         <div class="outline-body"></div>
       </div>`
    : '';

  return `
    ${AppHeader({ start: '<span class="app-brand">MarkItLab</span>', bordered: true })}
    <div class="workspace" data-mode="${state.previewMode}"${state.outlineOpen ? ' data-outline="open"' : ''}>
      ${outlinePanelHTML}
      ${EditorView({ current: state.current })}
      <div class="preview-pane" reef-ignore key="preview-pane"></div>
    </div>
    ${ToolbarView({
      past:        state.past,
      future:      state.future,
      original:    state.original,
      settings:    state.settings,
      previewMode: state.previewMode,
      outlineOpen: state.outlineOpen,
      darkMode:    document.documentElement.dataset.theme === 'dark',
    })}
  `;
}

component('#app', App);

// ── Mise à jour impérative du panneau outline ─────────────────

function updateOutlinePane() {
  const body = document.querySelector('.outline-pane .outline-body');
  if (!body) return;
  body.innerHTML = OutlineView({
    nodes:    outlineState.nodes,
    activeId: outlineState.activeId,
    collapsed: outlineState.collapsed,
  });
}

function syncOutline() {
  const newFlat = extractFlat(state.current);
  if (!isSameFlat(newFlat, outlineState.flat)) {
    outlineState.flat  = newFlat;
    outlineState.nodes = buildTree(newFlat);
    // Nettoie les collapsed ids obsolètes
    const validIds = new Set(newFlat.map(n => n.id));
    for (const id of outlineState.collapsed) { if (!validIds.has(id)) outlineState.collapsed.delete(id); }
  }
  updateOutlinePane();
}

// ── Subscribers ───────────────────────────────────────────────

// Synchro textarea (undo/redo/reset → activeElement !== textarea)
document.addEventListener('reef:signal', () => {
  const ta = document.getElementById('editor');
  if (ta && document.activeElement !== ta) ta.value = state.current;
});

// Après chaque render Reef : mise à jour des panneaux reef-ignore
document.addEventListener('reef:render', () => {
  updatePreviewPane(state.previewMode, state.original, state.current);
  if (state.outlineOpen) syncOutline();
});

// Mise à jour outline demandée par events.js (navigate, toggle)
document.addEventListener('outline:update', updateOutlinePane);

// ── Cursor tracking pour activeId ─────────────────────────────

let cursorTimer;
function onCursorMove() {
  clearTimeout(cursorTimer);
  cursorTimer = setTimeout(() => {
    if (!state.outlineOpen) return;
    const ta = document.getElementById('editor');
    if (!ta) return;
    const line    = getCursorLine(ta);
    const node    = findActiveNode(outlineState.flat, line);
    const newId   = node?.id ?? null;
    if (newId !== outlineState.activeId) {
      outlineState.activeId = newId;
      updateOutlinePane();
    }
  }, 50);
}

// Délégation sur document — la textarea peut ne pas exister au moment de l'appel
document.addEventListener('click',  (e) => { if (e.target.id === 'editor') onCursorMove(); });
document.addEventListener('keyup',  (e) => { if (e.target.id === 'editor') onCursorMove(); });

// ── Dark mode ─────────────────────────────────────────────────

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-action="toolbar:dark-mode"]')) return;
  const html = document.documentElement;
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('markitlab:theme', next);
});

// ── Scroll sync editor ↔ preview (split / diff) ──────────────

// Cache des ancres — invalide sur re-render Reef ou resize
let _splitAnchors = null;
let _diffAnchors  = null;
function clearAnchorCache() { _splitAnchors = null; _diffAnchors = null; }
document.addEventListener('reef:render', clearAnchorCache);
window.addEventListener('resize', clearAnchorCache, { passive: true });

// ── helpers ──────────────────────────────────────────────────

function interpolateAnchors(anchors, fromKey, value, toKey) {
  for (let i = 0; i < anchors.length - 1; i++) {
    const lo = anchors[i], hi = anchors[i + 1];
    if (value >= lo[fromKey] && value <= hi[fromKey]) {
      const span = hi[fromKey] - lo[fromKey];
      const t    = span > 0 ? (value - lo[fromKey]) / span : 0;
      return lo[toKey] + t * (hi[toKey] - lo[toKey]);
    }
  }
  return anchors[anchors.length - 1][toKey];
}

function ratioSync(source, target) {
  const ratio = source.scrollTop / Math.max(1, source.scrollHeight - source.clientHeight);
  return ratio * Math.max(1, target.scrollHeight - target.clientHeight);
}

function finalAnchor(editor, preview) {
  return {
    editorY:  Math.max(0, editor.scrollHeight  - editor.clientHeight),
    previewY: Math.max(0, preview.scrollHeight - preview.clientHeight),
  };
}

// ── Mode rendu (split) : ancres sur les headings HTML ────────

function buildSplitAnchors(editor, preview) {
  if (_splitAnchors) return _splitAnchors;

  const headings = outlineState.flat;
  if (!headings.length) return null;

  const previewRect     = preview.getBoundingClientRect();
  const previewHeadings = Array.from(preview.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  const anchors         = [{ editorY: 0, previewY: 0 }];

  for (const h of headings) {
    const el = previewHeadings.find(e => e.textContent.trim() === h.text.trim());
    if (!el) continue;
    anchors.push({
      editorY:  measureLineTop(editor, h.lineNumber),
      previewY: el.getBoundingClientRect().top - previewRect.top + preview.scrollTop,
    });
  }

  anchors.push(finalAnchor(editor, preview));
  _splitAnchors = anchors.length > 2 ? anchors : null;
  return _splitAnchors;
}

// ── Mode diff : ancres sur les .diff-line qui correspondent ──
// aux lignes de `current` (add + equal, dans l'ordre).
// Les lignes `remove` (appartenant à l'original) sont ignorées
// pour l'éditor→diff mais comptent dans le décalage du diff→editor.

function buildDiffAnchors(editor, preview) {
  if (_diffAnchors) return _diffAnchors;

  const headings    = outlineState.flat;
  if (!headings.length) return null;

  const diffEls = Array.from(preview.querySelectorAll('.diff-line'));
  if (!diffEls.length) return null;

  // Mapping : currentLineIndex → diffEl index (on skip les --remove)
  const currentToDiff = [];
  for (let i = 0; i < diffEls.length; i++) {
    if (!diffEls[i].classList.contains('diff-line--remove')) {
      currentToDiff.push(i);
    }
  }

  const previewRect = preview.getBoundingClientRect();
  const anchors     = [{ editorY: 0, previewY: 0 }];

  for (const h of headings) {
    const diffIdx = currentToDiff[h.lineNumber];
    if (diffIdx === undefined) continue;
    anchors.push({
      editorY:  measureLineTop(editor, h.lineNumber),
      previewY: diffEls[diffIdx].getBoundingClientRect().top - previewRect.top + preview.scrollTop,
    });
  }

  anchors.push(finalAnchor(editor, preview));
  _diffAnchors = anchors.length > 2 ? anchors : null;
  return _diffAnchors;
}

// ── Listener scroll (capture — scroll ne bubble pas) ─────────

let scrollSyncLock = false;

document.addEventListener('scroll', (e) => {
  if (scrollSyncLock) return;
  if (!state.settings.scrollSync) return;
  if (!['split', 'diff'].includes(state.previewMode)) return;

  const editor  = document.getElementById('editor');
  const preview = document.querySelector('.preview-pane');
  if (!editor || !preview) return;

  const source = e.target;
  const isDiff = state.previewMode === 'diff';
  let targetEl, targetScrollTop;

  if (source === editor) {
    targetEl = preview;
    const anchors = isDiff ? buildDiffAnchors(editor, preview)
                           : buildSplitAnchors(editor, preview);
    targetScrollTop = anchors
      ? interpolateAnchors(anchors, 'editorY', editor.scrollTop, 'previewY')
      : ratioSync(editor, preview);

  } else if (source === preview) {
    targetEl = editor;
    const anchors = isDiff ? buildDiffAnchors(editor, preview)
                           : buildSplitAnchors(editor, preview);
    targetScrollTop = anchors
      ? interpolateAnchors(anchors, 'previewY', preview.scrollTop, 'editorY')
      : ratioSync(preview, editor);

  } else {
    return;
  }

  scrollSyncLock = true;
  targetEl.scrollTop = targetScrollTop;
  scrollSyncLock = false;
}, true);

// ── Paste initial (textarea vide) ─────────────────────────────

document.addEventListener('paste', (e) => {
  const ta = document.getElementById('editor');
  if (!ta || document.activeElement !== ta) return;
  if (state.original) return;
  const text = e.clipboardData?.getData('text/plain') ?? '';
  if (!text.trim()) return;
  e.preventDefault();
  setDocument(text);
  ta.value = text;
  ta.selectionStart = ta.selectionEnd = text.length;
});

installAll();
//# sourceMappingURL=bundle.js.map
