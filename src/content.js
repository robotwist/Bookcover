import FacebookPage from './pages/FacebookPage';
import ConfigService from './services/ConfigService';

/**
 * Main content script for the Bookcover extension
 * Initializes and manages the Facebook page interface
 */
class ContentScript {
  constructor() {
    this.page = null;
    this.config = null;
  }

  async initialize() {
    try {
      this.config = ConfigService.getInstance();
      await this.config.loadConfig();
      this.page = new FacebookPage();
      await this.page.hideDistractions();
      this.setupMessageListener();
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

// Initialize the content script
const contentScript = new ContentScript();
contentScript.initialize().catch((error) => {
  console.error('Bookcover: Failed to initialize content script:', error);
});
});