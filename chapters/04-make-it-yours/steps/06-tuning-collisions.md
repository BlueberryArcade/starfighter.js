# Tuning Collisions

With debug mode on, you can see exactly where collisions register. Now adjust the numbers until the circles hug the shapes.

## Enemy radius

Open `Enemy.js`. The constructor sets `this.radius = 20`. That was tuned for a triangle 30 pixels wide. Your shape is different — look at the debug circle and decide:

- If the circle is bigger than the shape, **decrease** `this.radius`.
- If the circle is smaller, **increase** it.

A good rule of thumb: the radius should roughly match the distance from the centre of the shape to its outermost point. If your shape uses `ENEMY_SCALE = 5` and the widest point is at `x = 4`, the furthest pixel is about `4 * 5 = 20` — so `radius = 20` might still be right. But if your shape is narrower or wider, adjust accordingly.

Do the same for `FastEnemy.js` (currently `radius = 12`) and `TankEnemy.js` (currently `radius = 28`).

## Ship collision radius

The ship's collision is checked in two places in `main.js`:

1. **Power-up collection** — `distance < powerups[i].radius + 15`. That `15` is the ship's effective radius.
2. The debug circle you added in the last step also uses `15`.

If your ship is wider or narrower than the original, update both to match.

## Testing

With debug mode on, play through a few waves:

- Fire at enemies. Do hits register when the projectile visually touches the shape?
- Fly into a power-up. Does collection feel right?
- Let an enemy pass through — does it still get removed at the bottom?

Adjust and re-test until it feels fair. Collision detection doesn't need to be pixel-perfect — a slight generosity (circle slightly bigger than the shape) makes the game feel better. Slightly too tight and the player feels cheated.

## When you're done

Press `d` to turn off debug mode. The circles disappear, but the tuned values stay. You can always press `d` again later if something feels off.
