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
  let mockStoriesElement;

  beforeEach(async () => {
    mockConfigService = {
      getInstance: jest.fn().mockReturnThis(),
      getSelector: jest.fn().mockImplementation((key) => `[role="${key}"]`),
      loadConfig: jest.fn().mockResolvedValue(true),
      getConfig: jest.fn().mockReturnValue({
        selectors: {
          feed: '[role="feed"]',
          reels: '[role="navigation"]',
          stories: '[role="complementary"]'
        },
        keywords: {
          friend_family: ['Friend', 'Close Friend', 'Family', 'Following'],
          suggested: ['Suggested for you', 'Suggested Group', 'Suggested Page']
        }
      })
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
    mockReelsElement = document.createElement('div');
    mockReelsElement.setAttribute('role', 'navigation');
    mockStoriesElement = document.createElement('div');
    mockStoriesElement.setAttribute('role', 'complementary');

    facebookPage = new FacebookPage();
    await facebookPage.initialize();
  });

  it('should initialize components', () => {
    expect(facebookPage.feed).toBeDefined();
    expect(facebookPage.reels).toBeDefined();
    expect(facebookPage.stories).toBeDefined();
  });

  it('should filter feed elements', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    
    // Add a friend post
    const friendPost = document.createElement('div');
    friendPost.setAttribute('data-pagelet', 'FeedUnit_123');
    friendPost.textContent = 'Friend post';
    mockFeedElement.appendChild(friendPost);

    // Add a suggested post
    const suggestedPost = document.createElement('div');
    suggestedPost.setAttribute('data-pagelet', 'FeedUnit_456');
    suggestedPost.textContent = 'Suggested for you';
    mockFeedElement.appendChild(suggestedPost);

    await facebookPage.hideFeed();
    
    // Friend post should be visible, suggested post should be hidden
    expect(friendPost.style.display).not.toBe('none');
    expect(suggestedPost.style.display).toBe('none');
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
