/**
 * ConfigService - Singleton service for managing configuration
 * Handles loading and accessing configuration data
 */
class ConfigService {
  constructor() {
    if (ConfigService.instance) {
      return ConfigService.instance;
    }
    this.config = null;
    this.defaultConfig = {
      selectors: {
        feed: '[role="feed"]',
        stories: '[role="complementary"]',
        reels: '[role="navigation"]',
        sponsored: '[aria-label="Sponsored"]'
      },
      patterns: {
        feed: {
          selectors: ['[role="feed"]'],
          content: 'Content',
          structure: []
        }
      }
    };
    ConfigService.instance = this;
  }

  static getInstance() {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadConfig() {
    try {
      const response = await fetch(chrome.runtime.getURL('config.json'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const loadedConfig = await response.json();
      this.config = { ...this.defaultConfig, ...loadedConfig };
      console.log('Bookcover: Config loaded successfully');
      return true;
    } catch (error) {
      console.warn('Bookcover: Using default configuration due to error:', error);
      this.config = null;
      return false;
    }
  }

  getSelector(key) {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    const selector = this.config.selectors[key];
    if (!selector) {
      throw new Error(`Selector not found for key: ${key}`);
    }
    return selector;
  }

  getConfig() {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    return this.config;
  }
}

export default ConfigService;

