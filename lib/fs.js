import _fs from 'fs';

const fs = {};

const fsp = _fs.promises;

// Extract all sync methods
Object.keys(_fs).forEach((method) => {
  if (~method.indexOf('Sync')) {
    fs[method] = _fs[method];
  }
});

// Extract all promises
Object.keys(fsp).forEach((method) => {
  fs[method] = fsp[method];
});

export default fs;
