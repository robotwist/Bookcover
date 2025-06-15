import ConfigService from '../../services/ConfigService';
import { safeExecute } from '../../utils/helpers';

/**
 * Feed - Component for handling Facebook feed elements
 */
class Feed {
  constructor() {
    this.selectors = null;
    this.initializeSelectors();
  }

  async initializeSelectors() {
    const config = await ConfigService.getConfig();
    this.selectors = config.selectors.feed;
  }

  async hide() {
    return await safeExecute(async () => {
      await this.ensureSelectors();
      const elements = await this.findElements();
      elements.forEach(el => {
        el.style.display = 'none';
      });
      return true;
    }, 'Feed: Error hiding elements');
  }

  async isHidden() {
    return await safeExecute(async () => {
      await this.ensureSelectors();
      const elements = await this.findElements();
      if (elements.length === 0) {
        return false;
      }
      return elements.every(el => el.style.display === 'none');
    }, 'Feed: Error checking hidden state');
  }

  async findElements() {
    await this.ensureSelectors();
    const elements = [];
    for (const selector of Object.values(this.selectors)) {
      const found = document.querySelectorAll(selector);
      elements.push(...found);
    }
    return elements;
  }

  async ensureSelectors() {
    if (!this.selectors) {
      await this.initializeSelectors();
    }
  }
}

export default Feed; 