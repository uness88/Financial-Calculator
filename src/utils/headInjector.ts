/**
 * Dynamic Custom <head> Injection Engine
 * Safely parses and injects user-provided HTML, <script>, <style>, <meta>, <link> tags
 * into document.head and ensures scripts execute properly.
 */

export function injectCustomHeadCode(rawHtml: string): { success: boolean; count: number; error?: string } {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return { success: true, count: 0 };
  }

  // Ensure window.fetch is writable and configurable so injected scripts can patch it safely
  try {
    const rawFetch = window.fetch ? window.fetch.bind(window) : null;
    let currentFetch = rawFetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set) {
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
    }
  } catch {}

  try {
    // 1. Clean up previously injected custom head tags
    const existingCustomTags = document.head.querySelectorAll('[data-omnicalc-custom-head="true"]');
    existingCustomTags.forEach((el) => el.remove());

    if (!rawHtml || !rawHtml.trim()) {
      return { success: true, count: 0 };
    }

    // 2. Parse HTML string using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Collect all elements from both parsed <head> and <body>
    const elementsToInject: Element[] = [];
    doc.head.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        elementsToInject.push(node as Element);
      }
    });
    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        elementsToInject.push(node as Element);
      }
    });

    let injectedCount = 0;

    // 3. Reconstruct and append each element so browsers execute scripts & apply styles
    elementsToInject.forEach((el) => {
      const tagName = el.tagName.toLowerCase();

      if (tagName === 'script') {
        const script = document.createElement('script');
        script.setAttribute('data-omnicalc-custom-head', 'true');

        // Copy all attributes (src, async, defer, type, crossorigin, id, etc.)
        Array.from(el.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });

        if (el.textContent) {
          script.textContent = el.textContent;
        }

        document.head.appendChild(script);
        injectedCount++;
      } else if (tagName === 'style') {
        const style = document.createElement('style');
        style.setAttribute('data-omnicalc-custom-head', 'true');
        Array.from(el.attributes).forEach((attr) => {
          style.setAttribute(attr.name, attr.value);
        });
        style.textContent = el.textContent || '';
        document.head.appendChild(style);
        injectedCount++;
      } else if (tagName === 'link') {
        const link = document.createElement('link');
        link.setAttribute('data-omnicalc-custom-head', 'true');
        Array.from(el.attributes).forEach((attr) => {
          link.setAttribute(attr.name, attr.value);
        });
        document.head.appendChild(link);
        injectedCount++;
      } else if (tagName === 'meta') {
        const meta = document.createElement('meta');
        meta.setAttribute('data-omnicalc-custom-head', 'true');
        Array.from(el.attributes).forEach((attr) => {
          meta.setAttribute(attr.name, attr.value);
        });
        document.head.appendChild(meta);
        injectedCount++;
      } else {
        // Generic tag (e.g. noscript, title, custom tag)
        const customEl = document.createElement(tagName);
        customEl.setAttribute('data-omnicalc-custom-head', 'true');
        Array.from(el.attributes).forEach((attr) => {
          customEl.setAttribute(attr.name, attr.value);
        });
        customEl.innerHTML = el.innerHTML;
        document.head.appendChild(customEl);
        injectedCount++;
      }
    });

    return { success: true, count: injectedCount };
  } catch (err: any) {
    console.error('Failed to inject custom head code:', err);
    return { success: false, count: 0, error: err?.message || 'Unknown parsing error' };
  }
}
