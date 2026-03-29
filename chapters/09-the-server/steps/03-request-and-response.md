# Request and Response

The server from the last step responds to every request with the same text. Let's make it smarter — different URLs return different content.

## Routes

Replace `server.js`:

```js
import { createServer } from 'http';

const server = createServer((request, response) => {
  console.log(request.method + ' ' + request.url);

  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('<h1>Welcome</h1><p>This is the home page.</p>');
  } else if (request.url === '/status') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok', time: Date.now() }));
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
  }
});

server.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
```

Run it: `node projects/chat/server.js`

In your second terminal, try both URLs:

```
curl http://localhost:4000/
curl http://localhost:4000/status
curl http://localhost:4000/anything-else
```

The first returns HTML. The second returns JSON. The third returns "Not found" with a 404 status code. Each time, the server's terminal logs the request: `GET /`, `GET /status`, `GET /anything-else`.

## What's happening

Every time a browser (or `curl`) contacts the server, an HTTP **request** arrives. The request has:

- A **method** — `GET` means "give me something." (There are others, like `POST` for sending data.)
- A **URL** — the path the client is asking for.

The server reads the URL, decides what to do, and sends a **response** with:

- A **status code** — `200` means success, `404` means not found.
- A **content type** — tells the client what kind of data to expect.
- A **body** — the actual content.

This request/response cycle is how every website works. When you visit a URL in your browser, the browser sends a `GET` request and the server sends back HTML. The SvelteKit tutorial panel on the left side of this app works exactly this way.

## JSON responses

The `/status` route returns JSON:

```json
{"status":"ok","time":1711650000000}
```

This is exactly the same JSON format you used in Chapter 8 for saving scores to `localStorage`. The difference is that now it's being sent *over the network* from one program to another. JSON is the standard format for programs to exchange structured data.

## The limitation

Notice that the server can only respond — it can never initiate. The client asks, the server answers. If the server has something to say, it has to wait until the client asks.

For a high-score leaderboard, that's fine. For a chat app or a multiplayer game, it's not — you need the server to push messages to clients the instant they arrive. That requires a different kind of connection.

Press `Ctrl+C` to stop the server.
