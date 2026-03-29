# HTML Basics

Every page you've worked with has had an `index.html` file. You've seen it, but you've never needed to change it — the game was all canvas, and the HTML was just scaffolding. Now you're building a chat interface, and that means working with HTML directly.

## What HTML is

HTML (HyperText Markup Language) is the language that describes the structure of a web page. It's made of **elements**, written as **tags**:

```html
<p>Hello, world!</p>
```

`<p>` is the opening tag. `</p>` is the closing tag. The text between them is the **content**. Together, they form a paragraph element.

Elements can be **nested** — an element inside an element:

```html
<div>
  <p>First paragraph</p>
  <p>Second paragraph</p>
</div>
```

`<div>` is a generic container — it groups other elements. Think of it like a box. The two `<p>` elements are inside the box.

## Common elements

| Tag | Purpose |
|-----|---------|
| `<div>` | A generic container (box) |
| `<p>` | A paragraph of text |
| `<h1>` | A heading (h1 is the largest, h6 is the smallest) |
| `<input>` | A text field the user can type in |
| `<button>` | A clickable button |
| `<span>` | Inline text (for styling part of a line) |

## Attributes

Tags can have **attributes** — extra information attached to the element:

```html
<input id="input" type="text" placeholder="Type here..." />
```

- `id="input"` — a unique name for this element (used to find it from JavaScript)
- `type="text"` — tells the browser this is a text field
- `placeholder="Type here..."` — grey hint text shown when the field is empty

`<input />` is self-closing — it has no content between an opening and closing tag.

## Build the chat layout

Open `projects/chat/index.html` and replace the `<body>` contents:

```html
<body>
  <div id="app">
    <div id="messages"></div>
    <div id="input-bar">
      <input id="input" type="text" placeholder="Type a message..." />
      <button id="send">Send</button>
    </div>
  </div>

  <script type="module" src="src/client.js"></script>
  <script src="/browser-sync/browser-sync-client.js"></script>
</body>
```

Add styles inside the `<head>`, after the existing `<style>` block or replacing it:

```html
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a1a;
    color: #e0e0e0;
    font-family: monospace;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
  #input-bar {
    display: flex;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: 8px;
    gap: 8px;
  }
  #input {
    flex: 1;
    background: #1a1a2e;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 4px;
    color: #e0e0e0;
    font-family: monospace;
    font-size: 14px;
    padding: 8px 10px;
    outline: none;
  }
  #input:focus {
    border-color: rgba(100,180,255,0.5);
  }
  #send {
    background: #3d5afe;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: monospace;
    font-size: 14px;
    cursor: pointer;
  }
  #send:hover {
    background: #536dfe;
  }
</style>
```

Save. The right panel shows a dark chat interface: a scrollable message area and an input bar at the bottom with a blue Send button. It doesn't do anything yet — that's the next step.

## What just happened

You wrote HTML — elements that the browser turns into visible UI. The `<style>` block tells the browser how to display them: sizes, colours, spacing, layout. The `<script>` tag loads your JavaScript, which is where the behaviour will live.

This is the same structure the game uses. The difference: the game draws everything on a `<canvas>` element using JavaScript. The chat uses actual HTML elements that the browser lays out and renders for you. Both approaches work. Canvas gives you full control over every pixel. HTML elements give you built-in features — text wrapping, scrolling, input fields — for free.
