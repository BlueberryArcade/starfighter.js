import { canvas, ctx } from './game.js';

export default class SprayParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = -(Math.random() * 5 + 5);
  }

  update() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
  }

  draw() {
    ctx.fillStyle = '#ff66ff';
    ctx.fillRect(this.x - 1, this.y - 3, 3, 6);
  }

  isOffScreen() {
    return this.y < 0 || this.x < 0 || this.x > canvas.width;
  }
}