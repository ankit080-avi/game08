/**
 * 2.5D High-Performance Volumetric Canvas Renderer for Knife Target Arcade
 * Renders textured wood target with growth rings, 3D cylindrical side bevel,
 * metallic knives with reflections, motion blur trails, and atmospheric lighting.
 */

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shake = 0;
  }

  triggerShake(intensity = 6) {
    this.shake = intensity;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Atmospheric enchanted forest background
  renderBackground(width, height) {
    const ctx = this.ctx;

    // Deep teal / navy radial vignette
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.35,
      40,
      width * 0.5,
      height * 0.5,
      width * 0.85
    );
    bgGrad.addColorStop(0, '#0f293d'); // Subtle top glow
    bgGrad.addColorStop(0.55, '#091825');
    bgGrad.addColorStop(1, '#040b12'); // Dark edges
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle vertical wooden planks / forest texture lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const plankWidth = 38;
    for (let x = 0; x < width; x += plankWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw 3D Volumetric Wooden Target Log
  renderTarget(cx, cy, radius, rotation) {
    const ctx = this.ctx;

    ctx.save();
    // Apply camera shake if active
    let shakeX = 0;
    let shakeY = 0;
    if (this.shake > 0) {
      shakeX = (Math.random() - 0.5) * this.shake;
      shakeY = (Math.random() - 0.5) * this.shake;
      this.shake = Math.max(0, this.shake - 0.5);
    }
    ctx.translate(cx + shakeX, cy + shakeY);

    // 1. Soft Ambient Drop Shadow behind log
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.restore();

    // 2. 3D Cylindrical Side Depth (Side Bevel)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 7, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#381604'; // Darker base bark
    ctx.fill();
    ctx.restore();

    // 3. Main Face of the Wood Log
    ctx.save();
    ctx.rotate(rotation);

    // Outer Bark Layer
    const barkGrad = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius);
    barkGrad.addColorStop(0, '#7c2d12');
    barkGrad.addColorStop(0.85, '#9a3412');
    barkGrad.addColorStop(1, '#451a03');
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = barkGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#c2410c';
    ctx.stroke();

    // Concentric Annual Growth Rings
    const ringRadii = [0.82, 0.65, 0.48, 0.32];
    ringRadii.forEach((factor, idx) => {
      ctx.beginPath();
      ctx.arc(0, 0, radius * factor, 0, Math.PI * 2);
      ctx.lineWidth = idx % 2 === 0 ? 2 : 1;
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(69, 26, 3, 0.6)' : 'rgba(251, 191, 36, 0.2)';
      ctx.stroke();
    });

    // Radial Wood Grain Cracks
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (radius * 0.35), Math.sin(angle) * (radius * 0.35));
      ctx.lineTo(Math.cos(angle) * (radius * 0.78), Math.sin(angle) * (radius * 0.78));
      ctx.stroke();
    }

    // 4. Luminous Golden Heartwood Core
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, radius * 0.22);
    coreGrad.addColorStop(0, '#fef08a');
    coreGrad.addColorStop(0.6, '#f59e0b');
    coreGrad.addColorStop(1, '#b45309');
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    // Center emblem star
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Undo rotation
    ctx.restore(); // Undo translate & shake
  }

  // Draw a single high-quality metallic knife
  drawKnifeSprite(x, y, angle, length = 56, width = 12) {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Blade Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Metallic Blade
    const bladeGrad = ctx.createLinearGradient(-width * 0.5, 0, width * 0.5, 0);
    bladeGrad.addColorStop(0, '#94a3b8');
    bladeGrad.addColorStop(0.45, '#f8fafc'); // Gleam center
    bladeGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = bladeGrad;
    ctx.beginPath();
    ctx.moveTo(0, -length); // Sharp tip
    ctx.lineTo(width * 0.45, -length * 0.3);
    ctx.lineTo(width * 0.45, 0);
    ctx.lineTo(-width * 0.45, 0);
    ctx.lineTo(-width * 0.45, -length * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Blade Center Bevel Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -length + 4);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Golden Crossguard
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-width * 0.75, 0, width * 1.5, 4.5, 2);
    ctx.fill();
    ctx.stroke();

    // Textured Grip Handle
    const handleGrad = ctx.createLinearGradient(-width * 0.3, 0, width * 0.3, 0);
    handleGrad.addColorStop(0, '#0f172a');
    handleGrad.addColorStop(0.5, '#334155');
    handleGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = handleGrad;
    ctx.beginPath();
    ctx.roundRect(-width * 0.35, 4.5, width * 0.7, length * 0.4, 2);
    ctx.fill();

    // Handle grip bands
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let h = 8; h < length * 0.4; h += 5) {
      ctx.beginPath();
      ctx.moveTo(-width * 0.35, 4.5 + h);
      ctx.lineTo(width * 0.35, 4.5 + h);
      ctx.stroke();
    }

    // Pommel (End Cap)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 4.5 + length * 0.4 + 2.5, width * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw knives stuck to the rotating target
  renderStuckKnives(cx, cy, targetRadius, targetRotation, knifeAngles) {
    const ctx = this.ctx;

    knifeAngles.forEach((angleDeg) => {
      // Angle in radians combined with log's current rotation
      const totalRad = ((angleDeg * Math.PI) / 180) + targetRotation;

      // Position on the perimeter of the log
      // Blade penetrates inside so crossguard rests on the outer rim
      const stickRadius = targetRadius - 4;
      const kx = cx + Math.cos(totalRad) * stickRadius;
      const ky = cy + Math.sin(totalRad) * stickRadius;

      // Orientation angle: pointing inwards towards center
      const knifeOrientation = totalRad - Math.PI / 2;

      this.drawKnifeSprite(kx, ky, knifeOrientation, 52, 11);
    });
  }

  // Draw Flying Knife in flight
  renderFlyingKnife(x, y, isColliding, tumbleAngle = 0) {
    const ctx = this.ctx;

    // Motion Blur Trail when ascending
    if (!isColliding) {
      const trailGrad = ctx.createLinearGradient(x, y, x, y + 45);
      trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      trailGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = trailGrad;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.lineTo(x + 1, y + 45);
      ctx.lineTo(x - 1, y + 45);
      ctx.closePath();
      ctx.fill();
    }

    const angle = isColliding ? tumbleAngle : 0;
    this.drawKnifeSprite(x, y, angle, 54, 12);
  }

  // Draw Ready Knife at bottom of screen
  renderReadyKnife(x, y, idleFloatOffset = 0) {
    this.drawKnifeSprite(x, y + idleFloatOffset, 0, 56, 12);
  }
}
