import Reels from '../Reels';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

jest.mock('../../../services/ConfigService');
jest.mock('../../../services/PatternDetectionService');

describe('Reels Component', () => {
  let reels;
  let mockConfigService;
  let mockPatternDetectionService;
  let mockElement;

  beforeEach(() => {
    // Reset singleton instances
    ConfigService.instance = null;
    PatternDetectionService.instance = null;

    // Create mock instances
    mockConfigService = {
      getSelector: jest.fn().mockReturnValue('[role="region"]'),
      getConfig: jest.fn().mockReturnValue({ selectors: { reels: '[role="region"]' } })
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
    document.body.appendChild(mockElement);

    reels = new Reels();
  });

  afterEach(() => {
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(reels.reelsSelector).toBe('[role="region"]');
  });

  it('should hide reels elements', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockElement);
    await reels.hide();
    expect(mockElement.style.display).toBe('none');
  });

  it('should correctly identify hidden state', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(mockElement);
    await reels.hide();
    expect(reels.isHidden()).toBe(true);
  });

  it('should handle missing elements gracefully', async () => {
    mockPatternDetectionService.findElement.mockResolvedValue(null);
    await reels.hide();
    expect(reels.isHidden()).toBe(false);
  });
}); 