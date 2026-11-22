// Orientation relative à une position de repos, sans utiliser le cap magnétique.
export function tiltPoint(beta, gamma, origin, angle = 0) {
  const radians = angle * Math.PI / 180;
  const wrap = n => ((n + 540) % 360) - 180;
  const db = wrap(beta - origin.beta), dg = wrap(gamma - origin.gamma);
  const deadzone = n => Math.abs(n) < 1.2 ? 0 : Math.sign(n) * Math.min(1, (Math.abs(n) - 1.2) / 20);
  const x = deadzone(dg * Math.cos(radians) + db * Math.sin(radians));
  const y = deadzone(db * Math.cos(radians) - dg * Math.sin(radians));
  return { x: .5 + x * .46, y: .5 + y * .37 };
}

// Messages par défaut en français ; la page passe ceux de sa langue (`messages`).
const MESSAGES = {
  recentered: 'Position de repos recalibrée. Inclinez doucement.',
  started: 'Inclinez doucement. Attardez-vous pour découvrir une humeur.',
  https: 'L’inclinaison nécessite une connexion HTTPS. Vous pouvez explorer au doigt.',
  unavailable: 'L’inclinaison n’est pas disponible ici. Explorez au doigt.',
  waiting: 'Gardez le téléphone dans une position confortable…',
  denied: 'Autorisation non accordée. Le mode au doigt reste disponible.',
  noMotion: 'Aucun mouvement détecté. Continuez au doigt, ou réessayez.',
  failed: 'Impossible d’activer l’inclinaison. Explorez au doigt.',
};

export function createTiltExplorer({ onPoint, onMessage, onActive, messages = {}, environment = window }) {
  const say = { ...MESSAGES, ...messages };
  let active = false, waiting = false, origin = null, latest = null;
  let smooth = { x: .5, y: .5 }, timeout = 0, generation = 0;
  const angle = () => environment.screen?.orientation?.angle ?? environment.orientation ?? 0;
  function stop(message) {
    generation++;
    active = waiting = false;
    environment.clearTimeout(timeout); timeout = 0;
    environment.removeEventListener('deviceorientation', read);
    environment.removeEventListener('orientationchange', recenter);
    environment.screen?.orientation?.removeEventListener('change', recenter);
    origin = latest = null;
    onActive(false, false);
    if (message) onMessage(message);
  }
  function recenter() {
    origin = latest ? { ...latest } : null;
    smooth = { x: .5, y: .5 };
    if (active) { onPoint(smooth); onMessage(say.recentered); }
  }
  function read(event) {
    if ((!active && !waiting) || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    latest = { beta: event.beta, gamma: event.gamma };
    if (!origin) {
      origin = { ...latest }; smooth = { x: .5, y: .5 };
      active = true; waiting = false;
      environment.clearTimeout(timeout); timeout = 0;
      onActive(true, false);
      onMessage(say.started);
    }
    const target = tiltPoint(event.beta, event.gamma, origin, angle());
    smooth = { x: smooth.x + (target.x - smooth.x) * .18, y: smooth.y + (target.y - smooth.y) * .18 };
    onPoint(smooth);
  }
  async function start() {
    if (active || waiting) return;
    const DeviceOrientation = environment.DeviceOrientationEvent;
    if (!environment.isSecureContext) { onMessage(say.https); return; }
    if (!DeviceOrientation) { onMessage(say.unavailable); return; }
    const run = ++generation;
    waiting = true; onActive(false, true);
    onMessage(say.waiting);
    try {
      // L'appel a lieu dans le clic, avant tout autre await (activation utilisateur).
      if (typeof DeviceOrientation.requestPermission === 'function') {
        const permission = await DeviceOrientation.requestPermission();
        if (run !== generation) return;
        if (permission !== 'granted') { stop(say.denied); return; }
      }
      if (run !== generation) return;
      environment.addEventListener('deviceorientation', read);
      environment.addEventListener('orientationchange', recenter);
      environment.screen?.orientation?.addEventListener('change', recenter);
      timeout = environment.setTimeout(() => stop(say.noMotion), 4000);
    } catch {
      if (run === generation) stop(say.failed);
    }
  }
  return { start, stop, recenter, get active() { return active || waiting; } };
}
