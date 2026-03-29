# Wave System

The game currently spawns enemies at a steady drip — one every 90 frames, forever. Real arcade games have **waves**: a defined set of enemies, a pause between them, then the next set. Let's replace the drip with a wave structure.

## Define the waves

In `main.js`, add a wave definition array near the top, after the imports:

```js
const waves = [
  {
    enemies: [
      { type: Enemy, count: 8 },
    ]
  },
  {
    enemies: [
      { type: Enemy, count: 5 },
      { type: FastEnemy, count: 4 },
    ]
  },
  {
    enemies: [
      { type: Enemy, count: 4 },
      { type: WaveEnemy, count: 4 },
      { type: ShooterEnemy, count: 2 },
    ]
  },
  {
    enemies: [
      { type: TrackerEnemy, count: 4 },
      { type: ShooterEnemy, count: 3 },
      { type: TankEnemy, count: 2 },
    ],
    boss: true
  }
];
```

Each wave is an object with an `enemies` array describing what to spawn. The last wave includes `boss: true` — after its enemies are cleared, the boss appears.

## Wave state

Add state variables:

```js
let currentWave = 0;
let waveEnemiesSpawned = 0;
let waveTimer = 0;
let betweenWaves = false;
let betweenWaveTimer = 0;
```

## Replace spawnEnemies()

Replace the entire `spawnEnemies()` function:

```js
function spawnEnemies() {
  frameCount++;

  // Between-wave pause: show the wave number, wait, then start.
  if (betweenWaves) {
    betweenWaveTimer = betweenWaveTimer - 1;
    if (betweenWaveTimer <= 0) {
      betweenWaves = false;
      waveEnemiesSpawned = 0;
    }
    return;
  }

  // All waves cleared.
  if (currentWave >= waves.length) return;

  const wave = waves[currentWave];

  // Count total enemies in this wave.
  let totalInWave = 0;
  for (let i = 0; i < wave.enemies.length; i++) {
    totalInWave = totalInWave + wave.enemies[i].count;
  }

  // Spawn one enemy every 60 frames until the wave's roster is done.
  if (waveEnemiesSpawned < totalInWave && frameCount % 60 === 0) {
    // Figure out which type to spawn based on how many we've spawned so far.
    let remaining = waveEnemiesSpawned;
    let EnemyClass = Enemy;
    for (let i = 0; i < wave.enemies.length; i++) {
      if (remaining < wave.enemies[i].count) {
        EnemyClass = wave.enemies[i].type;
        break;
      }
      remaining = remaining - wave.enemies[i].count;
    }

    const x = Math.random() * (canvas.width - 30) + 15;
    enemies.push(new EnemyClass(x, -20));
    waveEnemiesSpawned = waveEnemiesSpawned + 1;
  }

  // When all enemies from this wave are destroyed, advance.
  if (waveEnemiesSpawned >= totalInWave && enemies.length === 0) {
    if (wave.boss && !bossSpawned) {
      enemies.push(new Boss());
      bossSpawned = true;
      return;
    }

    // Boss defeated (or no boss) — move to next wave.
    if (!wave.boss || (bossSpawned && enemies.length === 0)) {
      currentWave = currentWave + 1;
      betweenWaves = true;
      betweenWaveTimer = 180; // 3 seconds
    }
  }

  // Spawn power-ups on a timer regardless of wave.
  if (frameCount % 900 === 0) {
    const x = Math.random() * (canvas.width - 60) + 30;
    const roll = Math.random();
    let type;
    if (roll < 0.8) {
      type = 'dualBlaster';
    } else if (roll < 0.9) {
      type = 'wideSpray';
    } else {
      type = 'detonator';
    }
    powerups.push(new PowerUp(x, type));
  }
}
```

## Show the wave number

In `loop()`, after `drawStars()` and before the game-over check, add:

```js
  if (betweenWaves) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px monospace';
    ctx.fillText('WAVE ' + (currentWave + 1), canvas.width / 2, canvas.height / 2);
  }
```

## Update the restart block

In the restart code, reset the wave state:

```js
    currentWave = 0;
    waveEnemiesSpawned = 0;
    waveTimer = 0;
    betweenWaves = false;
    betweenWaveTimer = 0;
    bossSpawned = false;
```

Save and play. The game now progresses through waves. "WAVE 1" appears at the start. After all wave-1 enemies are destroyed, "WAVE 2" shows for 3 seconds, then the next set begins. Wave 4 ends with the boss.

## Try it

- Add more waves. Increase the count and mix of enemy types.
- Add `boss: true` to every fourth wave for recurring boss fights.
- Scale difficulty: later waves can use larger counts or tougher enemy types.
