# The Terminal

Until now, everything you've written runs inside the app — you save a file, the right panel updates. But this chapter introduces something new: a program you run yourself, in its own window, outside the app.

That means using the **terminal**.

## What is the terminal?

The terminal is a text-based interface to your computer. Instead of clicking icons and opening windows, you type commands and press Enter. It looks intimidating at first — a blank screen with a blinking cursor — but it only does what you tell it to.

You've actually been using one already. When you started this tutorial, someone ran `./start` in a terminal. That command launched the Electron app and the dev server. Both are programs running inside that terminal window.

## Opening a terminal

- **On Mac**: Open the Terminal app (search for "Terminal" in Spotlight), or in VS Code press `Ctrl+\`` (backtick) to open the built-in terminal.
- **On Windows**: Open "Terminal" or "PowerShell" from the Start menu, or use VS Code's built-in terminal.
- **On Linux**: You probably already know.

VS Code's built-in terminal is the easiest option because it opens in the project directory automatically.

## Your first commands

Type each of these and press Enter:

```
pwd
```

This prints the **present working directory** — the folder the terminal is currently in. It should show the path to this project.

```
ls
```

This **lists** the files in the current directory. You should see `chapters/`, `games/`, `projects/`, `package.json`, and the other files you've been working with.

```
node --version
```

This runs **Node.js** and asks it to print its version number. Node is the program that runs JavaScript outside the browser. Your game code runs in the browser's JavaScript engine. Node is a different JavaScript engine — same language, different environment.

## Two terminals

For this chapter, you'll need **two terminal windows** (or two tabs in VS Code's terminal — click the `+` icon to add one). One will run the server you're about to build. The other stays free for running other commands.

Get both open now. In the next step, we'll write a program and run it.
