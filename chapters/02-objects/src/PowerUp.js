import { ctx } from './game.js';

export default class PowerUp {
  constructor(x, type) {
    this.x = x;
    this.y = -20;
    this.type = type;
    this.speed = 1.5;
    this.radius = 15;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // A diamond shape — distinct from any enemy.
// Green for dual blaster, pink for wide spray.
    if (this.type === 'dualBlaster') {
      ctx.fillStyle = '#44ff44';
    } else if (this.type === 'wideSpray') {
      ctx.fillStyle = '#ff66ff';
    } else if (this.type === 'detonator') {
      ctx.fillStyle = '#ff3300';
    }

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  isOffScreen() {
    return this.y > 620;
  }
}