import ConfigService from '../../services/ConfigService';
import PatternDetectionService from '../../services/PatternDetectionService';

/**
 * Reels - Component for managing Facebook reels
 * Handles reels-specific interactions and state
 */
class Reels {
  constructor() {
    this.config = ConfigService.getInstance();
    this.patternDetection = PatternDetectionService.getInstance();
    this.reelsSelector = this.config.getSelector('reels');
    this.reelsContainer = null;
  }

  async initialize() {
    try {
      this.reelsContainer = await this.patternDetection.findElement(this.reelsSelector);
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing reels:', error);
      return false;
    }
  }

  async hide() {
    try {
      if (!this.reelsContainer) {
        await this.initialize();
      }
      if (this.reelsContainer) {
        this.reelsContainer.style.display = 'none';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error hiding reels:', error);
      return false;
    }
  }

  async show() {
    try {
      if (!this.reelsContainer) {
        await this.initialize();
      }
      if (this.reelsContainer) {
        this.reelsContainer.style.display = 'block';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error showing reels:', error);
      return false;
    }
  }

  async isHidden() {
    try {
      if (!this.reelsContainer) {
        await this.initialize();
      }
      return this.reelsContainer?.style.display === 'none';
    } catch (error) {
      console.error('Bookcover: Error checking reels visibility:', error);
      return false;
    }
  }
}

export default Reels; 