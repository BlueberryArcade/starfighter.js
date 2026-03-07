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
const TUTORIALS_DIR = path.join(ROOT_DIR, 'tutorials');

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
let currentTutorialSlug = null;

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

function openDevTools() {
  if (rightView && !rightView.webContents.isDevToolsOpened()) {
    rightView.webContents.openDevTools({ mode: 'undocked' });
  }
}

function startBrowserSync(tutorialDir) {
  const launch = () => {
    bsInstance = bs.create();
    bsInstance.init(
      {
        server: tutorialDir,
        port: BS_PORT,
        open: false,
        notify: false,
        ui: false,
        logLevel: 'silent'
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
  watcher.on('all', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function openInVSCode(dir) {
  spawn('code', [dir], { cwd: ROOT_DIR });
}

function navigateToTutorial(tutorialSlug) {
  if (tutorialSlug === currentTutorialSlug) return;
  const tutorialDir = path.join(TUTORIALS_DIR, tutorialSlug);
  const srcDir = path.join(tutorialDir, 'src');

  currentTutorialSlug = tutorialSlug;
  startBrowserSync(tutorialDir);
  watchSrc(srcDir);
  openInVSCode(srcDir);
}

app.whenReady().then(() => {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BaseWindow({
    title: APP_NAME,
    width: Math.round(width * 0.95),
    height: 800
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

  // Auto-open devtools for the right panel; reopen if closed
  rightView.webContents.on('did-finish-load', openDevTools);
  rightView.webContents.on('devtools-closed', openDevTools);

  // Start browser-sync for the first tutorial on launch
  const tutorialDirs = fs.existsSync(TUTORIALS_DIR)
    ? fs
        .readdirSync(TUTORIALS_DIR, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

  if (tutorialDirs.length > 0) {
    const firstSlug = tutorialDirs[0];
    const tutorialDir = path.join(TUTORIALS_DIR, firstSlug);
    const srcDir = path.join(tutorialDir, 'src');
    currentTutorialSlug = firstSlug;
    startBrowserSync(tutorialDir);
    watchSrc(srcDir);
    // VS Code opened when left panel sends tutorial:navigate on mount
  }

  // Tutorial navigation from left panel (only acts if slug changed)
  ipcMain.on('tutorial:navigate', (_event, data) => {
    const { tutorialSlug } = JSON.parse(data);
    navigateToTutorial(tutorialSlug);
  });

  // Re-open VS Code for the current tutorial without restarting browser-sync
  ipcMain.on('tutorial:edit', () => {
    if (currentTutorialSlug) {
      openInVSCode(path.join(TUTORIALS_DIR, currentTutorialSlug, 'src'));
    }
  });

  mainWindow.on('resize', setLayout);

  mainWindow.on('focus', () => {
    globalShortcut.register('CommandOrControl+R', () => {
      if (rightView) rightView.webContents.reload();
    });
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
