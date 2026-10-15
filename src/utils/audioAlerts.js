// Web Audio API Synthesizer for Authentic Restaurant POS Buzzers & Chimes
// Zero external MP3 latency, 100% reliable across all modern mobile & desktop browsers.

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Resume audio on first user touch/click to comply with browser autoplay policies
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

/**
 * 1. KITCHEN & ADMIN NEW ORDER BUZZER / CHIME
 * Distinctive 3-tone high-frequency POS bell alert (987Hz -> 1318Hz -> 1975Hz)
 * Alerts Chefs & Admin when a customer places an order via Table QR.
 */
export const playNewOrderBuzzer = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [987.77, 1318.51, 1975.53]; // B5, E6, B6 (Crisp, resonant kitchen chime)

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.12;

      // Primary tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Bell envelope (quick attack, natural decaying ring)
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.65, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);

      // Harmonic overtone for metallic brass resonance
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.02, startTime);
      overtoneGain.gain.setValueAtTime(0.2, startTime);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);
      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);
      overtone.start(startTime);
      overtone.stop(startTime + 0.28);
    });
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
};

/**
 * 2. ORDER READY / WAITER & RUNNER PICKUP BUZZER
 * Distinctive 2-tone "Order Up!" diner bell (659Hz -> 880Hz / E5 -> A5)
 * Distinct dual-resonance bell specifically alerting waitstaff that hot food is ready at the pass.
 */
export const playOrderReadyBuzzer = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880.00]; // E5 to A5 harmonic leap

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.18;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Warmer, louder sustain for runner pass bell
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.75, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
};

/**
 * 3. WAITER CALL / SERVICE SUMMON BUZZER
 * Soft dual chime for guest service summon
 */
export const playWaiterCallBuzzer = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1046.50, 1318.51]; // C6 to E6

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.14;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.45, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
};

