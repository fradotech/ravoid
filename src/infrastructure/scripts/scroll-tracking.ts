/* eslint-disable @typescript-eslint/no-explicit-any */
let sent = false;

window.addEventListener('scroll', () => {
  if (sent) return;

  const docHeight = document.body.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;

  const scrollPercent = window.scrollY / docHeight;

  if (scrollPercent > 0.75) {
    sent = true;
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'scroll_75', {
        event_category: 'engagement',
        event_label: window.location.pathname,
      });
    }
  }
});
