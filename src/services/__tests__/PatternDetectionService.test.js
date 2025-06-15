import PatternDetectionService from '../PatternDetectionService';

// Mock MutationObserver
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observedElements = new Set();
  }

  observe(element, options) {
    this.observedElements.add(element);
  }

  disconnect() {
    this.observedElements.clear();
  }

  // Helper method to simulate mutations
  simulateMutation(element) {
    if (this.observedElements.has(element)) {
      this.callback([{ target: element }]);
    }
  }
}

global.MutationObserver = MockMutationObserver;

describe('PatternDetectionService', () => {
  let patternDetectionService;

  beforeEach(() => {
    patternDetectionService = PatternDetectionService.getInstance();
    patternDetectionService.knownPatterns.clear();
    patternDetectionService.stopObserving();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = PatternDetectionService.getInstance();
      const instance2 = PatternDetectionService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('findElement', () => {
    it('should find element immediately if present', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');
      document.body.appendChild(element);

      const result = await patternDetectionService.findElement('[role="feed"]');
      expect(result).not.toBeNull();
      expect(result.getAttribute('role')).toBe('feed');
      expect(result.outerHTML).toBe(element.outerHTML);

      document.body.removeChild(element);
    });

    it('should find element after a delay', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');

      setTimeout(() => {
        document.body.appendChild(element);
      }, 100);

      const result = await patternDetectionService.findElement('[role="feed"]');
      expect(result).not.toBeNull();
      expect(result.getAttribute('role')).toBe('feed');
      expect(result.outerHTML).toBe(element.outerHTML);

      document.body.removeChild(element);
    });

    it('should timeout if element not found', async () => {
      const result = await patternDetectionService.findElement('[role="nonexistent"]');
      expect(result).toBeNull();
    });
  });

  describe('observeElement', () => {
    it('should observe element mutations', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');
      document.body.appendChild(element);

      const callback = jest.fn();
      await patternDetectionService.observeElement(element, callback);

      const observer = patternDetectionService.observer;
      expect(observer).toBeDefined();
      expect(observer.observing).toBe(true);

      const mutations = [{ type: 'childList' }];
      observer.simulateMutation(mutations);

      expect(callback).toHaveBeenCalledWith(mutations, observer);

      document.body.removeChild(element);
    });

    it('should handle multiple observers', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');
      document.body.appendChild(element);

      const callback1 = jest.fn();
      const callback2 = jest.fn();

      await patternDetectionService.observeElement(element, callback1);
      await patternDetectionService.observeElement(element, callback2);

      const observer = patternDetectionService.observer;
      const mutations = [{ type: 'childList' }];
      observer.simulateMutation(mutations);

      expect(callback1).toHaveBeenCalledWith(mutations, observer);
      expect(callback2).toHaveBeenCalledWith(mutations, observer);

      document.body.removeChild(element);
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');
      document.body.appendChild(element);

      const callback = jest.fn();
      await patternDetectionService.observeElement(element, callback);

      patternDetectionService.disconnect();

      const observer = patternDetectionService.observer;
      expect(observer.observing).toBe(false);

      const mutations = [{ type: 'childList' }];
      observer.simulateMutation(mutations);

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(element);
    });
  });
}); 