/**
 * Game Renderer for Knife Rain
 * 2.5D High-Performance Canvas Renderer using authentic Knife Rain sprites.
 * Preloads and renders wood targets, boss robots, metallic knives, sliceable apples,
 * glowing trails, and atmospheric forest backgrounds.
 */

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
  ? import.meta.env.BASE_URL
  : '/';
const BASE = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shake = 0;
    this.assets = {};
    this.assetsLoaded = false;

    this.loadAssets();
  }

  loadAssets() {
    const assetSources = {
      background: `${BASE}games/knife-rain/background.jpg`,
      knife: `${BASE}games/knife-rain/knife_default.png`,
      targetWood: `${BASE}games/knife-rain/target_wood.png`,
      targetBossRobot: `${BASE}games/knife-rain/target_boss_robot.png`,
      apple: `${BASE}games/knife-rain/apple.png`,
      applePieceLeft: `${BASE}games/knife-rain/apple_piece_left.png`,
      applePieceRight: `${BASE}games/knife-rain/apple_piece_right.png`,
      targetPiece: `${BASE}games/knife-rain/target_piece_1.png`
    };

    let loadedCount = 0;
    const total = Object.keys(assetSources).length;

    Object.entries(assetSources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= total) {
          this.assetsLoaded = true;
        }
      };
      this.assets[key] = img;
    });
  }

  triggerShake(intensity = 6) {
    this.shake = intensity;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Authentic Knife Rain forest background
  renderBackground(width, height) {
    const ctx = this.ctx;
    const bgImg = this.assets.background;

    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, width, height);
    } else {
      // High fidelity gradient fallback
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        30,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      bgGrad.addColorStop(0, '#0d3246');
      bgGrad.addColorStop(0.6, '#061b29');
      bgGrad.addColorStop(1, '#020b12');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Draw Rotating Target with Shadow & Bevel
  renderTarget(cx, cy, radius, rotation, targetType = 'wood') {
    const ctx = this.ctx;

    ctx.save();
    let shakeX = 0;
    let shakeY = 0;
    if (this.shake > 0) {
      shakeX = (Math.random() - 0.5) * this.shake;
      shakeY = (Math.random() - 0.5) * this.shake;
      this.shake = Math.max(0, this.shake - 0.6);
    }
    ctx.translate(cx + shakeX, cy + shakeY);

    // 1. Ambient Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 14;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.restore();

    // 2. Rotating Target Face
    ctx.save();
    ctx.rotate(rotation);

    const targetImg = targetType === 'boss_robot' ? this.assets.targetBossRobot : this.assets.targetWood;
    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      ctx.drawImage(targetImg, -radius, -radius, radius * 2, radius * 2);
    } else {
      // Procedural wood backup
      const barkGrad = ctx.createRadialGradient(0, 0, radius * 0.6, 0, 0, radius);
      barkGrad.addColorStop(0, '#fef08a');
      barkGrad.addColorStop(0.5, '#f59e0b');
      barkGrad.addColorStop(1, '#78350f');
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = barkGrad;
      ctx.fill();
    }

    ctx.restore(); // undo rotation
    ctx.restore(); // undo translate
  }

  // Draw Apples attached to the rotating target
  renderApples(cx, cy, targetRadius, targetRotation, apples) {
    if (!apples || apples.length === 0) return;
    const ctx = this.ctx;
    const appleImg = this.assets.apple;

    apples.forEach((appleAngleDeg) => {
      const totalRad = ((appleAngleDeg * Math.PI) / 180) + targetRotation;
      const attachRadius = targetRadius + 6;
      const ax = cx + Math.cos(totalRad) * attachRadius;
      const ay = cy + Math.sin(totalRad) * attachRadius;

      ctx.save();
      ctx.translate(ax, ay);
      // Apple points outward radially
      ctx.rotate(totalRad + Math.PI / 2);

      if (appleImg && appleImg.complete && appleImg.naturalWidth > 0) {
        ctx.drawImage(appleImg, -13, -15, 26, 30);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // Draw single knife (used for stuck, flying, ready)
  drawKnifeSprite(x, y, angle, length = 60, width = 18) {
    const ctx = this.ctx;
    const knifeImg = this.assets.knife;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (knifeImg && knifeImg.complete && knifeImg.naturalWidth > 0) {
      // Draw knife centered on X, pointing upwards (tip at -length, handle at bottom)
      ctx.drawImage(knifeImg, -width / 2, -length, width, length);
    } else {
      // Fallback vector knife
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(0, -length);
      ctx.lineTo(width * 0.4, -length * 0.3);
      ctx.lineTo(width * 0.4, 0);
      ctx.lineTo(-width * 0.4, 0);
      ctx.lineTo(-width * 0.4, -length * 0.3);
      ctx.closePath();
      ctx.fill();

      // Guard & handle
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-width * 0.6, 0, width * 1.2, 4);
      ctx.fillStyle = '#334155';
      ctx.fillRect(-width * 0.3, 4, width * 0.6, length * 0.4);
    }

    ctx.restore();
  }

  // Draw knives stuck to the rotating target
  renderStuckKnives(cx, cy, targetRadius, targetRotation, knifeAngles) {
    if (!knifeAngles) return;
    knifeAngles.forEach((angleDeg) => {
      const totalRad = ((angleDeg * Math.PI) / 180) + targetRotation;
      // Penetrates slightly into the target
      const stickRadius = targetRadius - 8;
      const kx = cx + Math.cos(totalRad) * stickRadius;
      const ky = cy + Math.sin(totalRad) * stickRadius;

      // Inward facing: points towards target center
      const knifeOrientation = totalRad - Math.PI / 2;

      this.drawKnifeSprite(kx, ky, knifeOrientation, 56, 17);
    });
  }

  // Draw Flying Knife
  renderFlyingKnife(x, y, isColliding, tumbleAngle = 0) {
    const ctx = this.ctx;

    // Glowing cyan / white motion blur trail when ascending
    if (!isColliding) {
      const trailGrad = ctx.createLinearGradient(x, y, x, y + 55);
      trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      trailGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
      trailGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = trailGrad;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.lineTo(x + 1, y + 55);
      ctx.lineTo(x - 1, y + 55);
      ctx.closePath();
      ctx.fill();
    }

    const angle = isColliding ? tumbleAngle : 0;
    this.drawKnifeSprite(x, y, angle, 58, 18);
  }

  // Draw Ready Knife at bottom
  renderReadyKnife(x, y, idleFloatOffset = 0) {
    this.drawKnifeSprite(x, y + idleFloatOffset, 0, 60, 19);
  }
}

