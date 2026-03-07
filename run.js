import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';

let uncaughtException;
let unhandledRejection;

function getArgs(argv) {
  if (argv.length < 3) return {};

  // Extract command-line arguments starting from the third one
  const rawArgs = argv.slice(3);

  // Initialize an empty object to store the arguments
  const argsObject = {};

  // Loop through the array of arguments
  let k = 0;
  while (k < rawArgs.length) {
    // Check if the current argument starts with '--'
    if (rawArgs[k].startsWith('--')) {
      // Remove the '--' prefix and use the next item in the array as the value
      const key = rawArgs[k].slice(2);

      if (rawArgs[k + 1]?.startsWith('--') || k == rawArgs.length - 1) {
        argsObject[key] = true;
      } else {
        const value = rawArgs[k + 1];
        // Add the key and value to the argsObject
        argsObject[key] = value;
        k++;
      }
    }
    k++;
  }
  return argsObject;
}

// Check for sync arg
let argv = process.argv;

// Check for the minimum number of arguments
if (argv.length < 3) {
  console.log('USAGE: node run scriptName');
  process.exit();
}

// Create a server just to load all of vite's and sveltekit's config
const vite = await createViteServer({
  server: { middlewareMode: false },
  mode: 'development',
  appType: 'custom',
  plugins: []
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.log('FIXING STACK');
  vite.ssrFixStacktrace(error);
  if (uncaughtException) if (uncaughtException(error) !== false) return;
  console.error(error);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  if (reason instanceof Error) {
    console.log('FIXING STACK');
    vite.ssrFixStacktrace(reason);
  }
  if (unhandledRejection) if (unhandledRejection(reason) !== false) return;
  if (reason instanceof Error) {
    console.log('FIXING STACK');
    vite.ssrFixStacktrace(reason);
    console.error(reason);
  } else {
    console.error('Unhandled Rejection:', reason);
  }
  process.exit(1);
});

// Use the server-side rendering capabilities of vite to import the module
// This makes sure all svelte's module paths are reachable
const filename = path.join('./scripts', argv[2]);
let resolvedFilename = '';
try {
  fs.accessSync(`${filename}.js`);
  resolvedFilename = `${filename}.js`;
} catch (e) {
  try {
    fs.accessSync(`${filename}.ts`);
    resolvedFilename = `${filename}.ts`;
  } catch (e) {
    console.error(`\nScript not found: ${filename}\n`);
    process.exit();
  }
}

// Define load so that scripts can load modules dynamically
async function load(filename) {
  return await vite.ssrLoadModule(filename);
}

// Load module
const res = await load(resolvedFilename);

// Custom uncaught error handlers
uncaughtException = res.uncaughtException;
unhandledRejection = res.unhandledRejection;

const forever = res.forever || false;

// Execute the main() exported function
try {
  await res.main({ args: getArgs(argv), load });
} catch (e) {
  console.log('FIXING STACK');
  vite.ssrFixStacktrace(e);
  console.error(e);
  process.exit(1);
}

// Exit process
if (!forever) process.exit();
