# Async and Await

The server and client code so far is entirely event-driven — register a handler, wait for it to fire. But there's another pattern for asynchronous code that you'll see everywhere in JavaScript: **async/await**.

## The problem

Some operations take time: connecting to a server, reading a file, fetching data from a URL. JavaScript doesn't stop and wait — it keeps running the next line. This is why we use event handlers: "call this function *when* the data arrives."

But event handlers can get messy when you need to do things in sequence:

```js
// Connect, then join, then send a message — hard to read as nested callbacks.
socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'join', name: 'Player' }));
  // ... now wait for the join confirmation before sending a chat?
});
```

## Promises

A **Promise** is an object that represents a value that doesn't exist yet but will in the future. Think of it as a receipt: "I owe you one result, eventually."

```js
const promise = fetch('http://localhost:4000/status');
// promise is not the data — it's a promise that data will come.
```

You can attach a handler with `.then()`:

```js
fetch('http://localhost:4000/status')
  .then((response) => response.json())
  .then((data) => {
    console.log(data.status);
  });
```

This works, but chains of `.then()` are hard to read. That's where `async/await` comes in.

## async/await

`async` and `await` let you write asynchronous code that *looks* synchronous:

```js
async function checkStatus() {
  const response = await fetch('http://localhost:4000/status');
  const data = await response.json();
  console.log(data.status);
}
```

- **`async`** before a function means it returns a Promise.
- **`await`** before an expression means "pause here until this Promise resolves, then give me the value."

The code reads top to bottom, like normal code. But `await` doesn't freeze the entire program — only the current function pauses. Other event handlers and the rest of the app keep running.

## Using it in the client

Let's wrap the WebSocket connection in a Promise. Add this to `src/client.js`:

```js
function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => resolve(socket));
    socket.addEventListener('error', (err) => reject(err));
  });
}
```

`connect` returns a Promise. When the WebSocket opens, the Promise resolves with the socket. If there's an error, it rejects.

Now you can use it with `await`:

```js
async function main() {
  try {
    const socket = await connect('ws://localhost:4000');
    console.log('status', 'Connected');

    socket.send(JSON.stringify({ type: 'join', name: 'Player' }));

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'chat') {
        console.log(message.name, message.text);
      }
      if (message.type === 'system') {
        console.log('system', message.text);
      }
      if (message.type === 'users') {
        console.log('online', message.names.join(', '));
      }
    });

    socket.addEventListener('close', () => {
      console.log('status', 'Disconnected');
    });
  } catch (err) {
    console.log('status', 'Failed to connect');
  }
}

main();
```

The `try/catch` handles connection failures — if the server isn't running, `await connect(...)` throws, and the `catch` block runs. This is the same `try/catch` from the server's JSON parsing, now applied to an async operation.

## Why this matters

Most real-world JavaScript is asynchronous: fetching APIs, reading databases, loading images, waiting for user input. `async/await` is how modern JavaScript handles all of it. The event-driven WebSocket handlers you wrote earlier are still valid — `await` doesn't replace events. But for operations that have a clear start and finish (connect, fetch, load), `async/await` makes the code dramatically easier to read.

In the next chapter, we'll build a real chat UI on top of this foundation — the server, the protocol, and the client connection are all in place.
