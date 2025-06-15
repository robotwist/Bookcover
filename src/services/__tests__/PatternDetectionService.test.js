import PatternDetectionService from '../PatternDetectionService';

describe('PatternDetectionService', () => {
  let patternDetectionService;
  let mockElement;

  beforeEach(() => {
    // Reset the singleton instance
    PatternDetectionService.instance = null;
    patternDetectionService = PatternDetectionService.getInstance();
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    patternDetectionService.disconnect();
    jest.clearAllMocks();
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
      expect(result).toBe(element);

      document.body.removeChild(element);
    });

    it('should find element after a delay', async () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'feed');

      setTimeout(() => {
        document.body.appendChild(element);
      }, 100);

      const result = await patternDetectionService.findElement('[role="feed"]');
      expect(result).toBe(element);

      document.body.removeChild(element);
    });

    it('should timeout if element not found', async () => {
      const result = await patternDetectionService.findElement('[role="nonexistent"]', 100);
      expect(result).toBeNull();
    }, 2000); // Increase timeout for this test
  });

  describe('observeElement', () => {
    it('should observe element mutations', async () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const callback = jest.fn();
      patternDetectionService.observeElement(element, callback);

      // Wait for the debounce to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
      element.setAttribute('data-test', 'test');
      await new Promise(resolve => setTimeout(resolve, 1100));

      expect(callback).toHaveBeenCalled();

      document.body.removeChild(element);
    });

    it('should handle multiple observers', async () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const callback1 = jest.fn();
      const callback2 = jest.fn();

      patternDetectionService.observeElement(element, callback1);
      patternDetectionService.observeElement(element, callback2);

      // Wait for the debounce to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
      element.setAttribute('data-test', 'test');
      await new Promise(resolve => setTimeout(resolve, 1100));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      document.body.removeChild(element);
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', async () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const callback = jest.fn();
      patternDetectionService.observeElement(element, callback);
      patternDetectionService.disconnect();

      // Wait for the debounce to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
      element.setAttribute('data-test', 'test');
      await new Promise(resolve => setTimeout(resolve, 1100));

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(element);
    });
  });
}); 