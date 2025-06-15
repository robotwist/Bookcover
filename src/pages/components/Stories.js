import ConfigService from '../../services/ConfigService';
import PatternDetectionService from '../../services/PatternDetectionService';

/**
 * Stories - Component for managing Facebook stories
 * Handles stories-specific interactions and state
 */
class Stories {
  constructor() {
    this.config = ConfigService.getInstance();
    this.patternDetection = PatternDetectionService.getInstance();
    this.storiesSelector = this.config.getSelector('stories');
    this.storiesContainer = null;
  }

  async initialize() {
    try {
      this.storiesContainer = await this.patternDetection.findElement(this.storiesSelector);
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing stories:', error);
      return false;
    }
  }

  async hide() {
    try {
      if (!this.storiesContainer) {
        await this.initialize();
      }
      if (this.storiesContainer) {
        this.storiesContainer.style.display = 'none';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error hiding stories:', error);
      return false;
    }
  }

  async show() {
    try {
      if (!this.storiesContainer) {
        await this.initialize();
      }
      if (this.storiesContainer) {
        this.storiesContainer.style.display = 'block';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error showing stories:', error);
      return false;
    }
  }

  async isHidden() {
    try {
      if (!this.storiesContainer) {
        await this.initialize();
      }
      return this.storiesContainer?.style.display === 'none';
    } catch (error) {
      console.error('Bookcover: Error checking stories visibility:', error);
      return false;
    }
  }
}

export default Stories; 