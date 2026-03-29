# Functions Are Values

The last few chapters added features to the game: enemies, bosses, sound, saving. This chapter steps back and looks at the language itself. The patterns here — higher-order functions, closures, recursion, and functional array methods — aren't game-specific. They're the foundation of modern JavaScript. The networking and multiplayer chapters ahead use all of them heavily, and understanding them now will make everything that follows easier.

You've been writing functions since Chapter 1. But there's something about them you've been using without naming: **functions are values**, just like numbers and strings.

Look at code you've already written:

```js
window.addEventListener('keydown', function(event) {
  keys[event.key] = true;
});
```

You're passing a function *as an argument* to `addEventListener`. Not calling it — passing it. `addEventListener` stores it and calls it later, when the event happens.

Or:

```js
requestAnimationFrame(loop);
```

`loop` is a function. You're handing it to `requestAnimationFrame`, which calls it before the next frame.

This is the key idea: **a function can be stored in a variable, passed as an argument, and returned from another function** — just like any other value.

## Storing functions in variables

You've written functions with `function name() { ... }`. You can also assign them to variables:

```js
const greet = function(name) {
  return 'Hello, ' + name;
};

console.log(greet('Wolfie'));  // "Hello, Wolfie"
```

`greet` is a variable. Its value happens to be a function. You call it with `()` just like any other function.

## Arrow functions

JavaScript has a shorter syntax for this, called an **arrow function**:

```js
const greet = (name) => {
  return 'Hello, ' + name;
};
```

The `=>` (arrow) replaces the `function` keyword. For single-expression functions, you can make it even shorter:

```js
const greet = (name) => 'Hello, ' + name;
```

No curly braces, no `return` — the expression's value is returned automatically. You'll see this form constantly in JavaScript.

## Passing functions to functions

A function that accepts another function as an argument is called a **higher-order function**. You've used several:

- `addEventListener(event, callback)` — calls `callback` when the event fires
- `requestAnimationFrame(callback)` — calls `callback` before the next repaint
- `setTimeout(callback, ms)` — calls `callback` after a delay
- `array.map(callback)` — calls `callback` on each element (you used this in Chapter 3)

The pattern is always the same: you hand a function to another function, and the other function decides when and how to call it.

## Template literals

Before we go further, there's a syntax improvement worth introducing now. You've been building strings with `+`:

```js
console.log('Score: ' + score + ' Lives: ' + lives);
```

JavaScript has a cleaner way, called **template literals**. Use backticks (`` ` ``) instead of quotes, and embed expressions with `${}`:

```js
console.log(`Score: ${score} Lives: ${lives}`);
```

The result is identical. Template literals are easier to read, especially when you're combining multiple values. We'll use them throughout the rest of this chapter.

## Try it

Open `main.js` and look at the `keydown` listener. Rewrite the callback as an arrow function:

```js
window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
  // ... rest of the handler
});
```

The behaviour is identical. The syntax is shorter. Use whichever you prefer — both are correct. In this chapter we'll use arrow functions for short callbacks and `function` for longer ones.
