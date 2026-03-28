import { canvas, ctx } from './game.js';

import Blaster from './Blaster.js';
import SprayParticle from './SprayParticle.js';
import Detonator from './Detonator.js';

export default class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 60;
    this.speed = 5;

     this.weapon = 'blaster';
    this.weaponTimer = 0;
  }

  update(keys) {
    if (keys['ArrowLeft'])  { this.x = this.x - this.speed; }
    if (keys['ArrowRight']) { this.x = this.x + this.speed; }

    if (this.x < 15)                { this.x = 15; }
    if (this.x > canvas.width - 15) { this.x = canvas.width - 15; }

    // Count down the weapon timer. Revert to default when it expires.
    if (this.weaponTimer > 0) {
      this.weaponTimer = this.weaponTimer - 1;
      if (this.weaponTimer <= 0) {
        this.weapon = 'blaster';
      }
    }
  }

  fire(projectiles) {
    if (this.weapon === 'dualBlaster') {
      projectiles.push(new Blaster(this.x - 12, this.y - 15));
      projectiles.push(new Blaster(this.x + 12, this.y - 15));
    } else if (this.weapon === 'wideSpray') {
      for (let i = 0; i < 15; i++) {
        projectiles.push(new SprayParticle(this.x, this.y - 20));
      }
    } else if (this.weapon === 'detonator') {
      projectiles.push(new Detonator(this.x, this.y - 20));
    } else {
      projectiles.push(new Blaster(this.x, this.y - 20));
    }
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