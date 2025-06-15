import PatternDetectionService from '../PatternDetectionService';

describe('PatternDetectionService', () => {
  let patternDetectionService;
  let mockElement;

  beforeEach(() => {
    PatternDetectionService.instance = null;
    patternDetectionService = new PatternDetectionService();
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
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
      const element = await patternDetectionService.findElement('[data-testid="test"]');
      expect(element).toBe(mockElement);
    });

    it('should find element after a delay', async () => {
      setTimeout(() => {
        const newElement = document.createElement('div');
        newElement.setAttribute('data-testid', 'test');
        document.body.appendChild(newElement);
      }, 100);

      const element = await patternDetectionService.findElement('[data-testid="test"]');
      expect(element).toBeDefined();
    });

    it('should timeout if element not found', async () => {
      await expect(patternDetectionService.findElement('[data-testid="nonexistent"]', 100))
        .rejects
        .toThrow('Element not found: [data-testid="nonexistent"]');
    });
  });

  describe('observeElement', () => {
    it('should observe element mutations', () => {
      const callback = jest.fn();
      patternDetectionService.observeElement(mockElement, callback);

      mockElement.setAttribute('data-test', 'value');
      expect(callback).toHaveBeenCalled();
    });

    it('should handle multiple observers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      patternDetectionService.observeElement(mockElement, callback1);
      patternDetectionService.observeElement(mockElement, callback2);

      mockElement.setAttribute('data-test', 'value');
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', () => {
      const callback = jest.fn();
      patternDetectionService.observeElement(mockElement, callback);
      patternDetectionService.disconnect();

      mockElement.setAttribute('data-test', 'value');
      expect(callback).not.toHaveBeenCalled();
    });
  });
}); 