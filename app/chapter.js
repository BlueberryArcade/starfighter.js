import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);

marked.use(
  markedHighlight({
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return code;
    }
  })
);

const CHAPTERS_DIR = path.join(process.cwd(), 'chapters');

export async function getChapters() {
  const entries = await fs.readdir(CHAPTERS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export async function getSteps(chapterSlug) {
  const stepsDir = path.join(CHAPTERS_DIR, chapterSlug, 'steps');
  const files = await fs.readdir(stepsDir);
  return files
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getStepContent(chapterSlug, stepSlug) {
  const file = path.join(CHAPTERS_DIR, chapterSlug, 'steps', `${stepSlug}.md`);
  const raw = await fs.readFile(file, 'utf-8');
  return marked(raw);
}
