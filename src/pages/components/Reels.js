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
      this.reelsContainer = await this.patternDetection.findElement(this.reelsSelector);
      if (this.reelsContainer) {
        this.reelsContainer.style.display = 'none';
      }
    } catch (error) {
      console.error('Bookcover: Error hiding reels:', error);
    }
  }

  async show() {
    try {
      this.reelsContainer = await this.patternDetection.findElement(this.reelsSelector);
      if (this.reelsContainer) {
        this.reelsContainer.style.display = 'block';
      }
    } catch (error) {
      console.error('Bookcover: Error showing reels:', error);
    }
  }

  isHidden() {
    if (!this.reelsContainer) {
      return false;
    }
    return this.reelsContainer.style.display === 'none';
  }
}

export default Reels; 