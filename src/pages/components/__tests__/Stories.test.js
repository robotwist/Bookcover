import Stories from '../Stories';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Stories Component', () => {
  let stories;
  let mockConfigService;
  let mockPatternDetectionService;
  let mockElement;

  beforeEach(() => {
    // Reset singleton instances
    ConfigService.instance = null;
    PatternDetectionService.instance = null;

    // Create mock instances
    mockConfigService = {
      getSelector: jest.fn().mockReturnValue('[role="region"][aria-label*="Stories"]'),
      getConfig: jest.fn().mockReturnValue({ selectors: { stories: '[role="region"][aria-label*="Stories"]' } })
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
    mockElement.setAttribute('role', 'region');
    mockElement.setAttribute('aria-label', 'Stories');
    document.body.appendChild(mockElement);

    stories = new Stories();
  });

  afterEach(() => {
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(stories.storiesSelector).toBe('[role="region"][aria-label*="Stories"]');
  });

  it('should hide stories elements', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockElement);
    await stories.hide();
    expect(mockElement.style.display).toBe('none');
  });

  it('should correctly identify hidden state', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockElement);
    await stories.hide();
    expect(stories.isHidden()).toBe(true);
  });

  it('should handle missing elements gracefully', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(null);
    await stories.hide();
    expect(stories.isHidden()).toBe(false);
  });
}); 