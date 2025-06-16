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
      const patternDetectionInitialized = await this.patternDetection.initialize();
      if (!patternDetectionInitialized) {
        throw new Error('Failed to initialize pattern detection');
      }

      // Initialize components
      this.initializeComponents();

      // Initialize each component
      const [feedInitialized, reelsInitialized, storiesInitialized] = await Promise.all([
        this.feed.initialize(),
        this.reels.initialize(),
        this.stories.initialize()
      ]);

      if (!feedInitialized || !reelsInitialized || !storiesInitialized) {
        throw new Error('Failed to initialize one or more components');
      }

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
    if (!this.feed) {
      throw new Error('Feed component not initialized');
    }
    return this.feed.hide();
  }

  async hideReels() {
    if (!this.reels) {
      throw new Error('Reels component not initialized');
    }
    return this.reels.hide();
  }

  async hideStories() {
    if (!this.stories) {
      throw new Error('Stories component not initialized');
    }
    return this.stories.hide();
  }

  async showDistractions() {
    if (!this.feed || !this.reels || !this.stories) {
      throw new Error('Components not initialized');
    }
    await Promise.all([
      this.feed.show(),
      this.reels.show(),
      this.stories.show()
    ]);
  }

  async hideDistractions() {
    if (!this.feed || !this.reels || !this.stories) {
      throw new Error('Components not initialized');
    }
    await Promise.all([
      this.feed.hide(),
      this.reels.hide(),
      this.stories.hide()
    ]);
  }

  async isFeedHidden() {
    if (!this.feed) {
      throw new Error('Feed component not initialized');
    }
    return this.feed.isHidden();
  }

  async isReelsHidden() {
    if (!this.reels) {
      throw new Error('Reels component not initialized');
    }
    return this.reels.isHidden();
  }

  async isStoriesHidden() {
    if (!this.stories) {
      throw new Error('Stories component not initialized');
    }
    return this.stories.isHidden();
  }
}

export default FacebookPage;
