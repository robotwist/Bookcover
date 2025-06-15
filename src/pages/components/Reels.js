/**
 * Reels - Component for handling Facebook Reels elements
 */
class Reels {
  constructor() {
    this.selectors = {
      main: 'div[aria-label="Reels"]',
      link: 'a[href*="reels"]',
      container: 'div[data-pagelet="Reels"]'
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
      console.error('Reels: Error hiding elements:', error);
      return false;
    }
  }

  async isHidden() {
    try {
      const elements = await this.findElements();
      return elements.every(el => el.style.display === 'none');
    } catch (error) {
      console.error('Reels: Error checking hidden state:', error);
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

export default Reels; 