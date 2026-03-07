import readline from 'readline';
import processes from 'app/processes';
import sleep from 'lib/sleep';

const programs = {};
const history = [];

const green = (str) => `\x1b[32m${str}\x1b[0m`;

async function shutdown() {
  await processes.stopAll();
  console.log('\nExiting...');
  await sleep(500);
}

export const forever = true;

async function runShell() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${green('starfighter')}> `
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const args = line.trim().split(' ');
    const cmd = args[0];

    history.push(line);

    switch (cmd) {
      case 'start': {
        const programName = args[1];
        if (programName) {
          const launcher = processes.get(programName);
          if (launcher && !programs[programName]) {
            launcher.launch();
            programs[programName] = 'Running';
            console.log(`Program ${programName} started.`);
          }
        } else {
          await processes.startAll();
        }
        break;
      }

      case 'stop': {
        const programName = args[1];
        if (programName) {
          const launcher = processes.get(programName);
          if (launcher) {
            launcher.close();
            programs[programName] = 'Stopped';
            console.log(`Program ${programName} stopped.`);
          }
        } else {
          await processes.stopAll();
        }
        break;
      }

      case 'show':
        if (args.length > 1) {
          args.slice(1).forEach((name) => {
            const launcher = processes.get(name);
            if (launcher) launcher.echoOn = true;
          });
        } else {
          console.log('Enter a process name to show');
        }
        break;

      case 'status':
        processes.printStatus();
        break;

      case 'history':
        console.log('Command History:', history);
        break;

      case 'quit':
        await shutdown();
        process.exit();

      case 'help':
        console.log('Commands: start [name], stop [name], show <name>, status, history, quit');
        break;

      case '':
        if (processes.printing()) processes.hideAll();
        break;

      default:
        console.log(`Unknown command "${cmd}". Try "help".`);
    }

    rl.prompt();
  }).on('SIGINT', async () => {
    await shutdown();
    process.exit();
  });
}

export async function main() {
  await processes.register({ useElectron: true });
  await processes.startAll();
  await runShell();
}

export function uncaughtException() {
  shutdown();
}

export function unhandledRejection() {
  shutdown();
}
