# Recursion in the Game

The fractal tree was a standalone exercise. Let's bring recursion into the game with two applications: recursive explosions and procedural shapes.

## Recursive explosions

The detonator currently spawns 100 fragments in a ring. What if each fragment could spawn its own smaller fragments when it expires — a chain reaction?

Open `Fragment.js`. Add a `generation` property:

```js
constructor(x, y, vx, vy, generation) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.life = 20 + Math.random() * 20;
  this.generation = generation || 1;
}
```

Add a method that spawns sub-fragments:

```js
spawn() {
  if (this.generation >= 3) return [];

  const children = [];
  const count = 3;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 2;
    children.push(new Fragment(
      this.x, this.y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      this.generation + 1
    ));
  }
  return children;
}
```

The base case is `this.generation >= 3` — no more children after three levels. Without this, each explosion would create infinite fragments and crash the game.

Now update `updateProjectiles()` in `main.js`. In the section that handles `isOffScreen()`, add a check for expired fragments:

```js
    if (projectiles[i].isOffScreen()) {
      // If the dying projectile can spawn children, collect them.
      if (projectiles[i].spawn) {
        const children = projectiles[i].spawn();
        for (let j = 0; j < children.length; j++) {
          newProjectiles.push(children[j]);
        }
      }
      projectiles.splice(i, 1);
      continue;
    }
```

Save and play. Fire a detonator. The initial ring of fragments expires and each one pops into 3 smaller fragments, which expire and pop into 3 more. The explosion cascades outward in a fractal pattern.

## Scale by generation

Make sub-fragments visually smaller. In `Fragment.js`, update `draw()`:

```js
draw() {
  const size = Math.max(1, 4 - this.generation);
  ctx.fillStyle = this.generation === 1 ? '#ffaa00' : this.generation === 2 ? '#ff6600' : '#ff3300';
  ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
}
```

First-generation fragments are 3px gold, second are 2px orange, third are 1px red. The explosion shifts colour as it cascades.

## Procedural shapes

Recursion can also generate shapes. Here's a function that draws a jagged asteroid outline:

```js
function drawCrack(ctx, x, y, angle, length, depth) {
  if (depth <= 0 || length < 2) return;

  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Branch into 1-2 sub-cracks with random angles.
  const branches = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < branches; i++) {
    const newAngle = angle + (Math.random() - 0.5) * 1.5;
    drawCrack(ctx, endX, endY, newAngle, length * 0.6, depth - 1);
  }
}
```

This could be called when a tank enemy is destroyed — cracks radiating from the hit point. Or used to generate lightning bolts between the boss and the player.

## Try it

- Change the fragment child count from 3 to 5 — the cascade becomes denser.
- Reduce the generation limit to 2 for a subtler effect, or increase to 4 for an over-the-top explosion.
- Use `drawCrack` to add lightning bolts to the detonator's explosion — call it once at the detonator's position when it explodes.
