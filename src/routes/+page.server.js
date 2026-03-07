import { redirect } from '@sveltejs/kit';
import { getTutorials, getSteps } from 'app/tutorial.js';

export async function load() {
  const tutorials = await getTutorials();
  if (!tutorials.length) return {};
  const steps = await getSteps(tutorials[0]);
  if (!steps.length) return {};
  throw redirect(307, `/tutorial/${tutorials[0]}/${steps[0]}`);
}
