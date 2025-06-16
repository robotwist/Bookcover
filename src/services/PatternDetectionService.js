import { debounce } from '../utils/helpers';

/**
 * PatternDetectionService - Detects and adapts to Facebook's DOM changes
 */
class PatternDetectionService {
  constructor() {
    if (PatternDetectionService.instance) {
      return PatternDetectionService.instance;
    }
    this.knownPatterns = new Map();
    this.observationCount = new Map();
    this.observer = null;
    this.callbacks = new Set();
    this.DETECTION_THRESHOLD = 3; // Number of observations before considering a pattern valid
    this.initialized = false;
    PatternDetectionService.instance = this;
  }

  static getInstance() {
    if (!PatternDetectionService.instance) {
      PatternDetectionService.instance = new PatternDetectionService();
    }
    return PatternDetectionService.instance;
  }

  /**
   * Initialize the pattern detection service
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      if (this.initialized) {
        return true;
      }

      // Clear any existing patterns and observers
      this.knownPatterns.clear();
      this.observationCount.clear();
      this.stopObserving();

      // Start observing DOM changes
      this.startObserving();
      
      this.initialized = true;
      console.log('Bookcover: Pattern detection initialized');
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing pattern detection:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Find an element in the DOM, waiting for it to appear if necessary
   * @param {string} selector - The CSS selector to find the element
   * @param {number} timeout - Maximum time to wait in milliseconds
   * @returns {Promise<Element|null>} - The found element or null if not found
   */
  async findElement(selector, timeout = 5000) {
    if (!this.initialized) {
      throw new Error('PatternDetectionService not initialized');
    }
    try {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) {
          return element;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      throw new Error(`Element not found for selector: ${selector}`);
    } catch (error) {
      console.error('Bookcover: Error finding element:', error);
      throw error;
    }
  }

  /**
   * Observe an element for mutations
   * @param {Element} element - The element to observe
   * @param {Function} callback - Callback to execute when mutations occur
   */
  observeElement(element, callback) {
    if (!this.observer) {
      this.observer = new MutationObserver(
        debounce(() => {
          this.callbacks.forEach(cb => cb());
        }, 1000)
      );
    }

    this.callbacks.add(callback);
    this.observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'aria-label'],
    });
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      this.callbacks.clear();
    }
  }

  /**
   * Start observing DOM changes
   */
  startObserving() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver(
      debounce(() => this.analyzeChanges(), 1000),
    );

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'aria-label'],
    });
  }

  /**
   * Analyze DOM changes and update patterns
   */
  async analyzeChanges() {
    const newElements = this.findNewElements();
    for (const element of newElements) {
      const signature = this.getElementSignature(element);
      this.updatePattern(signature, element);
    }
  }

  /**
   * Find elements that might be new distractions
   */
  findNewElements() {
    const potentialElements = [];
    const keywords = ['feed', 'reel', 'story', 'sponsored', 'suggested'];

    document.querySelectorAll('div[role], div[aria-label], div[data-pagelet]').forEach((element) => {
      const text = element.textContent.toLowerCase();
      const attributes = this.getElementAttributes(element);

      if (keywords.some((keyword) => text.includes(keyword)
        || attributes.some((attr) => attr.includes(keyword)))) {
        potentialElements.push(element);
      }
    });

    return potentialElements;
  }

  /**
   * Get element attributes that might be relevant for pattern detection
   */
  getElementAttributes(element) {
    const attributes = [];
    if (element.getAttribute('role')) {
      attributes.push(element.getAttribute('role'));
    }
    if (element.getAttribute('aria-label')) {
      attributes.push(element.getAttribute('aria-label'));
    }
    if (element.getAttribute('data-pagelet')) {
      attributes.push(element.getAttribute('data-pagelet'));
    }
    return attributes;
  }

  /**
   * Create a unique signature for an element
   */
  getElementSignature(element) {
    const attributes = this.getElementAttributes(element);
    const structure = this.getElementStructure(element);
    return JSON.stringify({
      attributes,
      structure,
      tag: element.tagName,
    });
  }

  /**
   * Get the DOM structure pattern of an element
   */
  getElementStructure(element) {
    return Array.from(element.children).map((child) => ({
      tag: child.tagName,
      classes: Array.from(child.classList),
    }));
  }

  /**
   * Update the pattern database with new observations
   */
  updatePattern(signature, element) {
    if (!this.knownPatterns.has(signature)) {
      this.knownPatterns.set(signature, {
        selectors: this.generateSelectors(element),
        content: element.textContent,
        structure: this.getElementStructure(element),
      });
      this.observationCount.set(signature, 1);
    } else {
      const count = this.observationCount.get(signature) + 1;
      this.observationCount.set(signature, count);

      if (count >= this.DETECTION_THRESHOLD) {
        this.reportNewPattern(signature);
      }
    }
  }

  /**
   * Generate unique selectors for an element
   */
  generateSelectors(element) {
    const selectors = [];

    // Try ID first
    if (element.id) {
      selectors.push(`#${element.id}`);
    }

    // Then try classes
    if (element.classList.length > 0) {
      element.classList.forEach((cls) => {
        selectors.push(`.${cls}`);
      });
    }

    // Then try role and aria-label
    if (element.getAttribute('role')) {
      selectors.push(`[role="${element.getAttribute('role')}"]`);
    }
    if (element.getAttribute('aria-label')) {
      selectors.push(`[aria-label="${element.getAttribute('aria-label')}"]`);
    }

    return selectors;
  }

  /**
   * Report a new pattern that has been detected multiple times
   */
  reportNewPattern(signature) {
    const pattern = this.knownPatterns.get(signature);
    console.log('Bookcover: New pattern detected:', {
      selectors: pattern.selectors,
      content: pattern.content,
      structure: pattern.structure,
    });

    // Here you could:
    // 1. Update the ConfigService with new selectors
    // 2. Send telemetry data
    // 3. Notify the user
  }

  /**
   * Stop observing DOM changes
   */
  stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export default PatternDetectionService;
