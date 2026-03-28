import { canvas, ctx } from './game.js';

export default class Fragment {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 40;
  }

  update() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    this.life = this.life - 1;
  }

  draw() {
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
  }

  isOffScreen() {
    return this.life <= 0 || this.x < 0 || this.x > canvas.width
      || this.y < 0 || this.y > canvas.height;
  }
}