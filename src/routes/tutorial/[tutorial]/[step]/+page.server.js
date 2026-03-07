import { error } from '@sveltejs/kit';
import { getTutorials, getSteps, getStepContent } from 'app/tutorial.js';

export async function load({ params }) {
  const { tutorial, step } = params;

  const [tutorials, steps, content] = await Promise.all([
    getTutorials(),
    getSteps(tutorial).catch(() => {
      throw error(404, 'Tutorial not found');
    }),
    getStepContent(tutorial, step).catch(() => {
      throw error(404, 'Step not found');
    })
  ]);

  const tutorialIndex = tutorials.indexOf(tutorial);
  const stepIndex = steps.indexOf(step);

  // Resolve previous link
  let prev = null;
  if (stepIndex > 0) {
    prev = `/tutorial/${tutorial}/${steps[stepIndex - 1]}`;
  } else if (tutorialIndex > 0) {
    const prevTutorial = tutorials[tutorialIndex - 1];
    const prevSteps = await getSteps(prevTutorial);
    prev = `/tutorial/${prevTutorial}/${prevSteps[prevSteps.length - 1]}`;
  }

  // Resolve next link
  let next = null;
  if (stepIndex < steps.length - 1) {
    next = `/tutorial/${tutorial}/${steps[stepIndex + 1]}`;
  } else if (tutorialIndex < tutorials.length - 1) {
    const nextTutorial = tutorials[tutorialIndex + 1];
    const nextSteps = await getSteps(nextTutorial);
    next = `/tutorial/${nextTutorial}/${nextSteps[0]}`;
  }

  return {
    tutorial,
    step,
    content,
    prev,
    next,
    stepIndex,
    totalSteps: steps.length,
    tutorialIndex,
    totalTutorials: tutorials.length
  };
}
