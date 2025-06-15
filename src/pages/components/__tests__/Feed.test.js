import Feed from '../Feed';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Feed Component', () => {
  let feed;
  let mockConfigService;
  let mockPatternDetectionService;
  let mockElement;

  beforeEach(() => {
    // Reset singleton instances
    ConfigService.instance = null;
    PatternDetectionService.instance = null;

    // Create mock instances
    mockConfigService = {
      getSelector: jest.fn().mockReturnValue('[role="feed"]'),
      getConfig: jest.fn().mockReturnValue({ selectors: { feed: '[role="feed"]' } })
    };
    mockPatternDetectionService = {
      findElement: jest.fn(),
      observeElement: jest.fn(),
      disconnect: jest.fn()
    };

    // Mock static getInstance methods
    ConfigService.getInstance = jest.fn().mockReturnValue(mockConfigService);
    PatternDetectionService.getInstance = jest.fn().mockReturnValue(mockPatternDetectionService);

    // Create mock DOM element
    mockElement = document.createElement('div');
    mockElement.setAttribute('role', 'feed');
    document.body.appendChild(mockElement);

    feed = new Feed();
  });

  afterEach(() => {
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(feed.feedSelector).toBe('[role="feed"]');
  });

  it('should hide feed elements', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockElement);
    await feed.hide();
    expect(mockElement.style.display).toBe('none');
  });

  it('should correctly identify hidden state', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockElement);
    await feed.hide();
    expect(feed.isHidden()).toBe(true);
  });

  it('should handle missing elements gracefully', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(null);
    await feed.hide();
    expect(feed.isHidden()).toBe(false);
  });
}); 