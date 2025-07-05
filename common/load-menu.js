/**
 * Loads and initializes the hamburger menu
 */
(function() {
  'use strict';

  const CONFIG = {
    menuHtmlPath: 'common/hamburger-menu.html',
    menuScriptPath: 'common/hamburger-menu.js',
    darkModeScriptPath: 'common/darkmode-toggle.js',
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
   * Loads the hamburger menu HTML
   * @returns {Promise<void>}
   */
  async function loadMenu() {
    try {
      log('Loading hamburger menu...');
      
      // Get the container
      const container = document.getElementById(CONFIG.containerId);
      if (!container) {
        throw new Error(`Container element with ID '${CONFIG.containerId}' not found`);
      }

      // Load the menu HTML
      const response = await fetch(CONFIG.menuHtmlPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      container.innerHTML = html;
      log('Hamburger menu HTML loaded');

      // Load and initialize the hamburger menu script
      await loadScript(CONFIG.menuScriptPath);
      
      // Initialize the hamburger menu
      if (window.hamburgerMenu && typeof window.hamburgerMenu.init === 'function') {
        window.hamburgerMenu.init();
        log('Hamburger menu initialized');
      } else {
        throw new Error('Hamburger menu API not found');
      }

      // Load dark mode toggle if needed
      if (document.querySelector('.theme-toggle-container')) {
        await loadScript(CONFIG.darkModeScriptPath);
        log('Dark mode toggle loaded');
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
