import { spawn } from 'child_process';

function parseCmdStr(cmd) {
  const args = cmd.match(/\s*("[^"]+"|[^\s"]+)/g);
  for (let k in args) {
    args[k] = args[k].trim();
    if (args[k][0] == '"') args[k] = args[k].slice(1, args[k].length - 1);
  }
  return args;
}

function ProcessLauncher({ name, cmd, cwd, echoOn, waitFor }) {
  const self = this;

  // Name of this process launcher as defined on the launchpad
  this.name = name;

  // Store the command
  this.cmd = cmd;

  // Keep a reference to a response object in case the process needs to be restarted
  this.res = null;

  // Working directory to launch from
  this.cwd = cwd;

  // Determines whether or not we generate output for this process
  this.echoOn = echoOn || false;

  // Determines if the process has been launched or not
  this.running = false;

  // Output to wait for
  this.waitFor = waitFor;

  this.obj = new Date().getTime() + Math.round(Math.random() * 10000);
}

const blue = (str) => `\x1b[34m${str}\x1b[0m`;
const red = (str) => `\x1b[31m${str}\x1b[0m`;
const green = (str) => `\x1b[32m${str}\x1b[0m`;

ProcessLauncher.prototype.launch = function () {
  const self = this;

  // Make sure the process isn't already running
  if (this.running) return console.log(red(`${this.name} is already running`));

  // Resolve variables with respect to environment variables
  const cwd = this.cwd;

  // Command string to launch
  let args = parseCmdStr(this.cmd);
  const cmd = args[0];
  args = args.slice(1);

  // We assume the process gets off the ground (if it doesn't, errors will
  // show up in the console)
  this.running = true;

  // detached: true makes the child a process group leader on Unix, so that
  // process.kill(-pid) in close() can reach all of its descendants (e.g.
  // Electron when launched indirectly via "npm run electron:dev").
  const p = spawn(cmd, args, { ...(cwd ? { cwd } : {}), detached: true });

  // Store the reference to the process so it can be terminated later
  this.process = p;

  // Let the user know that the process started
  console.log(blue('Started ' + self.name));
  this.startTime = +new Date();

  p.stdout.on('data', (data) => {
    if (self.echoOn) console.log(data.toString());
    if (this.waitFor) {
      if (data.toString().includes(this.waitFor)) {
        this.hasStarted = true;
        this.waitFor = null;
      }
    }
  });

  p.stderr.on('data', function (data) {
    console.error(self.name + ' - ' + red(data));
  });

  p.on('close', function (code) {
    self.running = false;
    self.process = null;

    if (self.closeCB) {
      self.closeCB();
      self.closeCB = null;
    }

    console.log(blue('PROCESS TERMINATED: ' + self.name));
  });
};

ProcessLauncher.prototype.close = function (cb) {
  if (this.process) {
    try {
      // Negative PID kills the entire process group, so descendants like
      // Electron (spawned by npm) are also terminated.
      process.kill(-this.process.pid, 'SIGTERM');
    } catch {
      this.process.kill();
    }
    this.closeCB = cb;
  }
};

ProcessLauncher.prototype.isRunning = function () {
  return this.running;
};

ProcessLauncher.prototype.printStatus = function () {
  const activeTime = +new Date();
  const status = this.running ? green('active') : red('inactive');
  console.log(`${this.name}\t${Math.round((activeTime - this.startTime) / 1000)}\t${status}`);
};

ProcessLauncher.prototype.singleProcess = function () {
  return true;
};

export default ProcessLauncher;
