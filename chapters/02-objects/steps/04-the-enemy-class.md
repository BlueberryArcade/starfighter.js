# The Enemy Class

You've seen the pattern twice now — take scattered data and behaviour, bundle it into a class. Enemies are next, and this time the refactoring should feel familiar.

## The Enemy class

Add this below the `Blaster` class:

```js
class Enemy {
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
```

A few things are new here:

- **`radius`** stores how big this enemy is for collision checks. We were using the magic number `20` before — now it lives on the object where it belongs.
- **`hp`** is hit points. Right now every enemy dies in one hit, but this sets us up for tougher enemies later.
- **`points`** is how much score this enemy is worth.
- **`hit()`** reduces hp by 1 and returns `true` if the enemy is destroyed. This lets the collision code ask "did that kill it?" without needing to know the enemy's hp rules.

## Rewrite `updateEnemies()`

The old `updateEnemies()` did two things: spawning new enemies *and* updating existing ones. Those are really two separate jobs. Let's split them.

First, create a new `spawnEnemies()` function:

```js
function spawnEnemies() {
  frameCount++;
  if (frameCount % 90 === 0) {
    const x = Math.random() * (canvas.width - 30) + 15;
    enemies.push(new Enemy(x, -20));
  }
}
```

Then rewrite `updateEnemies()` to use the Enemy class methods:

```js
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();

    if (enemies[i].isOffScreen()) {
      enemies.splice(i, 1);
      lives--;
      if (lives <= 0) { gameOver = true; }
      continue;
    }

    enemies[i].draw();
  }
}
```

Notice how similar this looks to `updateProjectiles()`. Both loops follow the same pattern: update, check bounds, draw. That's because both are managing arrays of objects that share the same interface.

## Update `loop()`

Add a call to `spawnEnemies()` in `loop()`, just before `updateProjectiles()`:

```js
  spawnEnemies();
  updateProjectiles();
  checkCollisions();
  updateEnemies();
```

## Update `checkCollisions()`

Now that enemies have `radius`, `points`, and `hit()`, we can make the collision code smarter:

```js
function checkCollisions() {
  for (let bi = projectiles.length - 1; bi >= 0; bi--) {
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      const dx = projectiles[bi].x - enemies[ei].x;
      const dy = projectiles[bi].y - enemies[ei].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemies[ei].radius) {
        const destroyed = enemies[ei].hit();

        if (destroyed) {
          score = score + enemies[ei].points;
          enemies.splice(ei, 1);
        }

        projectiles.splice(bi, 1);
        break;
      }
    }
  }
}
```

Two improvements:

1. The collision distance uses `enemies[ei].radius` instead of a hard-coded `20`. Different enemies will be able to have different sizes.
2. We call `enemies[ei].hit()` instead of immediately removing the enemy. If `hit()` returns `false`, the enemy survives — the projectile is still consumed, but the enemy takes damage and keeps going.

## Before and after

Save and test. The game plays identically. But compare your `loop()` now to what it looked like at the start of this chapter:

```
ship.update(keys)
ship.draw()
spawnEnemies()
updateProjectiles()
checkCollisions()
updateEnemies()
drawHUD()
```

Seven clear actions. The *how* lives inside the classes and functions. The loop just says *what* happens each frame, in order. And when we want to add new features — new enemy types, new weapons — we can focus on the class for that feature without worrying about the rest of the game.

In the next step, we'll take this organization one level further by splitting the classes into their own files.
