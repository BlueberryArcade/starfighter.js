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
    ctx.fillStyle = '#44ff44';
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