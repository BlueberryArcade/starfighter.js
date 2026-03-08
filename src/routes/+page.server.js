import { redirect } from '@sveltejs/kit';
import { getChapters, getSteps } from 'app/chapter.js';

export async function load() {
  const chapters = await getChapters();
  if (!chapters.length) return {};
  const steps = await getSteps(chapters[0]);
  if (!steps.length) return {};
  throw redirect(307, `/chapter/${chapters[0]}/${steps[0]}`);
}
