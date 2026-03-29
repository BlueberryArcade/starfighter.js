# Why Pong

We're about to make the game multiplayer — two real humans playing together. But multiplayer is complex on its own: shared input, synchronized state, network communication, fairness. Piling that onto Starfighter's dozens of entities, projectiles, and enemy types would make it impossible to tell whether a bug is in the networking or in the game logic.

So we're starting with the simplest possible two-player game: **Pong**. Two paddles, one ball, a score. Three moving objects. Two inputs. No enemies, no power-ups, no waves.

The plan:
1. **This chapter** — build Pong with two players on one keyboard
2. **Next chapter** — add networking so two players can play from different computers
3. **Then** — bring the networking patterns back to Starfighter

This isn't a step backward. It's the same approach we've used throughout: isolate the new concept, build it in a simple context, then apply it where it matters.

## Set up

Look at the right panel — a blank canvas, just like Chapter 3. Open `src/main.js` in VS Code. It has the canvas and context ready:

```js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
```

You're going to build this entire game from scratch. No starter code, no copying from examples. You have 10 chapters of experience — use it.
