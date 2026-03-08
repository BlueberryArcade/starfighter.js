import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    fs: { allow: ['./lib', './app', './chapters'] }
  },
  resolve: {
    alias: {
      lib: path.resolve('./lib'),
      app: path.resolve('./app')
    }
  }
};

export default config;
