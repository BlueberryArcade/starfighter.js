# Score and Game Over

The last pieces of a real game: keeping score, losing lives, and ending the game when the player runs out.

## New state variables

Add these near the top of `main.js` with the other variable declarations:

```js
// Score increases each time an enemy is destroyed.
let score = 0;

// The player starts with 3 lives. An enemy reaching the bottom costs one.
let lives = 3;

// When this is true, the game loop stops updating and shows a game over screen.
let gameOver = false;
```

## Update `checkCollisions()` to increment the score

Inside `checkCollisions()`, add `score++` right after the enemy is removed:

```js
        enemies.splice(ei, 1);
        score++;           // add this line
        lasers.splice(bi, 1);
        break;
```

`score++` is shorthand for `score = score + 1`.

## Update `updateEnemies()` to deduct lives

Inside `updateEnemies()`, replace the line that removes off-screen enemies:

```js
    if (enemies[i].y > canvas.height + 20) {
      enemies.splice(i, 1);
      continue;
    }
```

With this:

```js
    if (enemies[i].y > canvas.height + 20) {
      enemies.splice(i, 1);

      // An enemy got through — lose a life.
      lives--;

      // If the player is out of lives, end the game.
      if (lives <= 0) {
        gameOver = true;
      }

      continue;
    }
```

`lives--` is shorthand for `lives = lives - 1`.

## Add a `drawHUD()` function

HUD stands for "Heads-Up Display" — the score, lives, and other info drawn on top of the game. Add this function alongside the others:

```js
// Draws the score and lives counter in the top-left corner.
function drawHUD() {
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px monospace';

  // textAlign controls whether x is the left, center, or right of the text.
  ctx.textAlign = 'left';

  ctx.fillText('Score: ' + score, 10, 30);
  ctx.fillText('Lives: ' + lives, 10, 55);
}
```

## Update `loop()` to handle game over

Replace your current `loop()` body with this final version:

```js
function loop() {

  // --- Clear ---
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Background ---
  drawStars();

  // If the game is over, draw the end screen and stop.
  if (gameOver) {
    // Semi-transparent black overlay over the game.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center the game over text.
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';

    ctx.font = '48px monospace';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '24px monospace';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 60);

    // Stop here — don't request another frame for normal game logic.
    // The loop is still running so the screen stays visible.
    requestAnimationFrame(loop);
    return;
  }

  // --- Normal game update ---
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
```

## Add a restart handler

Inside the `keydown` listener, add a restart block:

```js
  // Press R to restart after game over.
  if ((event.key === 'r' || event.key === 'R') && gameOver) {
    // Reset all game state to its starting values.
    score = 0;
    lives = 3;
    gameOver = false;
    frameCount = 0;
    shipX = canvas.width / 2;

    // Empty the arrays by setting their length to 0.
    lasers.length = 0;
    enemies.length = 0;
  }
```

Save and play through until you run out of lives. The game over screen appears with your final score, and R restarts from scratch.

## You built a game

Here's everything your game now does:

- A ship moves left and right at the bottom of the screen
- The player fires lasers with spacebar
- Enemies spawn at the top and fall downward
- Lasers destroy enemies and earn points
- Enemies that reach the bottom cost a life
- The game ends at zero lives, with a final score display and a restart option

Every concept you used — variables, conditionals, loops, functions, arrays — will carry forward to every program you write from here on.

## Where to go next

In the next tutorial we'll introduce **classes**, which let us bundle a thing's data and behaviour together. That's what makes it practical to have different *types* of enemies with different speeds and shapes, weapons with different firing patterns, and much more. The game you've built here will be the foundation for everything that follows.
