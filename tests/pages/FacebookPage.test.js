import FacebookPage from '../../src/pages/FacebookPage';
import ConfigService from '../../src/services/ConfigService';
import PatternDetectionService from '../../src/services/PatternDetectionService';

jest.mock('../../src/services/ConfigService');
jest.mock('../../src/services/PatternDetectionService');

describe('FacebookPage', () => {
  let facebookPage;
  let mockConfigService;
  let mockPatternDetectionService;
  let mockFeedElement;
  let mockReelsElement;

  beforeEach(() => {
    // Reset singleton instances
    ConfigService.instance = null;
    PatternDetectionService.instance = null;

    // Create mock instances
    mockConfigService = {
      getSelector: jest.fn().mockImplementation((key) => {
        const selectors = {
          feed: '[role="feed"]',
          reels: '[role="region"][aria-label*="Reels"]',
          stories: '[role="region"][aria-label*="Stories"]'
        };
        return selectors[key];
      }),
      getConfig: jest.fn().mockReturnValue({
        selectors: {
          feed: '[role="feed"]',
          reels: '[role="region"][aria-label*="Reels"]',
          stories: '[role="region"][aria-label*="Stories"]'
        }
      })
    };
    mockPatternDetectionService = {
      findElement: jest.fn(),
      observeElement: jest.fn(),
      disconnect: jest.fn()
    };

    // Mock static getInstance methods
    ConfigService.getInstance = jest.fn().mockReturnValue(mockConfigService);
    PatternDetectionService.getInstance = jest.fn().mockReturnValue(mockPatternDetectionService);

    // Create mock DOM elements
    mockFeedElement = document.createElement('div');
    mockFeedElement.setAttribute('role', 'feed');
    document.body.appendChild(mockFeedElement);

    mockReelsElement = document.createElement('div');
    mockReelsElement.setAttribute('role', 'region');
    mockReelsElement.setAttribute('aria-label', 'Reels');
    document.body.appendChild(mockReelsElement);

    facebookPage = new FacebookPage();
  });

  afterEach(() => {
    if (mockFeedElement && mockFeedElement.parentNode) {
      mockFeedElement.parentNode.removeChild(mockFeedElement);
    }
    if (mockReelsElement && mockReelsElement.parentNode) {
      mockReelsElement.parentNode.removeChild(mockReelsElement);
    }
    jest.clearAllMocks();
  });

  it('should initialize components', () => {
    expect(facebookPage.feed).toBeDefined();
    expect(facebookPage.reels).toBeDefined();
    expect(facebookPage.stories).toBeDefined();
  });

  it('should hide feed elements', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await facebookPage.hideFeed();
    expect(mockFeedElement.style.display).toBe('none');
  });

  it('should hide reels elements', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockReelsElement);
    await facebookPage.hideReels();
    expect(mockReelsElement.style.display).toBe('none');
  });

  it('should handle errors gracefully', async () => {
    mockPatternDetectionService.findElement.mockRejectedValue(new Error('Test error'));
    await expect(facebookPage.hideFeed()).resolves.not.toThrow();
    await expect(facebookPage.hideReels()).resolves.not.toThrow();
  });
});
