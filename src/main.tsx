// Ensure window.fetch has both getter and setter so 3rd-party scripts/extensions can safely patch it
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch ? window.fetch.bind(window) : null;
    let currentFetch = rawFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch || (rawFetch ? rawFetch : (window.fetch ? window.fetch.bind(window) : undefined));
      },
      set(fn) {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  } catch {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
