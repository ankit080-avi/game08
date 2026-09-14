/**
 * Ludo King Web Audio Synthesizer
 * 100% offline, realistic board game audio effects:
 * - Dice rattle & roll
 * - Token hop footsteps
 * - Token capture / cut swoosh & strike
 * - Bonus turn double-chime
 * - Token reached home bell
 * - Victory fanfare
 * - Cartoon emoji pops
 */

class LudoAudioService {
  constructor() {
    this.ctx = null;
    this.muted = typeof window !== 'undefined'
      ? window.localStorage.getItem('ludo_sound_enabled') === 'false'
      : false;
    this.currentReverseSlide = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(isMuted) {
    this.muted = !!isMuted;
    if (this.muted) {
      this.stopReverseSlide(0.02);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ludo_sound_enabled', this.muted ? 'false' : 'true');
    }
    return this.muted;
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }

  playButtonClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  playDiceShake() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 3 quick wooden rattle clicks
      [0, 0.04, 0.08].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + Math.random() * 100, now + offset);
        gain.gain.setValueAtTime(0.08, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.035);
      });
    } catch (_) {}
  }

  playDiceRoll() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // White noise burst shaped like a wooden dice tumble
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);

      // Final solid thud
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      oscGain.gain.setValueAtTime(0.2, now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now + 0.1);
      osc.stop(now + 0.2);
    } catch (_) {}
  }

  playTokenStep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 1. Wooden knock transient
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);

      // 2. Subtle tactile click
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(840, now);
      osc2.frequency.exponentialRampToValueAtTime(520, now + 0.035);
      gain2.gain.setValueAtTime(0.09, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.045);
    } catch (_) {}
  }

  /**
   * Clean, soft "pop/knock" capture impact sound (approx 90% volume).
   * Warm wooden pop with subtle tactile knock transient. No harsh buzzing sawtooth.
   */
  playCaptureImpact() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 1. Rounded low pop resonance (warm sine drop)
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(260, now);
      popOsc.frequency.exponentialRampToValueAtTime(95, now + 0.08);
      popGain.gain.setValueAtTime(0.16, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.09);

      // 2. Tactile wooden knock body (triangle)
      const knockOsc = this.ctx.createOscillator();
      const knockGain = this.ctx.createGain();
      knockOsc.type = 'triangle';
      knockOsc.frequency.setValueAtTime(420, now);
      knockOsc.frequency.exponentialRampToValueAtTime(190, now + 0.04);
      knockGain.gain.setValueAtTime(0.12, now);
      knockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      knockOsc.connect(knockGain);
      knockGain.connect(this.ctx.destination);
      knockOsc.start(now);
      knockOsc.stop(now + 0.05);
    } catch (_) {}
  }

  // Alias for backward compatibility
  playTokenCapture() {
    this.playCaptureImpact();
  }

  /**
   * Continuous, soft, airy sliding sound for the captured token's return slide.
   * Volume: 45-60% (gain ~0.072).
   * Soft bandpass-filtered noise + gentle warm glide body.
   * Starts on slide start and smoothly fades out on home arrival.
   */
  startReverseSlide(durationMs = 800) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Clean up any existing active slide sound instance
    this.stopReverseSlide(0.02);

    try {
      const now = this.ctx.currentTime;
      const durationSec = Math.max(0.18, durationMs / 1000);

      // 1. Velvet pink noise buffer for soft, airy sliding texture (no harsh hiss)
      const sampleRate = this.ctx.sampleRate;
      const bufferLength = Math.min(sampleRate * 2, Math.round(sampleRate * (durationSec + 0.6)));
      const buffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.0750;
        b2 = 0.96900 * b2 + white * 0.1538;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.22;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Bandpass filter centered at 600Hz sliding down to 420Hz
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(420, now + durationSec);
      filter.Q.setValueAtTime(1.3, now);

      // 2. Subtle warm glide undertone (smooth grounded body at 190Hz -> 130Hz)
      const toneOsc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      toneOsc.type = 'sine';
      toneOsc.frequency.setValueAtTime(190, now);
      toneOsc.frequency.exponentialRampToValueAtTime(130, now + durationSec);
      toneGain.gain.setValueAtTime(0.022, now);

      // Master gain envelope (volume ~50% of normal step)
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.072, now + 0.035);

      noiseSource.connect(filter);
      filter.connect(masterGain);

      toneOsc.connect(toneGain);
      toneGain.connect(masterGain);

      masterGain.connect(this.ctx.destination);

      noiseSource.start(now);
      toneOsc.start(now);

      this.currentReverseSlide = {
        noiseSource,
        toneOsc,
        masterGain
      };

      // Auto safety stop in case network/engine is interrupted
      noiseSource.stop(now + durationSec + 0.35);
      toneOsc.stop(now + durationSec + 0.35);
    } catch (_) {}
  }

  /**
   * Smoothly fade out and stop the active reverse slide sound when token reaches home.
   */
  stopReverseSlide(fadeDuration = 0.08) {
    if (!this.currentReverseSlide || !this.ctx) return;
    try {
      const { noiseSource, toneOsc, masterGain } = this.currentReverseSlide;
      const now = this.ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        try {
          noiseSource.stop();
          toneOsc.stop();
          noiseSource.disconnect();
          toneOsc.disconnect();
          masterGain.disconnect();
        } catch (_) {}
      }, Math.round(fadeDuration * 1000) + 30);
    } catch (_) {}
    this.currentReverseSlide = null;
  }

  // Backward compatibility
  playTokenReverseStep() {}

  /**
   * Soft final settle/home sound when captured token arrives in its yard slot (approx 70% volume).
   */
  playYardSettle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 1. Warm wooden chime tone
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(330, now); // E4
      osc1.frequency.exponentialRampToValueAtTime(246.94, now + 0.11); // B3
      gain1.gain.setValueAtTime(0.11, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.125);

      // 2. Soft low wooden cushion
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(160, now);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain2.gain.setValueAtTime(0.09, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch (_) {}
  }

  /**
   * Dedicated SAFE ZONE LANDING sound (approx 70-80% volume of normal movement step).
   * Pleasant, soft "ding" / light bell chime with gentle sparkle layer and tactile cushion.
   * Clearly distinct from normal movement ticks and capture impacts.
   */
  playSafeZoneLanding() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Soft bell chime / warm confirmation tone (G5 - 784Hz)
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(784, now);
      chimeGain.gain.setValueAtTime(0.12, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(now);
      chimeOsc.stop(now + 0.17);

      // 2. Subtle sparkle / upper harmonic chime layer (G6 - 1568Hz)
      const sparkleOsc = this.ctx.createOscillator();
      const sparkleGain = this.ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(1568, now);
      sparkleGain.gain.setValueAtTime(0.038, now);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(this.ctx.destination);
      sparkleOsc.start(now);
      sparkleOsc.stop(now + 0.10);

      // 3. Gentle wooden cushion transient (grounded board touchdown)
      const cushionOsc = this.ctx.createOscillator();
      const cushionGain = this.ctx.createGain();
      cushionOsc.type = 'triangle';
      cushionOsc.frequency.setValueAtTime(300, now);
      cushionOsc.frequency.exponentialRampToValueAtTime(150, now + 0.035);
      cushionGain.gain.setValueAtTime(0.06, now);
      cushionGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      cushionOsc.connect(cushionGain);
      cushionGain.connect(this.ctx.destination);
      cushionOsc.start(now);
      cushionOsc.stop(now + 0.045);
    } catch (_) {}
  }

  playBonusRoll() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [659.25, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.15);
      });
    } catch (_) {}
  }

  playHome() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.18, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch (_) {}
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.14 },
        { f: 523.25, d: 0.14 },
        { f: 523.25, d: 0.14 },
        { f: 659.25, d: 0.35 },
        { f: 587.33, d: 0.14 },
        { f: 659.25, d: 0.14 },
        { f: 783.99, d: 0.5 }
      ];

      let t = now;
      fanfare.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d;
      });
    } catch (_) {}
  }

  playEmoji() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }
}

export const ludoAudio = new LudoAudioService();
