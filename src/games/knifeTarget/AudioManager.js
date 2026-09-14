/**
 * Audio Manager for Knife Rain
 * Preloads and plays authentic Knife Rain sound effects with audio pool support.
 * Includes Web Audio API synthesizer fallback if audio files or autoplay are blocked.
 */

class SoundService {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.audioCache = {};
    this.soundUrls = {
      throw: '/games/knife-rain/sounds/throw.m4a',
      hit: '/games/knife-rain/sounds/hit.m4a',
      clash: '/games/knife-rain/sounds/hit-knife.m4a',
      apple: '/games/knife-rain/sounds/hit-apple.m4a',
      shatter: '/games/knife-rain/sounds/target-pop.m4a',
      gameOver: '/games/knife-rain/sounds/game-over.m4a',
      levelUp: '/games/knife-rain/sounds/level-up.m4a',
      bossStart: '/games/knife-rain/sounds/boss-start.m4a',
      button: '/games/knife-rain/sounds/button.m4a'
    };

    this.preloadSounds();
  }

  preloadSounds() {
    if (typeof window === 'undefined') return;
    Object.entries(this.soundUrls).forEach(([key, url]) => {
      try {
        const pool = [];
        for (let i = 0; i < 3; i++) {
          const a = new Audio(url);
          a.preload = 'auto';
          pool.push(a);
        }
        this.audioCache[key] = { pool, index: 0 };
      } catch (_) {}
    });
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

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playSound(key) {
    if (this.muted) return;
    this.init();

    const cached = this.audioCache[key];
    if (cached && cached.pool && cached.pool.length > 0) {
      const audio = cached.pool[cached.index];
      cached.index = (cached.index + 1) % cached.pool.length;
      try {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.playFallback(key);
          });
        }
        return;
      } catch (_) {}
    }

    this.playFallback(key);
  }

  playFallback(key) {
    if (this.muted || !this.ctx) return;
    try {
      if (key === 'throw') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
      } else if (key === 'hit') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
      } else if (key === 'clash') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.29);
      } else if (key === 'apple') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.11);
      }
    } catch (_) {}
  }

  playThrow() {
    this.playSound('throw');
  }

  playImpact() {
    this.playSound('hit');
  }

  playClash() {
    this.playSound('clash');
  }

  playApple() {
    this.playSound('apple');
  }

  playLevelComplete() {
    this.playSound('shatter');
    setTimeout(() => this.playSound('levelUp'), 250);
  }

  playGameOver() {
    this.playSound('gameOver');
  }

  playBossStart() {
    this.playSound('bossStart');
  }

  playButton() {
    this.playSound('button');
  }
}

export const audioManager = new SoundService();
