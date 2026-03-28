/* eslint-disable @typescript-eslint/no-explicit-any */
const GA_ID = 'G-PV5NVMJBH4';

(window as any).dataLayer = (window as any).dataLayer || [];
(window as any).gtag = function (...args: any[]) {
  (window as any).dataLayer.push(args);
};

(window as any).gtag('js', new Date());
(window as any).gtag('config', GA_ID);

const script = document.createElement('script');
script.async = true;
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
document.head.appendChild(script);
