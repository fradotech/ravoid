/* eslint-disable @typescript-eslint/no-explicit-any */
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('a');
  if (!link) return;

  const url = new URL(link.href, window.location.origin);

  if (url.origin === window.location.origin && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'internal_click', {
      event_category: 'navigation',
      event_label: url.pathname,
    });
  }
});
