import Feed from './components/Feed';
import Reels from './components/Reels';
import Stories from './components/Stories';

/**
 * FacebookPage - Main page object for Facebook
 * Handles high-level page interactions and component management
 */
class FacebookPage {
  constructor() {
    this.feed = null;
    this.reels = null;
    this.stories = null;
    this.initializeComponents();
  }

  initializeComponents() {
    this.feed = new Feed();
    this.reels = new Reels();
    this.stories = new Stories();
  }

  async hideDistractions() {
    try {
      await Promise.all([
        this.feed.hide(),
        this.reels.hide(),
        this.stories.hide()
      ]);
      console.log('Bookcover: Distractions hidden successfully');
    } catch (error) {
      console.error('Bookcover: Error hiding distractions:', error);
      throw error;
    }
  }

  async isFeedHidden() {
    return await this.feed.isHidden();
  }

  async isReelsHidden() {
    return await this.reels.isHidden();
  }

  async isStoriesHidden() {
    return await this.stories.isHidden();
  }
}

export default FacebookPage; 