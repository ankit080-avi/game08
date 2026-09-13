/**
 * Particle Manager for Knife Target Arcade
 * Manages wood splinters, metal clash sparks, and level-clear shattering.
 */

export class ParticleManager {
  constructor() {
    this.particles = [];
    this.shatterPieces = [];
  }

  reset() {
    this.particles = [];
    this.shatterPieces = [];
  }

  // Wood splinters when knife embeds in log
  createImpactSplinters(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 0.2) + Math.random() * (Math.PI * 0.6); // Upward spray
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        size: 2 + Math.random() * 3.5,
        color: Math.random() > 0.4 ? '#f59e0b' : '#b45309',
        alpha: 1,
        life: 25 + Math.random() * 15,
        maxLife: 40,
        gravity: 0.18,
        type: 'splinter'
      });
    }
  }

  // Intense sparks on knife-to-knife metal collision
  createMetalSparks(x, y, count = 28) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        color: Math.random() > 0.3 ? '#38bdf8' : '#fef08a',
        alpha: 1,
        life: 20 + Math.random() * 15,
        maxLife: 35,
        gravity: 0.15,
        type: 'spark'
      });
    }
  }

  // Explode wooden log into large fractured pieces on level clear
  createTargetShatter(cx, cy, radius = 70) {
    const pieceCount = 8;
    for (let i = 0; i < pieceCount; i++) {
      const angle = (i / pieceCount) * Math.PI * 2;
      const speed = 3.5 + Math.random() * 4;
      this.shatterPieces.push({
        x: cx + Math.cos(angle) * (radius * 0.5),
        y: cy + Math.sin(angle) * (radius * 0.5),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        size: radius * 0.45,
        color: i % 2 === 0 ? '#78350f' : '#9a3412',
        alpha: 1,
        life: 45
      });
    }
  }

  update() {
    // Update normal particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update shatter pieces
    for (let i = this.shatterPieces.length - 1; i >= 0; i--) {
      const sp = this.shatterPieces[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.22; // Gravity
      sp.rot += sp.vRot;
      sp.life--;
      sp.alpha = Math.max(0, sp.life / 45);
      if (sp.life <= 0) {
        this.shatterPieces.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // Render particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.type === 'spark') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render shatter pieces
    this.shatterPieces.forEach((sp) => {
      ctx.save();
      ctx.globalAlpha = sp.alpha;
      ctx.translate(sp.x, sp.y);
      ctx.rotate(sp.rot);
      ctx.fillStyle = sp.color;
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-sp.size / 2, -sp.size / 2, sp.size, sp.size, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }
}
