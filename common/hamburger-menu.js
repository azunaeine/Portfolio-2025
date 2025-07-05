/**
 * Hamburger Menu - A fully accessible, responsive navigation menu
 */
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Selectors
    selectors: {
      hamburgerBtn: '.btn-hamburger-menu',
      closeBtn: '.btn-close-menu',
      menuOverlay: '.hamburger-menu-overlay',
      menuContent: '.hamburger-menu-content',
      menuItems: '.hamburger-menu-nav-item',
      themeToggle: '.theme-toggle-container',
      mainContent: 'main, [role="main"]',
      focusableElements: 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    },
    // Classes
    classes: {
      visible: 'visible',
      menuOpen: 'menu-is-open'
    },
    // ARIA attributes
    aria: {
      expanded: 'aria-expanded',
      hidden: 'aria-hidden',
      current: 'aria-current',
      modal: 'aria-modal',
      label: 'aria-label',
      controls: 'aria-controls',
      hasPopup: 'aria-haspopup'
    },
    // Animation timing
    animation: {
      duration: 300, // ms
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    // Debug mode
    debug: true,
    logPrefix: '[Hamburger Menu]'
  };

  // State
  const state = {
    isOpen: false,
    isAnimating: false,
    firstFocusableElement: null,
    lastFocusableElement: null,
    previouslyFocusedElement: null,
    focusableElements: []
  };

  // DOM Elements
  const elements = {};

  // Utility functions
  const log = (...args) => {
    if (CONFIG.debug) {
      console.log(CONFIG.logPrefix, ...args);
    }
  };

  const error = (...args) => {
    console.error(CONFIG.logPrefix, ...args);
  };

  const getElement = (selector, parent = document) => {
    return parent.querySelector(selector);
  };

  const getAllElements = (selector, parent = document) => {
    return Array.from(parent.querySelectorAll(selector));
  };

  /**
   * Initialize the hamburger menu
   */
  const init = () => {
    log('Initializing...');

    // Get all required elements
    try {
      elements.hamburgerBtn = getElement(CONFIG.selectors.hamburgerBtn);
      elements.closeBtn = getElement(CONFIG.selectors.closeBtn);
      elements.menuOverlay = getElement(CONFIG.selectors.menuOverlay);
      elements.menuContent = getElement(CONFIG.selectors.menuContent);
      elements.menuItems = getAllElements(CONFIG.selectors.menuItems, elements.menuContent);
      elements.mainContent = getElement(CONFIG.selectors.mainContent);

      // Check for required elements
      const missingElements = Object.entries(elements)
        .filter(([key, el]) => !el && key !== 'mainContent') // mainContent is optional
        .map(([key]) => key);

      if (missingElements.length > 0) {
        throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
      }

      // Set up ARIA attributes
      initAria();

      // Set up event listeners
      setupEventListeners();

      // Load theme toggle if container exists
      loadThemeToggle();

      log('Initialization complete');
    } catch (err) {
      error('Initialization failed:', err);
    }
  };

  /**
   * Initialize ARIA attributes
   */
  const initAria = () => {
    const { hamburgerBtn, closeBtn, menuOverlay, menuContent } = elements;
    const menuId = 'main-navigation';

    // Set up hamburger button
    hamburgerBtn.setAttribute(CONFIG.aria.controls, menuId);
    hamburgerBtn.setAttribute(CONFIG.aria.expanded, 'false');
    hamburgerBtn.setAttribute(CONFIG.aria.hasPopup, 'menu');
    hamburgerBtn.setAttribute('aria-label', 'Open main menu');

    // Set up close button
    closeBtn.setAttribute(CONFIG.aria.label, 'Close menu');

    // Set up menu overlay and content
    menuOverlay.setAttribute('role', 'dialog');
    menuOverlay.setAttribute('aria-modal', 'true');
    menuOverlay.setAttribute('aria-hidden', 'true');
    menuOverlay.setAttribute('aria-label', 'Main navigation');
    
    menuContent.setAttribute('role', 'navigation');
    menuContent.setAttribute('aria-label', 'Main menu');
    menuContent.id = menuId;
  };

  /**
   * Set up event listeners
   */
  const setupEventListeners = () => {
    const { hamburgerBtn, closeBtn, menuOverlay, menuItems } = elements;

    // Toggle menu when hamburger button is clicked
    hamburgerBtn.addEventListener('click', onHamburgerClick);
    hamburgerBtn.addEventListener('keydown', onHamburgerKeyDown);

    // Close menu when close button is clicked
    closeBtn.addEventListener('click', onCloseClick);
    closeBtn.addEventListener('keydown', onCloseKeyDown);

    // Close menu when clicking outside
    menuOverlay.addEventListener('click', onClickOutside);

    // Handle keyboard navigation within menu
    menuItems.forEach(item => {
      item.addEventListener('keydown', onMenuItemKeyDown);
    });

    // Handle keyboard events for the menu
    document.addEventListener('keydown', onDocumentKeyDown);
  };

  /**
   * Toggle the menu open/closed
   * @param {boolean} [show] - Whether to show or hide the menu
   */
  const toggleMenu = (show) => {
    // If show is not specified, toggle the current state
    const shouldShow = typeof show === 'boolean' ? show : !state.isOpen;

    // If already in the desired state, do nothing
    if (shouldShow === state.isOpen) {
      return;
    }

    // Prevent multiple animations
    if (state.isAnimating) {
      return;
    }

    log(`Toggling menu: ${shouldShow ? 'show' : 'hide'}`);
    state.isAnimating = true;

    // Update state
    state.isOpen = shouldShow;
    state.previouslyFocusedElement = shouldShow ? document.activeElement : null;

    // Update ARIA attributes
    updateAria();

    // Toggle classes
    const { menuContent, closeBtn, menuOverlay } = elements;
    const { visible } = CONFIG.classes;

    if (shouldShow) {
      // Show menu
      menuContent.classList.add(visible);
      closeBtn.classList.add(visible);
      menuOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add(CONFIG.classes.menuOpen);

      // Set focus to the first focusable element in the menu
      setTimeout(() => {
        trapFocus();
        state.isAnimating = false;
      }, 50);
    } else {
      // Hide menu
      menuContent.classList.remove(visible);
      closeBtn.classList.remove(visible);
      menuOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove(CONFIG.classes.menuOpen);

      // Return focus to the previously focused element
      setTimeout(() => {
        if (state.previouslyFocusedElement) {
          state.previouslyFocusedElement.focus();
        }
        state.isAnimating = false;
      }, CONFIG.animation.duration);
    }
  };

  /**
   * Update ARIA attributes based on current state
   */
  const updateAria = () => {
    const { hamburgerBtn, menuOverlay } = elements;
    const { isOpen } = state;

    hamburgerBtn.setAttribute(CONFIG.aria.expanded, isOpen.toString());
    menuOverlay.setAttribute('aria-hidden', (!isOpen).toString());
  };

  /**
   * Trap focus inside the menu when it's open
   */
  const trapFocus = () => {
    const { menuContent } = elements;
    
    // Get all focusable elements in the menu
    state.focusableElements = Array.from(
      menuContent.querySelectorAll(CONFIG.selectors.focusableElements)
    ).filter(el => {
      // Filter out elements with tabindex="-1" and disabled elements
      return el.getAttribute('tabindex') !== '-1' && !el.disabled;
    });

    // Update first and last focusable elements
    state.firstFocusableElement = state.focusableElements[0];
    state.lastFocusableElement = state.focusableElements[state.focusableElements.length - 1];

    // Set focus to the first focusable element
    if (state.firstFocusableElement) {
      state.firstFocusableElement.focus();
    }
  };

  /**
   * Handle keyboard navigation within the menu
   * @param {KeyboardEvent} e - The keydown event
   */
  const handleMenuNavigation = (e) => {
    const { key, shiftKey } = e;
    const { activeElement } = document;
    const { firstFocusableElement, lastFocusableElement } = state;

    // If no focusable elements, do nothing
    if (!firstFocusableElement || !lastFocusableElement) {
      return;
    }

    // Handle Tab key
    if (key === 'Tab') {
      // If shift + tab on first element, move to last element
      if (shiftKey && activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      } 
      // If tab on last element, move to first element
      else if (!shiftKey && activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
    // Handle Escape key
    else if (key === 'Escape') {
      e.preventDefault();
      toggleMenu(false);
      elements.hamburgerBtn.focus();
    }
  };

  /**
   * Update the active menu item based on current page
   */
  const updateActiveMenuItem = () => {
    const { menuItems } = elements;
    const currentPath = window.location.pathname;

    menuItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && currentPath.endsWith(href)) {
        item.setAttribute(CONFIG.aria.current, 'page');
      } else {
        item.removeAttribute(CONFIG.aria.current);
      }
    });
  };

  // Event Handlers

  const onHamburgerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu(true);
  };

  const onHamburgerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu(true);
    } else if (e.key === 'Escape' && state.isOpen) {
      toggleMenu(false);
    }
  };

  const onCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu(false);
    elements.hamburgerBtn.focus();
  };

  const onCloseKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      toggleMenu(false);
      elements.hamburgerBtn.focus();
    }
  };

  const onClickOutside = (e) => {
    const { menuContent } = elements;
    const isClickInsideMenu = menuContent.contains(e.target);
    const isHamburgerButton = e.target.closest(CONFIG.selectors.hamburgerBtn);
    
    if (!isClickInsideMenu && !isHamburgerButton && state.isOpen) {
      toggleMenu(false);
    }
  };

  const onMenuItemKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      toggleMenu(false);
      elements.hamburgerBtn.focus();
    }
  };

  const onDocumentKeyDown = (e) => {
    if (!state.isOpen) return;
    
    // Handle keyboard navigation when menu is open
    if (e.key === 'Tab' || e.key === 'Escape') {
      handleMenuNavigation(e);
    }
  };

  /**
   * Load the theme toggle component
   */
  const loadThemeToggle = () => {
    const themeToggleContainer = getElement(CONFIG.selectors.themeToggle);
    
    if (!themeToggleContainer) {
      log('No theme toggle container found');
      return;
    }

    log('Loading theme toggle...');
    
    fetch('darktoggle.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        themeToggleContainer.innerHTML = html;
        log('Theme toggle loaded');
      })
      .catch(err => {
        error('Error loading theme toggle:', err);
      });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      updateActiveMenuItem();
    });
  } else {
    // DOM already loaded, initialize immediately
    setTimeout(() => {
      init();
      updateActiveMenuItem();
    }, 0);
  }

  // Public API
  window.hamburgerMenu = {
    init,
    toggle: toggleMenu,
    show: () => toggleMenu(true),
    hide: () => toggleMenu(false),
    updateActiveMenuItem
  };
})();
