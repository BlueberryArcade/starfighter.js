import { canvas, ctx } from './game.js';

export default class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = 20;
    this.hp = 1;
    this.points = 1;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(-15, -15);
    ctx.lineTo(15, -15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  isOffScreen() {
    return this.y > canvas.height + 20;
  }

  hit() {
    this.hp = this.hp - 1;
    return this.hp <= 0;
  }
}