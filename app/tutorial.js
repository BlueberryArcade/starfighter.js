import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

const TUTORIALS_DIR = path.join(process.cwd(), 'tutorials');

export async function getTutorials() {
  const entries = await fs.readdir(TUTORIALS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export async function getSteps(tutorialSlug) {
  const stepsDir = path.join(TUTORIALS_DIR, tutorialSlug, 'steps');
  const files = await fs.readdir(stepsDir);
  return files
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getStepContent(tutorialSlug, stepSlug) {
  const file = path.join(TUTORIALS_DIR, tutorialSlug, 'steps', `${stepSlug}.md`);
  const raw = await fs.readFile(file, 'utf-8');
  return marked(raw);
}
