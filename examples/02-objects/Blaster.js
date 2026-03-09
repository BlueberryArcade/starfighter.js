import { ctx } from './game.js';

export default class Blaster {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 8;
  }

  update() {
    this.y = this.y - this.speed;
  }

  draw() {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(this.x - 2, this.y - 8, 4, 16);
  }

  isOffScreen() {
    return this.y < 0;
  }
}