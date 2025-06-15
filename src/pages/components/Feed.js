/**
 * Feed - Component for handling Facebook feed elements
 */
class Feed {
  constructor() {
    this.selectors = {
      main: '[role="feed"]',
      feedUnit: 'div[data-pagelet^="FeedUnit_"]',
      sponsored: '[aria-label="Sponsored"]'
    };
  }

  async hide() {
    try {
      const elements = await this.findElements();
      elements.forEach(el => {
        el.style.display = 'none';
      });
      return true;
    } catch (error) {
      console.error('Feed: Error hiding elements:', error);
      return false;
    }
  }

  async isHidden() {
    try {
      const elements = await this.findElements();
      if (elements.length === 0) {
        return false;
      }
      return elements.every(el => el.style.display === 'none');
    } catch (error) {
      console.error('Feed: Error checking hidden state:', error);
      return false;
    }
  }

  async findElements() {
    const elements = [];
    for (const selector of Object.values(this.selectors)) {
      const found = document.querySelectorAll(selector);
      elements.push(...found);
    }
    return elements;
  }
}

export default Feed; 