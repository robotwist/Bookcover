import FacebookPage from './pages/FacebookPage';
import PatternDetectionService from './services/PatternDetectionService';
import { debounce } from './utils/helpers';

/**
 * Bookcover - Main content script
 * Initializes the extension and manages the page state
 */
class Bookcover {
  constructor() {
    this.page = null;
    this.observer = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('Bookcover: Initializing...');
      
      // Initialize the page object
      this.page = new FacebookPage();
      
      // Start pattern detection
      PatternDetectionService.startObserving();
      
      // Initial hide of distractions
      await this.hideDistractions();
      
      // Set up mutation observer for dynamic content
      this.setupObserver();
      
      this.isInitialized = true;
      console.log('Bookcover: Initialization complete');
    } catch (error) {
      console.error('Bookcover: Initialization failed:', error);
    }
  }

  async hideDistractions() {
    try {
      await this.page.hideDistractions();
    } catch (error) {
      console.error('Bookcover: Error hiding distractions:', error);
    }
  }

  setupObserver() {
    // Debounce the hide function to prevent too frequent calls
    const debouncedHide = debounce(() => this.hideDistractions(), 250);

    this.observer = new MutationObserver(debouncedHide);
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
    PatternDetectionService.stopObserving();
  }
}

// Initialize the extension
const bookcover = new Bookcover();
bookcover.initialize().catch(console.error);

// Cleanup when the page is unloaded
window.addEventListener('unload', () => {
  bookcover.cleanup();
});