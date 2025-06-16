import Feed from './components/Feed';
import Reels from './components/Reels';
import Stories from './components/Stories';
import ConfigService from '../services/ConfigService';
import PatternDetectionService from '../services/PatternDetectionService';

/**
 * FacebookPage - Main page object for Facebook
 * Handles high-level page interactions and component management
 */
class FacebookPage {
  constructor() {
    this.config = ConfigService.getInstance();
    this.patternDetection = PatternDetectionService.getInstance();
    this.feed = null;
    this.reels = null;
    this.stories = null;
  }

  async initialize() {
    try {
      // Initialize pattern detection first
      await this.patternDetection.initialize();
      
      // Initialize components
      this.initializeComponents();
      
      // Initialize each component
      await Promise.all([
        this.feed.initialize(),
        this.reels.initialize(),
        this.stories.initialize()
      ]);
      
      console.log('Bookcover: Facebook page initialized successfully');
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing Facebook page:', error);
      return false;
    }
  }

  initializeComponents() {
    this.feed = new Feed();
    this.reels = new Reels();
    this.stories = new Stories();
  }

  async hideFeed() {
    try {
      await this.feed.hide();
    } catch (error) {
      console.error('Bookcover: Error hiding feed:', error);
    }
  }

  async hideReels() {
    try {
      await this.reels.hide();
    } catch (error) {
      console.error('Bookcover: Error hiding reels:', error);
    }
  }

  async hideStories() {
    try {
      await this.stories.hide();
    } catch (error) {
      console.error('Bookcover: Error hiding stories:', error);
    }
  }

  async hideDistractions() {
    await Promise.all([
      this.hideFeed(),
      this.hideReels(),
      this.hideStories()
    ]);
  }

  async isFeedHidden() {
    return this.feed.isHidden();
  }

  async isReelsHidden() {
    return this.reels.isHidden();
  }

  async isStoriesHidden() {
    return this.stories.isHidden();
  }
}

export default FacebookPage;
