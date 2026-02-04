import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Enable neon overlay and animations on body by default so the CSS rules apply
if (typeof document !== 'undefined') {
  document.body.classList.add('neon', 'animated');

  // Apply site gradient and animation helpers to matching elements (also handles dynamically added nodes)
  const applySiteGradient = (root = document) => {
    try {
      const selector = ['.card', '.panel', '.navbar', '.sidebar', '[class*="bg-slate"]', '[class*="bg-[#"]', '[class*="bg-#"]', '[class*="bg-gradient-to"]', '[class*="rounded-"]'].join(', ');
      document.querySelectorAll(selector).forEach(el => el.classList.add('site-gradient', 'animated-item'));
    } catch (err) {
      // ignore in non-browser environments
    }
  };

  // initial application
  applySiteGradient();

  // Observe DOM for new elements and apply classes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node && node.nodeType === 1) applySiteGradient(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
