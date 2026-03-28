import { ctx } from './game.js';

export default class TankEnemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.radius = 28;
    this.hp = 3;
    this.points = 5;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#cc44cc';
    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo(-22, -20);
    ctx.lineTo(22, -20);
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