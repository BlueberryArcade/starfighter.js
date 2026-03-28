# Your Game

Welcome to a new kind of chapter. The first three chapters walked you through building a game step by step — fundamentals, then objects, then drawing tools. Now it's time to bring it all together and make the game **yours**.

Look at the right panel. The game from Chapter 2 is already running — ship, enemies, power-ups, everything. But this isn't the Chapter 2 folder. This is a fresh copy in its own directory that you'll modify from here on. Think of it as your personal fork.

## What's here

Open VS Code and look at the files. You'll recognize them all from Chapter 2:

- `game.js` — shared canvas and context
- `Ship.js` — your ship class
- `Enemy.js`, `FastEnemy.js`, `TankEnemy.js` — three enemy types
- `Blaster.js`, `SprayParticle.js`, `Detonator.js`, `Fragment.js` — projectiles
- `PowerUp.js` — collectible weapon upgrades
- `main.js` — game loop and logic

Play the game for a minute. Confirm everything works. This is your starting point — every change from here forward is yours to keep.

## What we're doing

Over the next several steps, you're going to replace the placeholder triangle graphics with the custom shapes you drew in Chapter 3. You'll tune collision detection to fit your new shapes, add outlines and engine flames, and customize the projectiles. By the end, the game will look and feel like something you designed — not just something you followed instructions to build.

Let's start with the ship.
