import { getChapters, getSteps } from 'app/chapter.js';

export async function load() {
  const chapters = await getChapters();
  if (!chapters.length) return { defaultPath: null };
  const steps = await getSteps(chapters[0]);
  if (!steps.length) return { defaultPath: null };
  return { defaultPath: `/chapter/${chapters[0]}/${steps[0]}` };
}
