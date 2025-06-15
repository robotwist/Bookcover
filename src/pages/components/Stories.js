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
      this.storiesContainer = await this.patternDetection.findElement(this.storiesSelector);
      if (this.storiesContainer) {
        this.storiesContainer.style.display = 'none';
      }
    } catch (error) {
      console.error('Bookcover: Error hiding stories:', error);
    }
  }

  async show() {
    try {
      this.storiesContainer = await this.patternDetection.findElement(this.storiesSelector);
      if (this.storiesContainer) {
        this.storiesContainer.style.display = 'block';
      }
    } catch (error) {
      console.error('Bookcover: Error showing stories:', error);
    }
  }

  isHidden() {
    if (!this.storiesContainer) {
      return false;
    }
    return this.storiesContainer.style.display === 'none';
  }
}

export default Stories; 