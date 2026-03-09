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

  // Resolve previous link (within current chapter only)
  const prev = stepIndex > 0
    ? `/chapter/${chapter}/${steps[stepIndex - 1]}`
    : null;

  // Resolve next link (within current chapter only)
  const next = stepIndex < steps.length - 1
    ? `/chapter/${chapter}/${steps[stepIndex + 1]}`
    : null;

  // Resolve next chapter link (for the "Next Chapter" button on the last step)
  let nextChapter = null;
  if (chapterIndex < chapters.length - 1) {
    const nextChapterSlug = chapters[chapterIndex + 1];
    const nextChapterSteps = await getSteps(nextChapterSlug);
    nextChapter = nextChapterSteps.length ? `/chapter/${nextChapterSlug}/${nextChapterSteps[0]}` : null;
  }

  function slugToTitle(slug) {
    return slug
      .replace(/^\d+-/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const chapterTitle = slugToTitle(chapter);

  const chapterNav = await Promise.all(
    chapters.map(async (slug) => {
      const s = await getSteps(slug).catch(() => []);
      return { slug, title: slugToTitle(slug), href: s.length ? `/chapter/${slug}/${s[0]}` : null };
    })
  );

  return {
    chapter,
    chapterTitle,
    chapterNav,
    step,
    content,
    prev,
    next,
    nextChapter,
    stepIndex,
    totalSteps: steps.length,
    chapterIndex,
    totalChapters: chapters.length
  };
}
