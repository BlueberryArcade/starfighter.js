import { error } from '@sveltejs/kit';
import { getChapters, getSteps, getStepContent } from 'app/chapter.js';

export async function load({ params }) {
  const { chapter, step } = params;

  const [chapters, steps, content] = await Promise.all([
    getChapters(),
    getSteps(chapter).catch(() => {
      throw error(404, 'Chapter not found');
    }),
    getStepContent(chapter, step).catch(() => {
      throw error(404, 'Step not found');
    })
  ]);

  const chapterIndex = chapters.indexOf(chapter);
  const stepIndex = steps.indexOf(step);

  // Resolve previous link
  let prev = null;
  if (stepIndex > 0) {
    prev = `/chapter/${chapter}/${steps[stepIndex - 1]}`;
  } else if (chapterIndex > 0) {
    const prevChapter = chapters[chapterIndex - 1];
    const prevSteps = await getSteps(prevChapter);
    prev = `/chapter/${prevChapter}/${prevSteps[prevSteps.length - 1]}`;
  }

  // Resolve next link
  let next = null;
  if (stepIndex < steps.length - 1) {
    next = `/chapter/${chapter}/${steps[stepIndex + 1]}`;
  } else if (chapterIndex < chapters.length - 1) {
    const nextChapter = chapters[chapterIndex + 1];
    const nextSteps = await getSteps(nextChapter);
    next = `/chapter/${nextChapter}/${nextSteps[0]}`;
  }

  const chapterTitle = chapter
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    chapter,
    chapterTitle,
    step,
    content,
    prev,
    next,
    stepIndex,
    totalSteps: steps.length,
    chapterIndex,
    totalChapters: chapters.length
  };
}
