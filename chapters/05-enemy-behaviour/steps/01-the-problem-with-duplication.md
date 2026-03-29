# The Problem with Duplication

Open `Enemy.js`, `FastEnemy.js`, and `TankEnemy.js` side by side. Compare them.

The `update()` method in all three:

```js
update() {
  this.y = this.y + this.speed;
}
```

Identical. The `hit()` method:

```js
hit() {
  this.hp = this.hp - 1;
  return this.hp <= 0;
}
```

Identical. `isOffScreen()` is nearly the same too — the only difference is that `Enemy.js` uses `canvas.height + 20` while the other two use `620`, and those mean the same thing.

The only method that actually differs between them is `draw()` — different shapes, colours, and scales. Everything else is copy-pasted.

## Why this matters

Right now the duplication is annoying but manageable. Three files, three copies. But think forward:

- In this chapter we're going to add **four or five new enemy types**. Each one needs `update()`, `hit()`, and `isOffScreen()`.
- What if you want to change how `hit()` works — say, adding a damage flash? You'd need to change it in every enemy file.
- What if you forget one? Now enemies behave inconsistently and the bug is hard to find.

In Chapter 2 we solved this kind of problem by extracting shared code into functions. But the shared code here isn't just a function — it's a whole set of properties and methods that define what it means to be an enemy. What we need is a way to say "here's the default enemy behaviour — individual enemy types only specify what's different."

That's exactly what **inheritance** gives you.
