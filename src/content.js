import ConfigService from './services/ConfigService';
import PatternDetectionService from './services/PatternDetectionService';
import FacebookPage from './pages/FacebookPage';

/**
 * Main content script for the Bookcover extension
 * Initializes and manages the Facebook page interface
 */
class ContentScript {
  constructor() {
    try {
      this.configService = ConfigService.getInstance();
      this.patternDetectionService = PatternDetectionService.getInstance();
      this.page = new FacebookPage();
      
      // Add runtime checks
      if (!this.page || typeof this.page.initialize !== 'function') {
        throw new Error('FacebookPage not properly initialized');
      }
      
      if (!this.configService || typeof this.configService.loadConfig !== 'function') {
        throw new Error('ConfigService not properly initialized');
      }
      
      if (!this.patternDetectionService || typeof this.patternDetectionService.initialize !== 'function') {
        throw new Error('PatternDetectionService not properly initialized');
      }
    } catch (error) {
      console.error('Bookcover: Error in ContentScript constructor:', error);
      throw error;
    }
  }

  async initialize() {
    try {
      // Load configuration
      const configLoaded = await this.configService.loadConfig();
      if (!configLoaded) {
        throw new Error('Failed to load configuration');
      }
      
      // Initialize Facebook page
      const pageInitialized = await this.page.initialize();
      if (!pageInitialized) {
        throw new Error('Failed to initialize Facebook page');
      }
      
      this.setupMessageListener();
      console.log('Bookcover: Content script initialized successfully');
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing content script:', error);
      return false;
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleDistractions') {
        this.handleToggleDistractions(request.show)
          .then(sendResponse)
          .catch(error => {
            console.error('Bookcover: Error handling message:', error);
            sendResponse({ success: false, error: error.message });
          });
        return true;
      }
      return false;
    });
  }

  async handleToggleDistractions(show) {
    try {
      if (show) {
        await this.page.showDistractions();
      } else {
        await this.page.hideDistractions();
      }
      return { success: true };
    } catch (error) {
      console.error('Bookcover: Error toggling distractions:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize the content script when the page is ready
let contentScript;
try {
  contentScript = new ContentScript();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      contentScript.initialize().catch(error => {
        console.error('Bookcover: Failed to initialize content script:', error);
      });
    });
  } else {
    contentScript.initialize().catch(error => {
      console.error('Bookcover: Failed to initialize content script:', error);
    });
  }
} catch (error) {
  console.error('Bookcover: Failed to create ContentScript instance:', error);
}