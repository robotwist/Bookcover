import PatternDetectionService from '../PatternDetectionService';

describe('PatternDetectionService', () => {
  let patternDetectionService;
  let mockElement;

  beforeEach(() => {
    // Reset the singleton instance
    PatternDetectionService.instance = null;
    patternDetectionService = new PatternDetectionService();
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
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
      const selector = '#test-element';
      mockElement.id = 'test-element';
      
      const result = await patternDetectionService.findElement(selector);
      expect(result).toBe(mockElement);
    });

    it('should find element after a delay', async () => {
      const selector = '#delayed-element';
      setTimeout(() => {
        mockElement.id = 'delayed-element';
      }, 100);

      const result = await patternDetectionService.findElement(selector);
      expect(result).toBe(mockElement);
    });

    it('should timeout if element not found', async () => {
      const selector = '#nonexistent-element';
      await expect(patternDetectionService.findElement(selector))
        .rejects
        .toThrow('Element not found');
    });
  });

  describe('observeElement', () => {
    it('should observe element mutations', () => {
      const callback = jest.fn();
      patternDetectionService.observeElement(mockElement, callback);
      
      mockElement.innerHTML = '<div>New content</div>';
      expect(callback).toHaveBeenCalled();
    });

    it('should handle multiple observers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      patternDetectionService.observeElement(mockElement, callback1);
      patternDetectionService.observeElement(mockElement, callback2);
      
      mockElement.innerHTML = '<div>New content</div>';
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', () => {
      const callback = jest.fn();
      patternDetectionService.observeElement(mockElement, callback);
      
      patternDetectionService.disconnect();
      mockElement.innerHTML = '<div>New content</div>';
      expect(callback).not.toHaveBeenCalled();
    });
  });
}); 