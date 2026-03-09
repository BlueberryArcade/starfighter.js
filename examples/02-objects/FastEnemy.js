import { ctx } from './game.js';

export default class FastEnemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.radius = 12;
    this.hp = 1;
    this.points = 2;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(-8, -8);
    ctx.lineTo(8, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  isOffScreen() {
    return this.y > 620;
  }

  hit() {
    this.hp = this.hp - 1;
    return this.hp <= 0;
  }
}