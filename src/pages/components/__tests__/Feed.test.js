import Feed from '../Feed';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Feed', () => {
  let feed;
  let mockElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);

    ConfigService.getInstance.mockReturnValue({
      getSelector: jest.fn().mockReturnValue('[data-testid="feed"]'),
    });

    PatternDetectionService.getInstance.mockReturnValue({
      findElement: jest.fn().mockResolvedValue(mockElement),
    });

    feed = new Feed();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('hide', () => {
    it('should hide the feed element', async () => {
      await feed.hide();
      expect(mockElement.style.display).toBe('none');
    });

    it('should initialize if not already initialized', async () => {
      feed.feedContainer = null;
      await feed.hide();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
      expect(mockElement.style.display).toBe('none');
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      feed.feedContainer = null;
      const result = await feed.hide();
      expect(result).toBe(false);
    });
  });

  describe('show', () => {
    it('should show the feed element', async () => {
      await feed.show();
      expect(mockElement.style.display).toBe('block');
    });

    it('should initialize if not already initialized', async () => {
      feed.feedContainer = null;
      await feed.show();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
      expect(mockElement.style.display).toBe('block');
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      feed.feedContainer = null;
      const result = await feed.show();
      expect(result).toBe(false);
    });
  });

  describe('isHidden', () => {
    it('should return true when feed is hidden', async () => {
      mockElement.style.display = 'none';
      const result = await feed.isHidden();
      expect(result).toBe(true);
    });

    it('should return false when feed is visible', async () => {
      mockElement.style.display = 'block';
      const result = await feed.isHidden();
      expect(result).toBe(false);
    });

    it('should initialize if not already initialized', async () => {
      feed.feedContainer = null;
      await feed.isHidden();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      feed.feedContainer = null;
      const result = await feed.isHidden();
      expect(result).toBe(false);
    });
  });
}); 