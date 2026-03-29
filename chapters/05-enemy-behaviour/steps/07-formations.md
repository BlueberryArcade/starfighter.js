# Formations

Until now every enemy spawns alone. Games like Galaga spawn enemies in groups — a V-shape swooping in, a horizontal line descending together. Let's add that.

## A formation spawner

A formation is just a set of enemies created at the same time with coordinated starting positions. No group state, no leader — they're independent objects after spawn.

In `main.js`, add this function:

```js
function spawnFormation(EnemyClass, count, startX, startY, spacingX, spacingY) {
  for (let i = 0; i < count; i++) {
    const x = startX + i * spacingX;
    const y = startY + i * spacingY;
    enemies.push(new EnemyClass(x, y));
  }
}
```

This creates `count` enemies of a given class, each offset by `spacingX` and `spacingY` from the previous one. Different spacing makes different formations.

## V-formation

A V is two lines that angle outward from a centre point. Add a function for it:

```js
function spawnVFormation(EnemyClass, armLength) {
  const centreX = canvas.width / 2;
  const startY = -20;

  // Centre enemy
  enemies.push(new EnemyClass(centreX, startY));

  // Left and right arms
  for (let i = 1; i <= armLength; i++) {
    enemies.push(new EnemyClass(centreX - i * 40, startY - i * 30));
    enemies.push(new EnemyClass(centreX + i * 40, startY - i * 30));
  }
}
```

Each enemy in the arm starts higher up (more negative `y`) so they enter the screen one by one, leader first.

## Horizontal line

```js
function spawnLine(EnemyClass, count) {
  const spacing = (canvas.width - 60) / (count - 1);
  for (let i = 0; i < count; i++) {
    enemies.push(new EnemyClass(30 + i * spacing, -20 - Math.random() * 10));
  }
}
```

A line of enemies spanning the full width. The slight random `y` offset prevents them from looking too rigid.

## Trigger formations

Update `spawnEnemies()` to occasionally spawn a formation instead of a single enemy. Add this check before the regular single-enemy spawn:

```js
  if (frameCount % 600 === 0) {
    const roll = Math.random();
    if (roll < 0.5) {
      spawnVFormation(Enemy, 3);
    } else {
      spawnLine(FastEnemy, 6);
    }
    return;
  }
```

Every 10 seconds, instead of a single enemy, a formation appears. The `return` skips the regular spawn for that frame so the two don't overlap.

## Try it

- Spawn a V of `WaveEnemy` — they'll oscillate in sync since they share the same `age` progression.
- Try a diagonal line: `spawnFormation(Enemy, 5, 100, -20, 60, -25)`.
- Mix enemy types in a formation by calling `spawnFormation` multiple times with different classes and offsets.
