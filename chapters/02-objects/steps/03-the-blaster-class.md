# The Blaster Class

Right now, lasers are plain `{ x, y }` objects, and the `updateLasers()` function handles all their logic — movement, removal, and drawing — from the outside. Let's give each projectile its own behaviour.

We'll also rename "laser" to "blaster" going forward. As we add more weapon types later, "blaster" will refer to the default weapon, and "projectile" will be the general term for anything that's been fired.

## The Blaster class

Add this class below the Ship class:

```js
class Blaster {
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
```

Notice the pattern — it's the same shape as the Ship class: a constructor to set initial state, and methods for the things this object needs to do. The `isOffScreen()` method returns `true` or `false`, which we'll use to decide when to remove a projectile.

## Rename the array

Find the line:

```js
const lasers = [];
```

And rename it to:

```js
const projectiles = [];
```

We're using the word "projectiles" because this array will eventually hold different types of fired objects — not just blasters.

## Update firing

In the `keydown` listener, find the line that pushes a laser:

```js
lasers.push({ x: ship.x, y: ship.y - 20 });
```

Replace it with:

```js
projectiles.push(new Blaster(ship.x, ship.y - 20));
```

Instead of creating a plain object, we're creating a `Blaster` instance — an object that knows how to move and draw itself.

## Rewrite `updateLasers()`

Rename the function to `updateProjectiles` and replace its body so it uses the Blaster class methods:

```js
function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
      continue;
    }

    projectiles[i].draw();
  }
}
```

This loop doesn't know or care *how* a projectile moves or draws itself. It just asks each one to update, checks if it's gone, and asks it to draw. When we add different weapon types later, this same loop will handle all of them without any changes.

## Update the call in `loop()`

Find `updateLasers();` inside `loop()` and rename it to match:

```js
  updateProjectiles();
```

## Update `checkCollisions()`

Inside `checkCollisions()`, replace every reference to `lasers` with `projectiles`:

```js
function checkCollisions() {
  for (let bi = projectiles.length - 1; bi >= 0; bi--) {
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      const dx = projectiles[bi].x - enemies[ei].x;
      const dy = projectiles[bi].y - enemies[ei].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        enemies.splice(ei, 1);
        score++;
        projectiles.splice(bi, 1);
        break;
      }
    }
  }
}
```

## Update the restart block

In the keydown listener's restart block, replace:

```js
lasers.length = 0;
```

With:

```js
projectiles.length = 0;
```

Save and test. Blasters should fire, move, and destroy enemies exactly as before. The difference is structural — each projectile is now a self-contained object, and the function that manages them doesn't need to know the details.

In the next step, enemies get the same treatment.
