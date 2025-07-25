(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    selectors: {
      body: 'body',
      themeToggle: '.theme-toggle'
    },
    attributes: {
      theme: 'data-theme'
    },
    themes: {
      light: 'light',
      dark: 'dark'
    },
    storageKey: 'theme',
    debug: true
  };

  // State
  const state = {
    currentTheme: null,
    isInitialized: false
  };

  // DOM Elements
  const elements = {};

  // Initialize the dark mode toggle
  function init() {
    if (state.isInitialized) {
      log('Dark mode toggle already initialized');
      return;
    }

    log('Initializing dark mode toggle...');

    // Get DOM elements
    elements.body = document.querySelector(CONFIG.selectors.body);
    
    if (!elements.body) {
      error('Body element not found');
      return;
    }

    // Set up event delegation for theme toggle buttons
    document.addEventListener('click', onDocumentClick);

    // Load saved theme or use system preference
    loadTheme();

    state.isInitialized = true;
    log('Dark mode toggle initialized');
  }

  // Load the current theme
  function loadTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem(CONFIG.storageKey);
    
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set theme based on saved preference or system preference
    const theme = savedTheme || (prefersDark ? CONFIG.themes.dark : CONFIG.themes.light);
    
    // Apply the theme
    setTheme(theme);
  }

  // Set the theme
  function setTheme(theme) {
    if (!theme || !Object.values(CONFIG.themes).includes(theme)) {
      error(`Invalid theme: ${theme}`);
      return;
    }

    // Don't do anything if the theme isn't changing
    if (state.currentTheme === theme) {
      return;
    }

    // Add pulse animation class to all toggle buttons
    const toggles = document.querySelectorAll(CONFIG.selectors.themeToggle);
    toggles.forEach(toggle => {
      toggle.classList.add('pulse');
      
      // Remove the animation class after it completes
      setTimeout(() => {
        toggle.classList.remove('pulse');
      }, 500);
    });

    // Update the theme attribute on the body
    elements.body.setAttribute(CONFIG.attributes.theme, theme);
    
    // Save the theme preference
    localStorage.setItem(CONFIG.storageKey, theme);
    
    // Update the state
    state.currentTheme = theme;
    
    // Update any toggle buttons
    updateThemeToggles();
    
    log(`Theme set to: ${theme}`);
  }

  // Toggle between light and dark themes
  function toggleTheme() {
    const newTheme = state.currentTheme === CONFIG.themes.light 
      ? CONFIG.themes.dark 
      : CONFIG.themes.light;
    
    setTheme(newTheme);
  }

  // Update all theme toggle buttons
  function updateThemeToggles() {
    const toggles = document.querySelectorAll(CONFIG.selectors.themeToggle);
    
    toggles.forEach(toggle => {
      // Update ARIA label
      const label = state.currentTheme === CONFIG.themes.light 
        ? 'Switch to dark mode' 
        : 'Switch to light mode';
      
      toggle.setAttribute('aria-label', label);
    });
  }

  // Event Handlers
  function onDocumentClick(event) {
    // Check if the click was on a theme toggle button
    const toggleButton = event.target.closest(CONFIG.selectors.themeToggle);
    
    if (toggleButton) {
      event.preventDefault();
      toggleTheme();
    }
  }

  // Utility functions
  function log(...args) {
    if (CONFIG.debug) {
      console.log('[Dark Mode Toggle]', ...args);
    }
  }

  function error(...args) {
    console.error('[Dark Mode Toggle]', ...args);
  }

  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded, initialize immediately
    setTimeout(init, 0);
  }

  // Public API
  window.darkModeToggle = {
    init,
    setTheme,
    toggle: toggleTheme,
    getCurrentTheme: () => state.currentTheme
  };
})();
