/**
 * VenKinetics - Audio Synthesizer & Haptics Engine
 * Web Audio API oscillator synthesis with full mobile iOS/Android safeguards.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  _initContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      this.ctx = null;
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
      // Audio autoplay policy or hardware restriction - non-fatal
    }
  }

  // Short tap click
  tap() {
    try {
      this.playTone(600, 'sine', 0.05, 0.05);
      this.vibrate(10);
    } catch (e) {}
  }

  // Rest timer tick (last 3 seconds)
  tick() {
    try {
      this.playTone(880, 'sine', 0.08, 0.1);
      this.vibrate(20);
    } catch (e) {}
  }

  // Rest timer completed chime
  restComplete() {
    try {
      this._initContext();
      if (!this.ctx || this.muted) return;

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.35, 0.2);
        }, idx * 100);
      });

      this.vibrate([100, 50, 150, 50, 200]);
    } catch (e) {}
  }

  // Set logged checkmark
  setLogged() {
    try {
      this.playTone(784, 'triangle', 0.12, 0.15);
      this.vibrate(35);
    } catch (e) {}
  }

  // PR / Celebration fanfare
  celebrate() {
    try {
      this._initContext();
      if (!this.ctx || this.muted) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.4, 0.22);
        }, idx * 120);
      });

      this.vibrate([80, 40, 80, 40, 150, 60, 250]);
    } catch (e) {}
  }

  vibrate(pattern) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (err) {}
  }
}

export const sound = new SoundEngine();
