import Feed from '../../src/pages/components/Feed';
import ConfigService from '../../src/services/ConfigService';
import PatternDetectionService from '../../src/services/PatternDetectionService';

jest.mock('../../src/services/ConfigService');
jest.mock('../../src/services/PatternDetectionService');

describe('Feed Component', () => {
  let feed;
  let mockConfigService;
  let mockPatternDetectionService;
  let mockFeedElement;

  beforeEach(async () => {
    mockConfigService = {
      getInstance: jest.fn().mockReturnThis(),
      getSelector: jest.fn().mockReturnValue('[role="feed"]'),
      loadConfig: jest.fn().mockResolvedValue(true)
    };
    ConfigService.getInstance.mockReturnValue(mockConfigService);

    mockPatternDetectionService = {
      getInstance: jest.fn().mockReturnThis(),
      initialize: jest.fn().mockResolvedValue(true),
      findElement: jest.fn()
    };
    PatternDetectionService.getInstance.mockReturnValue(mockPatternDetectionService);

    mockFeedElement = document.createElement('div');
    mockFeedElement.setAttribute('role', 'feed');
    document.body.appendChild(mockFeedElement);

    feed = new Feed();
    await feed.initialize();
  });

  afterEach(() => {
    if (mockFeedElement && mockFeedElement.parentNode) {
      mockFeedElement.parentNode.removeChild(mockFeedElement);
    }
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(mockConfigService.getSelector).toHaveBeenCalledWith('feed');
  });

  it('should correctly identify hidden state', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await feed.hide();
    const isHidden = await feed.isHidden();
    expect(isHidden).toBe(true);
  });

  it('should handle missing elements gracefully', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(null);
    const result = await feed.hide();
    expect(result).toBe(false);
  });
});
