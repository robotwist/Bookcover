import Feed from '../Feed';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Feed Component', () => {
  let feed;
  let mockConfigService;
  let mockPatternDetectionService;
  let mockFeedElement;
  let mockPostElement;

  beforeEach(() => {
    // Reset singleton instances
    ConfigService.instance = null;
    PatternDetectionService.instance = null;

    // Create mock instances
    mockConfigService = {
      getSelector: jest.fn().mockReturnValue('[role="feed"]'),
      getConfig: jest.fn().mockReturnValue({
        selectors: { feed: '[role="feed"]' },
        keywords: {
          friend_family: ['Friend', 'Close Friend', 'Family', 'Following'],
          suggested: ['Suggested for you', 'Suggested Group', 'Suggested Page']
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

    mockPostElement = document.createElement('div');
    mockPostElement.setAttribute('data-pagelet', 'FeedUnit_123');
    mockFeedElement.appendChild(mockPostElement);

    feed = new Feed();
  });

  afterEach(() => {
    if (mockFeedElement && mockFeedElement.parentNode) {
      mockFeedElement.parentNode.removeChild(mockFeedElement);
    }
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(feed.feedSelector).toBe('[role="feed"]');
  });

  it('should set up mutation observer on initialization', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await feed.initialize();
    
    // Simulate a new post being added
    const newPost = document.createElement('div');
    newPost.setAttribute('data-pagelet', 'FeedUnit_456');
    newPost.textContent = 'Friend post';
    mockFeedElement.appendChild(newPost);

    // Wait for the next tick to allow the observer to process
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // The post should be visible since it's a friend post
    expect(newPost.style.display).not.toBe('none');
  });

  it('should show friend/family posts', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await feed.initialize();

    const friendPost = document.createElement('div');
    friendPost.setAttribute('data-pagelet', 'FeedUnit_789');
    friendPost.textContent = 'Friend post';
    mockFeedElement.appendChild(friendPost);

    await feed.hide(); // This now filters instead of hiding
    expect(friendPost.style.display).not.toBe('none');
  });

  it('should hide suggested content', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await feed.initialize();

    const suggestedPost = document.createElement('div');
    suggestedPost.setAttribute('data-pagelet', 'FeedUnit_101');
    suggestedPost.textContent = 'Suggested for you';
    mockFeedElement.appendChild(suggestedPost);

    await feed.hide(); // This now filters instead of hiding
    expect(suggestedPost.style.display).toBe('none');
  });

  it('should hide non-friend posts', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await feed.initialize();

    const nonFriendPost = document.createElement('div');
    nonFriendPost.setAttribute('data-pagelet', 'FeedUnit_202');
    nonFriendPost.textContent = 'Random post';
    mockFeedElement.appendChild(nonFriendPost);

    await feed.hide(); // This now filters instead of hiding
    expect(nonFriendPost.style.display).toBe('none');
  });

  it('should show all posts when show() is called', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockFeedElement);
    await feed.initialize();

    const friendPost = document.createElement('div');
    friendPost.setAttribute('data-pagelet', 'FeedUnit_303');
    friendPost.textContent = 'Friend post';
    mockFeedElement.appendChild(friendPost);

    const suggestedPost = document.createElement('div');
    suggestedPost.setAttribute('data-pagelet', 'FeedUnit_404');
    suggestedPost.textContent = 'Suggested for you';
    mockFeedElement.appendChild(suggestedPost);

    await feed.hide(); // First filter the posts
    await feed.show(); // Then show all posts

    expect(friendPost.style.display).not.toBe('none');
    expect(suggestedPost.style.display).not.toBe('none');
  });

  it('should handle missing elements gracefully', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(null);
    const result = await feed.hide();
    expect(result).toBe(false);
  });
}); 