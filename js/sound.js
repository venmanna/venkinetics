/**
 * Apex Pulse - Audio Synthesizer & Haptics Engine
 * Uses Web Audio API oscillator synthesis (no external audio files required)
 * and navigator.vibrate for tactile mobile feedback.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  _initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
    if (this.muted) return;
    try {
      this._initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Short click/tap
  tap() {
    this.playTone(600, 'sine', 0.05, 0.05);
    this.vibrate(10);
  }

  // Rest timer tick (last 3 seconds)
  tick() {
    this.playTone(880, 'sine', 0.08, 0.1);
    this.vibrate(20);
  }

  // Rest timer completed chime
  restComplete() {
    this._initContext();
    if (!this.ctx || this.muted) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.35, 0.2);
      }, idx * 100);
    });

    this.vibrate([100, 50, 150, 50, 200]);
  }

  // Set logged checkmark
  setLogged() {
    this.playTone(784, 'triangle', 0.12, 0.15);
    this.vibrate(35);
  }

  // PR / Celebration fanfare
  celebrate() {
    this._initContext();
    if (!this.ctx || this.muted) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.4, 0.22);
      }, idx * 120);
    });

    this.vibrate([80, 40, 80, 40, 150, 60, 250]);
  }

  vibrate(pattern) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        // Ignored on platforms without vibration
      }
    }
  }
}

export const sound = new SoundEngine();
