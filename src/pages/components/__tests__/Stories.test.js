import Stories from '../Stories';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Stories', () => {
  let stories;
  let mockElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);

    ConfigService.getInstance.mockReturnValue({
      getSelector: jest.fn().mockReturnValue('[data-testid="stories"]'),
    });

    PatternDetectionService.getInstance.mockReturnValue({
      findElement: jest.fn().mockResolvedValue(mockElement),
    });

    stories = new Stories();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('hide', () => {
    it('should hide the stories element', async () => {
      await stories.hide();
      expect(mockElement.style.display).toBe('none');
    });

    it('should initialize if not already initialized', async () => {
      stories.storiesContainer = null;
      await stories.hide();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
      expect(mockElement.style.display).toBe('none');
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      stories.storiesContainer = null;
      const result = await stories.hide();
      expect(result).toBe(false);
    });
  });

  describe('show', () => {
    it('should show the stories element', async () => {
      await stories.show();
      expect(mockElement.style.display).toBe('block');
    });

    it('should initialize if not already initialized', async () => {
      stories.storiesContainer = null;
      await stories.show();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
      expect(mockElement.style.display).toBe('block');
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      stories.storiesContainer = null;
      const result = await stories.show();
      expect(result).toBe(false);
    });
  });

  describe('isHidden', () => {
    it('should return true when stories is hidden', async () => {
      mockElement.style.display = 'none';
      const result = await stories.isHidden();
      expect(result).toBe(true);
    });

    it('should return false when stories is visible', async () => {
      mockElement.style.display = 'block';
      const result = await stories.isHidden();
      expect(result).toBe(false);
    });

    it('should initialize if not already initialized', async () => {
      stories.storiesContainer = null;
      await stories.isHidden();
      expect(PatternDetectionService.getInstance().findElement).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      PatternDetectionService.getInstance().findElement.mockRejectedValue(new Error('Test error'));
      stories.storiesContainer = null;
      const result = await stories.isHidden();
      expect(result).toBe(false);
    });
  });
}); 