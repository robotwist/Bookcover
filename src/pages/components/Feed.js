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
      this.feedContainer = await this.patternDetection.findElement(this.feedSelector);
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
      this.feedContainer = await this.patternDetection.findElement(this.feedSelector);
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

  isHidden() {
    if (!this.feedContainer) {
      return false;
    }
    return this.feedContainer.style.display === 'none';
  }
}

export default Feed; 