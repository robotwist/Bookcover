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
      this.config = await response.json();
      return true;
    } catch (error) {
      console.error('Bookcover: Error loading config:', error);
      return false;
    }
  }

  getSelector(key) {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    return this.config.selectors[key];
  }

  getConfig() {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    return this.config;
  }
}

export default ConfigService;

