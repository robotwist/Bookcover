import Reels from '../Reels';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Reels', () => {
  let reels;
  let mockElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);

    ConfigService.getInstance.mockReturnValue({
      getSelector: jest.fn().mockReturnValue('[data-testid="reels"]'),
    });

    PatternDetectionService.getInstance.mockReturnValue({
      findElement: jest.fn().mockResolvedValue(mockElement),
    });

    reels = new Reels();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('hide', () => {
    it('should hide the reels element', async () => {
      await reels.hide();
      expect(mockElement.style.display).toBe('none');
    });

    it('should initialize if not already initialized', async () => {
      reels.reelsContainer = null;
      await reels.hide();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
      expect(mockElement.style.display).toBe('none');
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      reels.reelsContainer = null;
      const result = await reels.hide();
      expect(result).toBe(false);
    });
  });

  describe('show', () => {
    it('should show the reels element', async () => {
      await reels.show();
      expect(mockElement.style.display).toBe('block');
    });

    it('should initialize if not already initialized', async () => {
      reels.reelsContainer = null;
      await reels.show();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
      expect(mockElement.style.display).toBe('block');
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      reels.reelsContainer = null;
      const result = await reels.show();
      expect(result).toBe(false);
    });
  });

  describe('isHidden', () => {
    it('should return true when reels is hidden', async () => {
      mockElement.style.display = 'none';
      const result = await reels.isHidden();
      expect(result).toBe(true);
    });

    it('should return false when reels is visible', async () => {
      mockElement.style.display = 'block';
      const result = await reels.isHidden();
      expect(result).toBe(false);
    });

    it('should initialize if not already initialized', async () => {
      reels.reelsContainer = null;
      await reels.isHidden();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      reels.reelsContainer = null;
      const result = await reels.isHidden();
      expect(result).toBe(false);
    });
  });
}); 