# User List

The server broadcasts a `users` message with the list of connected names whenever someone joins or leaves. Let's display it.

## Add the sidebar HTML

In `index.html`, update the `#app` div to include a sidebar. Wrap the messages and input in a main area:

```html
<div id="app">
  <div id="name-overlay">
    <!-- ... name prompt (unchanged) ... -->
  </div>
  <div id="main">
    <div id="messages"></div>
    <div id="input-bar">
      <input id="input" type="text" placeholder="Type a message..." />
      <button id="send">Send</button>
    </div>
  </div>
  <div id="sidebar">
    <div id="sidebar-title">Online</div>
    <div id="user-list"></div>
  </div>
</div>
```

Update the styles. Replace the `#app` style and add the new ones:

```css
#app {
  display: flex;
  height: 100%;
}
#main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
#sidebar {
  width: 140px;
  border-left: 1px solid rgba(255,255,255,0.1);
  padding: 12px;
  flex-shrink: 0;
}
#sidebar-title {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.user-name {
  padding: 3px 0;
  font-size: 13px;
  color: #a0aacc;
}
```

## Update the JavaScript

In `client.js`, grab the user list element:

```js
const userList = document.getElementById('user-list');
```

Add a function to rebuild the list:

```js
function updateUserList(names) {
  userList.innerHTML = '';

  for (let i = 0; i < names.length; i++) {
    const row = document.createElement('div');
    row.className = 'user-name';
    row.textContent = names[i];
    userList.appendChild(row);
  }
}
```

**`userList.innerHTML = ''`** clears all children from the element — a clean slate before rebuilding. This is the "clear and redraw" pattern from the game loop, applied to the DOM: clear the container, recreate every item from scratch.

Add the handler in the `message` listener:

```js
    if (message.type === 'users') {
      updateUserList(message.names);
      console.log('online', message.names.join(', '));
    }
```

Save and restart the server. Connect with a name. The sidebar shows your name under "Online." Open a second tab with a different name — both names appear in both tabs. Close one tab — it disappears from the list.

## Try it

- Connect three tabs with different names. The sidebar updates in all three simultaneously.
- Style the current user's name differently: check if `names[i] === myName` and add a different class.
