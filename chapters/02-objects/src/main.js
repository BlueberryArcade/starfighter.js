import { canvas, ctx } from './game.js';
import Ship from './Ship.js';
import Blaster from './Blaster.js';
import Enemy from './Enemy.js';

import FastEnemy from './FastEnemy.js';
import TankEnemy from './TankEnemy.js';

const ship = new Ship();

// An array of active laser objects.
const projectiles = [];

// All active enemies are stored here, each with an x and y position.
const enemies = [];

// frameCount increases by 1 every frame.
let frameCount = 0;

// Score increases each time an enemy is destroyed.
let score = 0;

// The player starts with 3 lives.
let lives = 3;

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
    projectiles.push(new Blaster(ship.x, ship.y - 20));
  }

  // Press R to restart after game over.
  if ((event.key === 'r' || event.key === 'R') && gameOver) {
    score = 0;
    lives = 3;
    gameOver = false;
    frameCount = 0;
    ship.x = canvas.width / 2;
    projectiles.length = 0;
    enemies.length = 0;
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

// Draws the player's ship at its current position.
function drawShip() {
  ctx.save();
  ctx.translate(shipX, shipY);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-15, 15);
  ctx.lineTo(15, 15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
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
}

function updateProjectiles(){
    for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
      continue;
    }

    projectiles[i].draw();
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

  drawHUD();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
