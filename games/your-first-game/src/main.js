import { canvas, ctx } from './game.js';
import Ship from './Ship.js';
import Blaster from './Blaster.js';
import Enemy from './Enemy.js';

import FastEnemy from './FastEnemy.js';
import TankEnemy from './TankEnemy.js';

import PowerUp from './PowerUp.js';

const ship = new Ship();

// An array of active laser objects.
const projectiles = [];

// All active enemies are stored here, each with an x and y position.
const enemies = [];

// Power ups
const powerups = [];

// frameCount increases by 1 every frame.
let frameCount = 0;

// Score increases each time an enemy is destroyed.
let score = 0;

// The player starts with 9 lives.
let lives = 9;

// When this is true, the game loop stops updating and shows a game over screen.
let gameOver = false;

// An array is an ordered list of values.
// We'll store each star as an object with an x and y property.
const stars = [];

// This for loop runs 80 times, adding one random star each time.
for (let i = 0; i < 80; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  });
}

// keys is an object that tracks which keys are currently held down.
const keys = {};

// 'keydown' fires the moment a key is pressed.
window.addEventListener('keydown', function(event) {
  keys[event.key] = true;

  // Fire a laser when the spacebar is pressed.
   if (event.key === ' ') {
    ship.fire(projectiles);
  }

  // Press R to restart after game over.
  if ((event.key === 'r' || event.key === 'R') && gameOver) {
    score = 0;
    lives = 9;
    gameOver = false;
    frameCount = 0;
    ship.x = canvas.width / 2;
    ship.weapon = 'blaster';
    ship.weaponTimer = 0;
    projectiles.length = 0;
    enemies.length = 0;
    powerups.length = 0;
  }
});

// 'keyup' fires the moment a key is released.
window.addEventListener('keyup', function(event) {
  keys[event.key] = false;
});

// Draws the star field. Called once per frame.
function drawStars() {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < stars.length; i++) {
    ctx.fillRect(stars[i].x, stars[i].y, 2, 2);
  }
}

function collectPowerUp(type) {
  ship.weapon = type;
  ship.weaponTimer = 600;
}

// Checks every laser against every enemy.
// Removes both on a hit and increments the score.
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

function spawnEnemies() {
  frameCount++;
  if (frameCount % 90 === 0) {
    const x = Math.random() * (canvas.width - 30) + 15;
    const roll = Math.random();

    if (roll < 0.2) {
      enemies.push(new FastEnemy(x, -20));
    } else if (roll < 0.35) {
      enemies.push(new TankEnemy(x, -20));
    } else {
      enemies.push(new Enemy(x, -20));
    }
  }

  // Spawn a power-up roughly every 15 seconds.
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

// Spawns new enemies on a timer, moves all existing enemies downward,
// removes ones that have left the canvas, and draws them.
function updateEnemies() {

  // --- Update enemies ---
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

// Draws the score and lives counter in the top-left corner.
function drawHUD() {
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px monospace';
  ctx.textAlign = 'left';

  ctx.fillText('Score: ' + score, 10, 30);
  ctx.fillText('Lives: ' + lives, 10, 55);

  if (ship.weapon !== 'blaster') {
    ctx.fillStyle = '#44ff44';
    ctx.fillText('Weapon: ' + ship.weapon, 10, 80);
  }
}

function updateProjectiles() {
  const newProjectiles = [];

  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();

    // If this projectile has exploded, collect its fragments.
    if (projectiles[i].exploded) {
      const fragments = projectiles[i].explode();
      for (let j = 0; j < fragments.length; j++) {
        newProjectiles.push(fragments[j]);
      }
      projectiles.splice(i, 1);
      continue;
    }

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
      continue;
    }

    projectiles[i].draw();
  }

  // Add any newly spawned projectiles after the loop is done.
  for (let i = 0; i < newProjectiles.length; i++) {
    projectiles.push(newProjectiles[i]);
  }
}

function updatePowerups() {
 // --- Power-ups ---
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].update();

    if (powerups[i].isOffScreen()) {
      powerups.splice(i, 1);
      continue;
    }

    // Check if the ship touches this power-up.
    const dx = ship.x - powerups[i].x;
    const dy = ship.y - powerups[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < powerups[i].radius + 15) {
      collectPowerUp(powerups[i].type);
      powerups.splice(i, 1);
      continue;
    }

    // Check if any projectile hits this power-up.
    let collected = false;
    for (let j = projectiles.length - 1; j >= 0; j--) {
      const px = projectiles[j].x - powerups[i].x;
      const py = projectiles[j].y - powerups[i].y;
      const pd = Math.sqrt(px * px + py * py);

      if (pd < powerups[i].radius) {
        collectPowerUp(powerups[i].type);
        projectiles.splice(j, 1);
        collected = true;
        break;
      }
    }

    if (collected) {
      powerups.splice(i, 1);
      continue;
    }

    powerups[i].draw();
  }
}

// loop() is the heartbeat of the game.
function loop() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawStars();

  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';

    ctx.font = '48px monospace';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '24px monospace';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 60);

    requestAnimationFrame(loop);
    return;
  }

  ship.update(keys);
  ship.draw();

  spawnEnemies();
  updateProjectiles();
  checkCollisions();
  updateEnemies();
  updatePowerups();

  drawHUD();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
