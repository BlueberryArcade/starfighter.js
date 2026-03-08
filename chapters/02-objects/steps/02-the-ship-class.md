# The Ship Class

Right now, the ship's data is scattered across loose variables — `shipX`, `shipY`, `speed` — and its behaviour is split between inline code in `loop()` and a standalone `drawShip()` function. A class lets us put all of that in one place.

## What is a class?

A class is a blueprint for making objects. It defines what data an object starts with and what it can do. Here's the simplest possible class:

```js
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    console.log(this.name + ' says woof!');
  }
}

const myDog = new Dog('Wolfie');
myDog.bark();  // "Wolfie says woof!"
```

Three things to notice:

- **`constructor()`** is a special method that runs once when you create a new object with `new Dog(...)`. It sets up the object's starting data.
- **`this`** refers to the specific object being created or used. When you write `this.name = name`, you're saying "store this value on *this particular* dog." When `bark()` reads `this.name`, it gets the name that belongs to whichever dog called it.
- **Methods** like `bark()` are functions that live inside the class. Every dog created from this blueprint gets its own `name`, but they all share the same `bark()` behaviour.

## Building the Ship class

Add this class **above** all the existing functions in `main.js`, but below the `canvas` and `ctx` lines:

```js
class Ship {
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

This is the same movement, clamping, and drawing code from before — just reorganized so the ship *owns* it.

## Create an instance

Right after the class definition, create the ship object:

```js
const ship = new Ship();
```

`new Ship()` calls the constructor, which sets up `this.x`, `this.y`, and `this.speed`. The result is an object stored in `ship` that carries its own data and knows how to update and draw itself.

## Remove the old code

Now delete the loose variables that the class replaces:

```js
// Delete these lines:
let shipX = canvas.width / 2;
let shipY = canvas.height - 60;
```

And delete the standalone `drawShip()` function — that logic now lives inside the class.

## Update `loop()`

In `loop()`, replace the inline movement, clamping, and draw call:

```js
  // Delete this block:
  const speed = 5;
  if (keys['ArrowLeft'])  { shipX = shipX - speed; }
  if (keys['ArrowRight']) { shipX = shipX + speed; }
  if (shipX < 15)                { shipX = 15; }
  if (shipX > canvas.width - 15) { shipX = canvas.width - 15; }

  drawShip();
```

And replace it with:

```js
  ship.update(keys);
  ship.draw();
```

Two lines instead of seven. The ship handles its own details.

## Update references to `shipX` and `shipY`

The rest of the code still references `shipX` and `shipY`. Find and replace them with `ship.x` and `ship.y`. There are three places:

1. **The keydown listener** — where a laser is created:
   ```js
   lasers.push({ x: ship.x, y: ship.y - 20 });
   ```

2. **The restart block** inside the keydown listener:
   ```js
   ship.x = canvas.width / 2;
   ```

Save and run. The game should play exactly the same as before. The ship still moves, still fires, still stays on screen — but now all of its state and behaviour live in one self-contained class.

In the next step, we'll do the same thing for lasers.
