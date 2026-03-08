# Splitting Into Files

In the last chapter, we took messy inline code and organized it into functions. In this chapter, we took loose variables and functions and organized them into classes. There's another level of organization: moving classes into **separate files**.

Right now `main.js` contains three class definitions, six functions, several variables, event listeners, and the game loop. It works, but it's getting long. As we add more classes in the next few steps, it'll only get longer. The solution is the same instinct we've followed all along — group related things together and give them their own space.

## Modules

JavaScript has a built-in system for splitting code across files called **modules**. A module is just a `.js` file that explicitly states what it shares with other files (**exports**) and what it needs from other files (**imports**).

Two keywords make it work:

- **`export`** — marks something in a file as available to the outside. Other files can import it.
- **`import`** — pulls something in from another file so you can use it here.

## A note on file names

We'll use a convention: files that export a class get a **capitalized** name — `Ship.js`, `Enemy.js`, `Blaster.js`. Files that export plain variables or utilities get a **lowercase** name — `game.js`, `main.js`. This is somewhat a matter of taste, but having a convention like this makes it easy to glance at the file list and immediately know which files contain classes and which ones export variables or run the game. Consistency matters more than which specific convention you pick.

## Creating a new file in VS Code

To create a new file, right-click on the `src` folder in the file explorer panel on the left side of VS Code and click **New File**. Type the file name (like `game.js`) and press Enter. The file opens automatically and you can start writing in it.

## Step 1: Create `game.js`

The `canvas` and `ctx` variables are used by almost every class — the ship needs `canvas.width` for clamping, enemies need it for bounds checking, and everything uses `ctx` for drawing. Instead of passing these around as parameters, we'll put them in a shared file that any other file can import from.

Create a new file `src/game.js`:

```js
export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');
```

The `export` keyword in front of each `const` makes these values available to any file that asks for them.

## Step 2: Create `Ship.js`

Create a new file `src/Ship.js`. Cut the entire `Ship` class out of `main.js` and paste it here, then add the import line at the top and `export default` in front of `class Ship`:

```js
import { canvas, ctx } from './game.js';

export default class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 60;
    this.speed = 5;
  }

  update(keys) {
    if (keys['ArrowLeft'])  { this.x = this.x - this.speed; }
    if (keys['ArrowRight']) { this.x = this.x + this.speed; }

    if (this.x < 15)                { this.x = 15; }
    if (this.x > canvas.width - 15) { this.x = canvas.width - 15; }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 15);
    ctx.lineTo(15, 15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
```

Let's break down the new lines:

- **`import { canvas, ctx } from './game.js'`** — pulls in `canvas` and `ctx` from the file we just created. The `./` means "in the same folder." The curly braces `{ }` are used because `game.js` exported them by name.
- **`export default class Ship`** — exports the Ship class as the **default export** of this file. A default export is the main thing a file provides. When another file imports it, it doesn't need curly braces.

## Step 3: Create `Blaster.js`

Create `src/Blaster.js`. Cut the `Blaster` class out of `main.js` and paste it here:

```js
import { ctx } from './game.js';

export default class Blaster {
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

Blaster only needs `ctx` for drawing — it doesn't check canvas bounds because `isOffScreen()` just compares `y` against `0`.

## Step 4: Create `Enemy.js`

Create `src/Enemy.js`. Cut the `Enemy` class out of `main.js` and paste it here:

```js
import { canvas, ctx } from './game.js';

export default class Enemy {
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

## Step 5: Update `main.js`

Now update `main.js` to import everything. Replace the two lines at the very top:

```js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
```

With these imports:

```js
import { canvas, ctx } from './game.js';
import Ship from './Ship.js';
import Blaster from './Blaster.js';
import Enemy from './Enemy.js';
```

The three class definitions should already be gone (you cut them out). What's left in `main.js` is the game logic: creating objects, event listeners, the game functions, and the loop.

Save all files and test. The game should work exactly as before.

## Named exports vs default exports

You've seen two styles:

- **Named exports** use `export const` or `export function` and are imported with curly braces: `import { canvas, ctx } from './game.js'`. A file can have as many named exports as it wants.
- **Default exports** use `export default` and are imported without curly braces: `import Ship from './Ship.js'`. A file can only have one default export — it's the "main thing" the file provides.

For files that contain a single class, `export default` is a natural fit. For files that share several related values (like `game.js`), named exports make more sense.

## Why bother?

Right now this might feel like shuffling code around for no reason. But look at what you've gained:

- **`main.js`** is now focused purely on game logic — setting up the game, handling events, running the loop.
- **Each class file** is self-contained. You can open `Enemy.js` and see everything about how enemies work without scrolling past ship drawing code and collision detection.
- **Adding new classes** means creating a new file and adding one import line. The rest of the game doesn't change.

In the next step, we'll prove that last point by adding two new enemy types — each in its own file.
