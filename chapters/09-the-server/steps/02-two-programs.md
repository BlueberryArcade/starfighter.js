# Two Programs

Let's prove that two separate programs can run at the same time. We'll write two tiny scripts and run them in separate terminals.

## Program A

In VS Code, open `projects/chat/server.js` and replace it with:

```js
console.log('Hello from the server.');
console.log('I am running in Node.js, outside the browser.');
```

In your first terminal, navigate to the project root and run it:

```
node projects/chat/server.js
```

You should see:

```
Hello from the server.
I am running in Node.js, outside the browser.
```

The program runs, prints, and exits. That's Node.js running JavaScript — the same language you've been writing, but in a completely different environment. No canvas, no browser, no `document`. Just text in a terminal.

## Program B

Now look at the right panel of the app. It's showing a blank page — that's `projects/chat/index.html` with an empty `src/client.js`. Open `src/client.js` and add:

```js
console.log('Hello from the client.');
console.log('I am running in the browser, inside Electron.');
```

Save. The console panel at the bottom of the right panel shows the messages.

## Two programs, one language

These are **two separate programs**:

- **The server** (`server.js`) runs in Node.js, in the terminal. It has access to the file system, the network, and system resources. It has no access to the browser, the DOM, or the canvas.
- **The client** (`client.js`) runs in the browser (inside Electron). It has access to the DOM, the canvas, and browser APIs. It has no access to the file system or the terminal.

They don't share variables. They don't share memory. They can't call each other's functions. Right now, they have no way to communicate at all.

The entire point of this chapter is to give them a way to talk to each other.

## A server that keeps running

Replace `server.js` with a program that stays alive:

```js
import { createServer } from 'http';

const server = createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello from the server!');
});

server.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
```

Run it in the terminal:

```
node projects/chat/server.js
```

This time the program doesn't exit — it keeps running, waiting for connections. Open a second terminal tab and run:

```
curl http://localhost:4000
```

You should see `Hello from the server!` printed in the second terminal. The browser sent a request, the server responded.

This is the foundation of every website: a client asks, a server answers. The conversation uses **HTTP** — a protocol (a set of rules) for how the request and response are structured.

Press `Ctrl+C` in the first terminal to stop the server.
