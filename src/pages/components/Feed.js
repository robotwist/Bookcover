import ConfigService from '../../services/ConfigService';
import PatternDetectionService from '../../services/PatternDetectionService';

/**
 * Feed - Component for managing Facebook feed
 * Handles feed-specific interactions and state
 */
class Feed {
  constructor() {
    this.config = ConfigService.getInstance();
    this.patternDetection = PatternDetectionService.getInstance();
    this.feedSelector = this.config.getSelector('feed');
    this.feedContainer = null;
  }

  async initialize() {
    try {
      this.feedContainer = await this.patternDetection.findElement(this.feedSelector);
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing feed:', error);
      return false;
    }
  }

  async hide() {
    try {
      if (!this.feedContainer) {
        await this.initialize();
      }
      if (this.feedContainer) {
        this.feedContainer.style.display = 'none';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error hiding feed:', error);
      return false;
    }
  }

  async show() {
    try {
      if (!this.feedContainer) {
        await this.initialize();
      }
      if (this.feedContainer) {
        this.feedContainer.style.display = 'block';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error showing feed:', error);
      return false;
    }
  }

  async isHidden() {
    try {
      if (!this.feedContainer) {
        await this.initialize();
      }
      return this.feedContainer?.style.display === 'none';
    } catch (error) {
      console.error('Bookcover: Error checking feed visibility:', error);
      return false;
    }
  }
}

export default Feed; 