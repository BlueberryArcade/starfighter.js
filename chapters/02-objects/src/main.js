const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// The ship starts near the bottom-center of the canvas.
let shipX = canvas.width / 2;
let shipY = canvas.height - 60;

// An array of active laser objects.
const lasers = [];

// All active enemies are stored here, each with an x and y position.
const enemies = [];

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
    lasers.push({ x: shipX, y: shipY - 20 });
  }

  // Press R to restart after game over.
  if ((event.key === 'r' || event.key === 'R') && gameOver) {
    score = 0;
    lives = 9;
    gameOver = false;
    frameCount = 0;
    shipX = canvas.width / 2;
    lasers.length = 0;
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

// Moves all active lasers, removes ones that have left the canvas,
// and draws the ones that remain.
function updateLasers() {
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].y = lasers[i].y - 8;

    if (lasers[i].y < 0) {
      lasers.splice(i, 1);
      continue;
    }

    ctx.fillStyle = '#ffff00';
    ctx.fillRect(lasers[i].x - 2, lasers[i].y - 8, 4, 16);
  }
}

// Checks every laser against every enemy.
// Removes both on a hit and increments the score.
function checkCollisions() {
  for (let bi = lasers.length - 1; bi >= 0; bi--) {
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      const dx = lasers[bi].x - enemies[ei].x;
      const dy = lasers[bi].y - enemies[ei].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        enemies.splice(ei, 1);
        score++;
        lasers.splice(bi, 1);
        break;
      }
    }
  }
}

// Spawns new enemies on a timer, moves all existing enemies downward,
// removes ones that have left the canvas, and draws them.
function updateEnemies() {
  frameCount++;

  if (frameCount % 90 === 0) {
    enemies.push({
      x: Math.random() * (canvas.width - 30) + 15,
      y: -20
    });
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y = enemies[i].y + 2;

    if (enemies[i].y > canvas.height + 20) {
      enemies.splice(i, 1);
      lives--;
      if (lives <= 0) { gameOver = true; }
      continue;
    }

    ctx.save();
    ctx.translate(enemies[i].x, enemies[i].y);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(-15, -15);
    ctx.lineTo(15, -15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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

  const speed = 5;
  if (keys['ArrowLeft'])  { shipX = shipX - speed; }
  if (keys['ArrowRight']) { shipX = shipX + speed; }
  if (shipX < 15)                { shipX = 15; }
  if (shipX > canvas.width - 15) { shipX = canvas.width - 15; }

  drawShip();
  updateLasers();
  checkCollisions();
  updateEnemies();
  drawHUD();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
