/**
 * Loads and initializes the hamburger menu
 */
(function() {
  'use strict';

  const CONFIG = {
    menuHtmlPath: '/common/hamburger-menu.html',
    menuScriptPath: '/common/hamburger-menu.js',
    darkModeScriptPath: '/common/darkmode-toggle.js',
    containerId: 'hamburger-menu-container',
    logPrefix: '[Menu Loader]',
    debug: true
  };

  // Utility functions
  function log(...args) {
    if (CONFIG.debug) {
      console.log(CONFIG.logPrefix, ...args);
    }
  }

  function error(...args) {
    console.error(CONFIG.logPrefix, ...args);
  }

  /**
   * Loads an external script
   * @param {string} src - The script source URL
   * @returns {Promise<HTMLScriptElement>}
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        log(`Script loaded: ${src}`);
        resolve(script);
      };
      script.onerror = (err) => {
        error(`Error loading script ${src}:`, err);
        reject(err);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Loads the hamburger menu
   * @returns {Promise<void>}
   */
  async function loadMenu() {
    try {
      log('Loading hamburger menu...');
      
      // Load menu HTML
      const response = await fetch(CONFIG.menuHtmlPath);
      if (!response.ok) {
        throw new Error(`Failed to load menu HTML: ${response.status}`);
      }
      
      const menuHtml = await response.text();
      
      // Create container if it doesn't exist
      let container = document.getElementById(CONFIG.containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        document.body.appendChild(container);
      }
      
      // Inject menu HTML
      container.innerHTML = menuHtml;
      log('Menu HTML loaded');
      
      // Load and initialize menu script
      await loadScript(CONFIG.menuScriptPath);
      
      // Load dark mode script
      await loadScript(CONFIG.darkModeScriptPath);
      log('Dark mode toggle loaded');
      
      // Initialize dark mode if needed
      if (window.darkModeToggle) {
        window.darkModeToggle.init();
      }
      
    } catch (err) {
      error('Failed to load hamburger menu:', err);
    }
  }

  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMenu);
  } else {
    // DOM already loaded, run immediately
    setTimeout(loadMenu, 0);
  }
})();
