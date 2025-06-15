import ConfigService from '../../services/ConfigService';
import { safeExecute } from '../../utils/helpers';

/**
 * Stories - Component for handling Facebook Stories elements
 */
class Stories {
  constructor() {
    this.selectors = null;
    this.initializeSelectors();
  }

  async initializeSelectors() {
    const config = await ConfigService.getConfig();
    this.selectors = config.selectors.stories;
  }

  async hide() {
    return await safeExecute(async () => {
      await this.ensureSelectors();
      const elements = await this.findElements();
      elements.forEach(el => {
        el.style.display = 'none';
      });
      return true;
    }, 'Stories: Error hiding elements');
  }

  async isHidden() {
    return await safeExecute(async () => {
      await this.ensureSelectors();
      const elements = await this.findElements();
      if (elements.length === 0) {
        return false;
      }
      return elements.every(el => el.style.display === 'none');
    }, 'Stories: Error checking hidden state');
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

export default Stories; 