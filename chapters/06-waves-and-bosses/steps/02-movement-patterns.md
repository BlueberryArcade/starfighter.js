# Movement Patterns

Formation enemies enter from the top and fall straight down. Real arcade enemies do something more interesting — they swoop in, curve to the side, loop around, and then settle into a descent. Let's add scripted movement paths.

## Waypoints

A waypoint is just an `{ x, y }` position. A series of waypoints defines a path. The enemy moves toward the first waypoint; when it gets close enough, it advances to the next. When it runs out of waypoints, it falls straight down.

## Create `PatrolEnemy.js`

```js
import { ctx } from './game.js';
import BaseEnemy from './BaseEnemy.js';

export default class PatrolEnemy extends BaseEnemy {
  constructor(x, y, waypoints) {
    super(x, y, { speed: 3, radius: 16, hp: 1, points: 2 });
    this.waypoints = waypoints || [];
    this.waypointIndex = 0;
  }

  update() {
    if (this.waypointIndex < this.waypoints.length) {
      const target = this.waypoints[this.waypointIndex];
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Close enough — advance to the next waypoint.
        this.waypointIndex = this.waypointIndex + 1;
      } else {
        // Move toward the target at a fixed speed.
        this.x = this.x + (dx / distance) * this.speed;
        this.y = this.y + (dy / distance) * this.speed;
      }
    } else {
      // No more waypoints — fall straight down.
      super.update();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#55aaff';
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(-10, -8);
    ctx.lineTo(10, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
```

## How the movement works

The key calculation:

```js
this.x = this.x + (dx / distance) * this.speed;
this.y = this.y + (dy / distance) * this.speed;
```

`dx / distance` and `dy / distance` produce a **unit vector** — a direction with a length of exactly 1. Multiplying by `this.speed` moves the enemy that many pixels toward the target each frame, regardless of angle. This is called **normalizing** a vector — converting a direction into a fixed-speed movement. You'll use this pattern any time something needs to move toward a point at a consistent speed.

## Spawn with a path

In `main.js`:

```js
import PatrolEnemy from './PatrolEnemy.js';
```

```js
function spawnPatrolGroup() {
  const path = [
    { x: 200, y: 150 },
    { x: 600, y: 150 },
    { x: 400, y: 250 }
  ];

  for (let i = 0; i < 4; i++) {
    enemies.push(new PatrolEnemy(200, -20 - i * 40, path));
  }
}
```

Wire into `spawnEnemies()`:

```js
  if (frameCount % 600 === 0) {
    const roll = Math.random();
    if (roll < 0.33) {
      spawnVFormation(Enemy, 3);
    } else if (roll < 0.66) {
      spawnLine(FastEnemy, 6);
    } else {
      spawnPatrolGroup();
    }
    return;
  }
```

Save and play. Blue enemies enter from the top-left, fly across the screen, curve down to centre, and then fall once they've completed the path.

## Try it

- Create a zigzag: alternate left/right waypoints at increasing y positions.
- Give different enemies in the same group **different** paths that cross — they'll weave through each other.
- Try a circular path: generate waypoints using `Math.cos` and `Math.sin` in a loop.
