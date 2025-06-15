/**
 * ConfigService - Manages configuration and selectors for the extension
 */
class ConfigService {
  constructor() {
    this.config = null;
    this.lastUpdate = null;
    this.UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  }

  async getConfig() {
    if (!this.config || this.shouldUpdate()) {
      await this.updateConfig();
    }
    return this.config;
  }

  async updateConfig() {
    try {
      const response = await chrome.storage.sync.get(['selectors', 'keywords']);
      this.config = response;
      this.lastUpdate = Date.now();
    } catch (error) {
      console.error('ConfigService: Failed to update config:', error);
      // Fallback to default config
      this.config = this.getDefaultConfig();
    }
  }

  shouldUpdate() {
    return !this.lastUpdate || (Date.now() - this.lastUpdate > this.UPDATE_INTERVAL);
  }

  getDefaultConfig() {
    return {
      selectors: {
        feed: {
          main: '[role="feed"]',
          feedUnit: 'div[data-pagelet^="FeedUnit_"]',
          sponsored: '[aria-label="Sponsored"]',
        },
        reels: {
          main: 'div[aria-label="Reels"]',
          link: 'a[href*="reels"]',
          container: 'div[data-pagelet="Reels"]',
        },
        stories: {
          main: '[aria-label="Stories"]',
          create: '[aria-label="Create a story"]',
          container: 'div[data-pagelet="Stories"]',
        },
      },
      keywords: [
        'Sponsored',
        'Reels',
        'Suggested for You',
        'Watch',
        'Stories',
        'Marketplace',
        'Gaming',
      ],
    };
  }
}

export default new ConfigService();
