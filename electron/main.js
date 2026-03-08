import { app, BaseWindow, WebContentsView, ipcMain, globalShortcut, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';
import chokidar from 'chokidar';
import { createRequire } from 'module';

const bs = createRequire(import.meta.url)('browser-sync');

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const CHAPTERS_DIR = path.join(ROOT_DIR, 'chapters');

const APP_NAME = 'Starfighter.js';
app.name = APP_NAME;
app.setAboutPanelOptions({ applicationName: APP_NAME });

const LEFT_URL = 'http://localhost:3000';
const BS_PORT = 3001;

let mainWindow;
let leftView;
let rightView;
let bsInstance = null;
let watcher = null;
let currentChapterSlug = null;
let consoleMsgQueue = [];
let consolePanelReady = false;
let lastGameError = null; // persists so leftView can receive it after hydration

// Ensure only a single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function setLayout() {
  if (!mainWindow || !leftView || !rightView) return;
  // getContentBounds excludes the title bar — child view coords are within the content area
  const { width, height } = mainWindow.getContentBounds();
  const leftWidth = Math.round(width * 0.35);
  leftView.setBounds({ x: 0, y: 0, width: leftWidth, height });
  rightView.setBounds({ x: leftWidth, y: 0, width: width - leftWidth, height });
}

function injectFocusOverlay() {
  if (!rightView) return;
  rightView.webContents
    .executeJavaScript(`
      (function () {
        // Remove any overlay left over from a previous injection (e.g. after
        // browser-sync reloads the page when the student saves a file).
        var existing = document.getElementById('_sf_overlay');
        if (existing) existing.remove();

        // --- Focus overlay (z-index: 9999, always on top) ---
        var overlay = document.createElement('div');
        overlay.id = '_sf_overlay';
        overlay.style.cssText = [
          'position:fixed', 'inset:0', 'z-index:9999',
          'background:rgba(0,0,0,0.55)',
          'display:flex', 'flex-direction:column',
          'align-items:center', 'justify-content:center',
          'cursor:pointer', 'font-family:monospace'
        ].join(';');

        var box = document.createElement('div');
        box.style.cssText = [
          'color:#fff', 'text-align:center',
          'padding:1.25rem 2rem',
          'background:rgba(0,0,0,0.6)',
          'border:1px solid rgba(255,255,255,0.18)',
          'border-radius:10px', 'user-select:none'
        ].join(';');
        box.innerHTML =
          '<div style="font-size:1rem;opacity:0.7;margin-bottom:0.4rem">GAME PAUSED</div>' +
          '<div style="font-size:1.2rem;font-weight:bold">Click to play</div>';
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        function show() { overlay.style.display = 'flex'; }
        function hide() { overlay.style.display = 'none'; }

        overlay.addEventListener('click', hide);
        window.addEventListener('focus', hide);
        window.addEventListener('blur', show);

        if (document.hasFocus()) hide();
      })();
    `)
    .catch(() => {});
}

// Push a single message into the in-page console panel.
function pushConsoleMsg(level, message, sourceId, line) {
  if (!rightView) return;
  rightView.webContents
    .executeJavaScript(
      `window._sf_addEntry && window._sf_addEntry(${JSON.stringify(level)}, ${JSON.stringify(message)}, ${JSON.stringify(sourceId ?? null)}, ${JSON.stringify(line ?? null)})`
    )
    .catch(() => {});
}

// Inject the console panel DOM into the game page, then replay any messages
// that arrived before the panel was ready (e.g. syntax errors at parse time).
function injectConsolePanel() {
  if (!rightView) return;
  consolePanelReady = false;
  rightView.webContents
    .executeJavaScript(`
      (function () {
        if (window._sf_console) return;

        // --- Panel container ---
        var panel = document.createElement('div');
        panel.id = '_sf_console';
        panel.style.cssText = [
          'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:9998',
          'background:rgba(10,10,20,0.93)',
          'border-top:1px solid rgba(255,255,255,0.12)',
          'font-family:monospace', 'font-size:12px',
          'display:none'
        ].join(';');

        // --- Header row ---
        var header = document.createElement('div');
        header.style.cssText = [
          'display:flex', 'justify-content:space-between', 'align-items:center',
          'padding:3px 8px',
          'border-bottom:1px solid rgba(255,255,255,0.08)',
          'color:rgba(255,255,255,0.45)', 'font-size:11px', 'user-select:none'
        ].join(';');
        header.appendChild(Object.assign(document.createElement('span'), { textContent: 'CONSOLE' }));

        var closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = [
          'background:none', 'border:none', 'color:rgba(255,255,255,0.35)',
          'cursor:pointer', 'font-size:13px', 'padding:0 2px', 'line-height:1'
        ].join(';');
        header.appendChild(closeBtn);

        // --- Scrollable log area ---
        var logArea = document.createElement('div');
        logArea.style.cssText = [
          'max-height:150px', 'overflow-y:auto', 'padding:4px 8px'
        ].join(';');

        panel.appendChild(header);
        panel.appendChild(logArea);
        document.body.appendChild(panel);

        var colors = { log: 'rgba(255,255,255,0.82)', warn: '#ffd700', error: '#ff5c5c' };

        function addEntry(level, message, sourceId, line) {
          var row = document.createElement('div');
          row.style.cssText = [
            'display:flex', 'align-items:baseline', 'gap:8px',
            'padding:2px 0', 'border-bottom:1px solid rgba(255,255,255,0.04)'
          ].join(';');

          var text = document.createElement('span');
          text.style.cssText = [
            'color:' + (colors[level] || colors.log),
            'white-space:pre-wrap', 'word-break:break-all', 'flex:1'
          ].join(';');
          text.textContent = message;
          row.appendChild(text);

          // If a source location was provided, make the whole row clickable
          // and show a filename:line badge on the right.
          if (sourceId && line) {
            var filename = sourceId.split('/').pop();
            var loc = document.createElement('span');
            loc.textContent = filename + ':' + line;
            loc.title = 'Open in editor';
            loc.style.cssText = [
              'color:rgba(100,180,255,0.65)',
              'white-space:nowrap', 'flex-shrink:0',
              'font-size:11px', 'text-decoration:underline'
            ].join(';');
            row.appendChild(loc);

            row.style.cursor = 'pointer';
            row.addEventListener('click', function () {
              if (window.electronAPI && window.electronAPI.openInEditor) {
                window.electronAPI.openInEditor(sourceId, line);
              }
            });
            row.addEventListener('mouseover', function () {
              text.style.textDecoration = 'underline';
            });
            row.addEventListener('mouseout', function () {
              text.style.textDecoration = '';
            });
          }

          logArea.appendChild(row);
          logArea.scrollTop = logArea.scrollHeight;
          panel.style.display = 'block';
        }

        closeBtn.addEventListener('click', function () {
          panel.style.display = 'none';
        });

        // Expose so the main process can push messages in via executeJavaScript.
        window._sf_console = true;
        window._sf_addEntry = addEntry;
      })();
    `)
    .then(() => {
      consolePanelReady = true;
      // Replay messages that arrived before the panel was ready (e.g. syntax errors).
      const queued = consoleMsgQueue.splice(0);
      queued.forEach((m) => pushConsoleMsg(m.level, m.message, m.sourceId, m.line));
    })
    .catch(() => {});
}

function startBrowserSync(chapterDir) {
  const launch = () => {
    bsInstance = bs.create();
    bsInstance.init(
      {
        server: chapterDir,
        // Watch all files in the tutorial directory (index.html + src/**)
        // so browser-sync sends a reload signal to the client on any change.
        files: [`${chapterDir}/**/*`],
        port: BS_PORT,
        open: false,
        notify: false,
        ui: false,
        logLevel: 'silent',
        // Disable the inline snippet injection — the client script is included
        // directly in each tutorial's index.html as a plain <script src> tag,
        // which satisfies the strict script-src 'self' CSP.
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
            fn: (_snippet, match) => match
          }
        }
      },
      (err) => {
        if (err) {
          console.error('[browser-sync]', err);
          return;
        }
        if (rightView) {
          rightView.webContents.loadURL(`http://localhost:${BS_PORT}`);
        }
      }
    );
  };

  if (bsInstance && bsInstance.active) {
    bsInstance.exit();
    bsInstance = null;
    // Give the port a moment to release before binding again
    setTimeout(launch, 300);
  } else {
    launch();
  }
}

function watchSrc(srcDir) {
  if (watcher) {
    watcher.close();
    watcher = null;
  }

  if (!fs.existsSync(srcDir)) return;

  watcher = chokidar.watch(srcDir, { ignoreInitial: true });
  watcher.on('all', (_event, filePath) => {
    if (!mainWindow) return;

    // Ignore newly created or empty files — when a student creates a new file
    // in VS Code (e.g. Ship.js), we don't want to yank focus away before
    // they've had a chance to type anything.
    try {
      const stat = fs.statSync(filePath);
      if (stat.size === 0) return;
    } catch {
      // File was deleted or inaccessible — still switch focus so the game
      // reloads without the removed module.
    }

    mainWindow.show();
    mainWindow.focus();
  });
}

function openInVSCode(chapterDir) {
  const mainFile = path.join(chapterDir, 'src', 'main.js');
  spawn('code', [chapterDir, mainFile], { cwd: ROOT_DIR });
}

function navigateToChapter(chapterSlug) {
  if (chapterSlug === currentChapterSlug) return;
  const chapterDir = path.join(CHAPTERS_DIR, chapterSlug);
  const srcDir = path.join(chapterDir, 'src');

  currentChapterSlug = chapterSlug;
  startBrowserSync(chapterDir);
  watchSrc(srcDir);
  openInVSCode(chapterDir);
}

app.whenReady().then(() => {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BaseWindow({
    title: APP_NAME,
    width: Math.round(width * 0.95),
    height: 800,
    backgroundColor: '#000'
  });

  leftView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preload-admin.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  rightView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preload-normal.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.contentView.addChildView(leftView);
  mainWindow.contentView.addChildView(rightView);

  leftView.webContents.loadURL(LEFT_URL);

  setLayout();

  // Reset console queue when a new page starts loading so we don't replay
  // stale messages from a previous load into the freshly injected panel.
  // Also clear any error state shown in the tutorial pane.
  rightView.webContents.on('did-start-loading', () => {
    consolePanelReady = false;
    consoleMsgQueue = [];
    lastGameError = null;
    if (leftView) leftView.webContents.send('game:clear-error');
  });

  // Capture ALL console output (including syntax errors at parse time) from
  // the main process side — this fires before did-finish-load, so messages
  // are queued and replayed once the panel DOM is injected.
  rightView.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    // Filter out browser-sync's own client-side chatter.
    if (sourceId && sourceId.includes('browser-sync')) return;
    const levelName = level >= 3 ? 'error' : level >= 2 ? 'warn' : 'log';
    if (!consolePanelReady) {
      consoleMsgQueue.push({ level: levelName, message, sourceId, line });
    } else {
      pushConsoleMsg(levelName, message, sourceId, line);
    }
    // Notify the tutorial pane so the button can change to "Fix in VS Code".
    if (levelName === 'error' && leftView) {
      lastGameError = { message, sourceId: sourceId ?? null, line: line ?? null };
      leftView.webContents.send('game:error', lastGameError);
    }
  });

  // Inject overlays into the game panel on every page load.
  rightView.webContents.on('did-finish-load', () => {
    injectFocusOverlay();
    injectConsolePanel();
  });

  // Renderer signals this once its IPC listeners are registered (after hydration).
  // Replay any error that fired before the listener was ready.
  ipcMain.on('left:ready', () => {
    if (lastGameError && leftView) {
      leftView.webContents.send('game:error', lastGameError);
    }
  });

  // Start browser-sync for the first tutorial on launch
  const chapterDirs = fs.existsSync(CHAPTERS_DIR)
    ? fs
        .readdirSync(CHAPTERS_DIR, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

  if (chapterDirs.length > 0) {
    const firstSlug = chapterDirs[0];
    const chapterDir = path.join(CHAPTERS_DIR, firstSlug);
    const srcDir = path.join(chapterDir, 'src');
    currentChapterSlug = firstSlug;
    startBrowserSync(chapterDir);
    watchSrc(srcDir);
    // VS Code opened when left panel sends tutorial:navigate on mount
  }

  // Tutorial navigation from left panel (only acts if slug changed)
  ipcMain.on('chapter:navigate', (_event, data) => {
    const { chapterSlug } = JSON.parse(data);
    navigateToChapter(chapterSlug);
  });

  // Re-open VS Code for the current tutorial without restarting browser-sync.
  // When data includes { sourceId, line }, jump directly to the error location.
  ipcMain.on('chapter:edit', (_event, data) => {
    if (!currentChapterSlug) return;
    if (data) {
      try {
        const { sourceId, line } = JSON.parse(data);
        if (sourceId && line) {
          let filePath = sourceId;
          const bsOrigin = `http://localhost:${BS_PORT}`;
          if (filePath.startsWith(bsOrigin)) {
            filePath = path.join(CHAPTERS_DIR, currentChapterSlug, filePath.slice(bsOrigin.length));
          }
          spawn('code', ['--goto', `${filePath}:${line}`], { cwd: ROOT_DIR });
          return;
        }
      } catch {
        // fall through to default open
      }
    }
    openInVSCode(path.join(CHAPTERS_DIR, currentChapterSlug));
  });

  // Open a specific file+line in VS Code from the console panel's clickable links.
  ipcMain.on('editor:open', (_event, { sourceId, line }) => {
    if (!sourceId) return;
    // Convert the browser-sync URL (e.g. http://localhost:3001/src/main.js)
    // to an absolute filesystem path for the current tutorial.
    let filePath = sourceId;
    const bsOrigin = `http://localhost:${BS_PORT}`;
    if (filePath.startsWith(bsOrigin) && currentChapterSlug) {
      filePath = path.join(CHAPTERS_DIR, currentChapterSlug, filePath.slice(bsOrigin.length));
    }
    spawn('code', ['--goto', `${filePath}:${line}`], { cwd: ROOT_DIR });
  });

  mainWindow.on('resize', setLayout);

  mainWindow.on('focus', () => {
    globalShortcut.register('CommandOrControl+R', () => {
      if (rightView) rightView.webContents.reload();
    });
    globalShortcut.register('CommandOrControl+Alt+I', () => {
      // Open DevTools for whichever pane currently has focus.
      if (leftView && leftView.webContents.isFocused()) {
        leftView.webContents.toggleDevTools();
      } else if (rightView) {
        rightView.webContents.toggleDevTools();
      }
    });
    // Give keyboard focus to the game panel so input works immediately
    // when the user switches back to the app (e.g. after saving in VS Code).
    if (rightView) rightView.webContents.focus();
  });

  mainWindow.on('blur', () => {
    globalShortcut.unregisterAll();
  });
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (bsInstance && bsInstance.active) bsInstance.exit();
  if (watcher) watcher.close();
  if (process.platform !== 'darwin') app.quit();
  process.exit();
});
