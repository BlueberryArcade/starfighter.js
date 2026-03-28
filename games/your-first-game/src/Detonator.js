import { ctx } from './game.js';
import Fragment from './Fragment.js';

export default class Detonator {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.timer = 45;
    this.exploded = false;
  }

  update() {
    this.y = this.y - this.speed;
    this.timer = this.timer - 1;

    if (this.timer <= 0) {
      this.exploded = true;
    }
  }

  draw() {
    // Blink faster as the timer gets low.
    const blink = this.timer < 15 && Math.floor(this.timer / 3) % 2 === 0;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = blink ? '#ffffff' : '#ff3300';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isOffScreen() {
    return this.y < 0;
  }

  explode() {
    const fragments = [];
    const count = 100;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = 8 + Math.random() * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      fragments.push(new Fragment(this.x, this.y, vx, vy));
    }

    return fragments;
  }
}