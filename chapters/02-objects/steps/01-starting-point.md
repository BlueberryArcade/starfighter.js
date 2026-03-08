# Starting Point

Welcome back. In the last chapter you built a complete game — a ship that moves, fires lasers, destroys enemies, tracks score and lives, and ends with a game over screen. That's a lot of code, and it works.

But take a look at `main.js` right now. Everything lives in one flat list: variables at the top, functions in the middle, and a game loop at the bottom. The ship's position is stored in `shipX` and `shipY`, but the code that *moves* the ship lives somewhere else. The enemies are plain `{ x, y }` objects in an array, and the code that draws and moves them is in a completely separate function.

This works, but it starts to fall apart as things get more complex. What if you wanted two types of enemies — one fast and one slow? You'd need to add `speed` to each object, then add `if` checks inside `updateEnemies()` to draw them differently. What if enemies could shoot back? Now you're managing even more arrays and even more functions that are spread all over the file.

## The idea behind objects

What if, instead of scattering an enemy's data in one place and its behaviour in another, we could bundle them together? An enemy would *know* its own position, its own speed, and *how to draw itself*. You'd just say "enemy, update yourself" and "enemy, draw yourself" — and each enemy could do it differently.

That's what **classes** give you. A class is a blueprint for creating objects that carry both data (properties) and behaviour (methods) together. You define the blueprint once, then stamp out as many copies as you need — each with its own state.

## What we'll build

Over the next several steps, we'll reorganize this exact game using classes. Nothing about how the game plays will change at first — this is refactoring, same as when we extracted functions in the last chapter. But once the code is organized around objects, adding new features becomes dramatically easier. By the end of this chapter, you'll have multiple enemy types, collectible power-ups, and several weapons — all built on the same pattern.

Let's start with the ship.
