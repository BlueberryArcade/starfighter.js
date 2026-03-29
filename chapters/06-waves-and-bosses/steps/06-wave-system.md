# Wave System

The game currently spawns enemies at a constant drip with occasional formations. Let's replace that with a structured wave system: defined groups of enemies, pauses between them, and escalating difficulty.

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

Each wave lists what to spawn. The last wave has `boss: true` — the boss appears after its enemies are cleared.

## Wave state

Add state variables:

```js
let currentWave = 0;
let waveEnemiesSpawned = 0;
let betweenWaves = false;
let betweenWaveTimer = 0;
```

## Replace spawnEnemies()

Replace the entire function:

```js
function spawnEnemies() {
  frameCount++;

  // Between-wave pause.
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

  // Spawn one enemy every 60 frames.
  if (waveEnemiesSpawned < totalInWave && frameCount % 60 === 0) {
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

  // When all wave enemies are destroyed, advance.
  if (waveEnemiesSpawned >= totalInWave && enemies.length === 0) {
    if (wave.boss && !bossSpawned) {
      enemies.push(new Boss());
      bossSpawned = true;
      return;
    }

    if (!wave.boss || (bossSpawned && enemies.length === 0)) {
      currentWave = currentWave + 1;
      betweenWaves = true;
      betweenWaveTimer = 180;
    }
  }

  // Power-ups on a timer regardless of wave.
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

In `loop()`, after `drawStars()` and before the game-over check:

```js
  if (betweenWaves) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px monospace';
    ctx.fillText('WAVE ' + (currentWave + 1), canvas.width / 2, canvas.height / 2);
  }
```

## Update the restart block

Reset the wave state:

```js
    currentWave = 0;
    waveEnemiesSpawned = 0;
    betweenWaves = false;
    betweenWaveTimer = 0;
    bossSpawned = false;
```

Save and play. "WAVE 1" appears at the start. After all enemies are destroyed, "WAVE 2" shows for 3 seconds, then the next set begins. Wave 4 ends with the boss.

## Try it

- Add more waves. Later waves can use bigger counts or mix in patrol groups.
- Add `boss: true` to every fourth wave for recurring boss fights.
- Mix formations into waves by calling `spawnVFormation` or `spawnPatrolGroup` instead of individual spawns.
