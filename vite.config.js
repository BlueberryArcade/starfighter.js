import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    fs: { allow: ['./lib', './app', './tutorials'] }
  },
  resolve: {
    alias: {
      lib: path.resolve('./lib'),
      app: path.resolve('./app')
    }
  }
};

export default config;
