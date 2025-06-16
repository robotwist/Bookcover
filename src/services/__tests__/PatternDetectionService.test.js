import PatternDetectionService from '../PatternDetectionService';

// Mock MutationObserver
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observedElements = new Set();
    this.observing = false;
  }

  observe(element, options) {
    this.observedElements.add(element);
    this.observing = true;
  }

  disconnect() {
    this.observedElements.clear();
    this.observing = false;
  }

  // Helper method to simulate mutations
  simulateMutation(mutations) {
    if (this.observing) {
      this.callback(mutations, this);
    }
  }
}

global.MutationObserver = MockMutationObserver;

describe('PatternDetectionService', () => {
  let patternDetectionService;

  beforeEach(async () => {
    PatternDetectionService.instance = null;
    patternDetectionService = PatternDetectionService.getInstance();
    await patternDetectionService.initialize();
  });

  afterEach(() => {
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

      const foundElement = await patternDetectionService.findElement('[role="feed"]');
      expect(foundElement).toEqual(element);

      document.body.removeChild(element);
    });

    it('should find element after a delay', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');

      const findPromise = patternDetectionService.findElement('[role="feed"]');
      
      // Wait a bit before adding the element
      await new Promise(resolve => setTimeout(resolve, 100));
      document.body.appendChild(element);

      const foundElement = await findPromise;
      expect(foundElement).toEqual(element);

      // Clean up
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    it('should timeout if element not found', async () => {
      await expect(patternDetectionService.findElement('#nonexistent', 100))
        .rejects
        .toThrow('Element not found for selector: #nonexistent');
    });
  });

  describe('observeElement', () => {
    it('should observe element mutations', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');
      document.body.appendChild(element);

      const callback = jest.fn();
      const observer = patternDetectionService.observeElement(element, callback);

      // Simulate mutation
      const mutations = [{ type: 'childList' }];
      const mockObserver = {
        callback,
        observedElements: new Set([element]),
        observing: true,
        simulateMutation: (muts) => callback(muts, mockObserver)
      };

      mockObserver.simulateMutation(mutations);
      expect(callback).toHaveBeenCalledWith(mutations, mockObserver);

      document.body.removeChild(element);
    });

    it('should handle multiple observers', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');
      document.body.appendChild(element);

      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const observer = patternDetectionService.observeElement(element, callback1);
      patternDetectionService.observeElement(element, callback2);

      // Simulate mutation
      const mutations = [{ type: 'childList' }];
      const mockObserver = {
        callback: callback1,
        observedElements: new Set([element]),
        observing: true,
        simulateMutation: (muts) => {
          callback1(muts, mockObserver);
          callback2(muts, mockObserver);
        }
      };

      mockObserver.simulateMutation(mutations);
      expect(callback1).toHaveBeenCalledWith(mutations, mockObserver);
      expect(callback2).toHaveBeenCalledWith(mutations, mockObserver);

      document.body.removeChild(element);
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const mockObserver = {
        observing: true,
        disconnect: jest.fn()
      };
      patternDetectionService.observer = mockObserver;
      patternDetectionService.disconnect();

      expect(mockObserver.disconnect).toHaveBeenCalled();
      expect(mockObserver.observing).toBe(true);

      document.body.removeChild(element);
    });
  });
}); 