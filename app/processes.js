import ProcessLauncher from 'lib/ProcessLauncher';
import sleep from 'lib/sleep';

const list = [];
const index = {};

function registerProcess(name, config) {
  index[name] = new ProcessLauncher({ name, ...config });
  list.push(name);
}

async function register(options = {}) {
  registerProcess('server', {
    cmd: 'npm run dev',
    cwd: '.',
    waitFor: 'localhost:3000'
  });

  if (options.useElectron) {
    registerProcess('electron', {
      cmd: 'npm run electron:dev',
      cwd: '.'
    });
  }
}

async function startAll() {
  for (const name of list) {
    index[name].launch();
    await sleep(500);
  }
}

async function stopAll() {
  const shutdownList = Object.values(index).reverse();
  for (const launcher of shutdownList) {
    if (launcher.running) {
      launcher.close();
      await sleep(10);
    }
  }
}

function get(name) {
  return index[name];
}

function printStatus() {
  Object.values(index).forEach((launcher) => launcher.printStatus());
}

function printing() {
  return Object.values(index).some((launcher) => launcher.echoOn);
}

function hideAll() {
  Object.values(index).forEach((launcher) => {
    launcher.echoOn = false;
  });
}

export default { register, startAll, stopAll, get, printing, printStatus, hideAll };
