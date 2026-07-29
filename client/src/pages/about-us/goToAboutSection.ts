/** Smooth-scroll to a page section by element id. */
export function scrollToPageSection(sectionId: string, attempt = 0) {
  const el = document.getElementById(sectionId);
  if (!el) {
    if (attempt < 24) {
      window.setTimeout(() => scrollToPageSection(sectionId, attempt + 1), 100);
    }
    return;
  }

  const header =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) ||
    84;
  const onAboutUs = document.documentElement.classList.contains('about-us-page');
  const stickyNav = onAboutUs ? 56 : 0;
  const y = el.getBoundingClientRect().top + window.scrollY - header - stickyNav - 8;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

/** @deprecated Use scrollToPageSection — kept for existing imports */
export function goToAboutSection(sectionId: string, attempt = 0) {
  scrollToPageSection(sectionId, attempt);
}
