import ConfigService from './services/ConfigService';
import PatternDetectionService from './services/PatternDetectionService';
import Feed from './pages/components/Feed';
import Stories from './pages/components/Stories';
import FacebookPage from './pages/FacebookPage';

/**
 * Main content script for the Bookcover extension
 * Initializes and manages the Facebook page interface
 */
class ContentScript {
  constructor() {
    this.configService = ConfigService.getInstance();
    this.patternDetectionService = PatternDetectionService.getInstance();
    this.feed = new Feed();
    this.stories = new Stories();
    this.page = new FacebookPage(this.feed, this.stories);
  }

  async initialize() {
    try {
      // Load configuration
      await this.configService.loadConfig();
      
      // Initialize pattern detection
      await this.patternDetectionService.initialize();
      
      // Initialize Facebook page components
      await this.page.initialize();
      
      this.setupMessageListener();
      console.log('Bookcover initialized successfully');
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing content script:', error);
      return false;
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleDistractions') {
        this.handleToggleDistractions(request.show).then(sendResponse);
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
const contentScript = new ContentScript();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => contentScript.initialize());
} else {
  contentScript.initialize();
}