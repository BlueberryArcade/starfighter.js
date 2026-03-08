import { canvas, ctx } from './game.js';

export default class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 60;
    this.speed = 5;
  }

  update(keys) {
    if (keys['ArrowLeft'])  { this.x = this.x - this.speed; }
    if (keys['ArrowRight']) { this.x = this.x + this.speed; }

    if (this.x < 15)                { this.x = 15; }
    if (this.x > canvas.width - 15) { this.x = canvas.width - 15; }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 15);
    ctx.lineTo(15, 15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}