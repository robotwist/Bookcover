import Feed from '../Feed';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

// Mock the services
jest.mock('../../../services/ConfigService', () => ({
  getInstance: jest.fn().mockReturnValue({
    getSelector: jest.fn().mockReturnValue('[role="feed"]'),
  }),
}));

jest.mock('../../../services/PatternDetectionService', () => ({
  getInstance: jest.fn().mockReturnValue({
    mockFindElement: jest.fn(), // will assign to findElement in beforeEach
  }),
}));

describe('Feed Component', () => {
  let feed;
  let mockElement;
  let patternDetectionInstance;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.setAttribute('role', 'feed');
    document.body.appendChild(mockElement);
    
    patternDetectionInstance = PatternDetectionService.getInstance();
    patternDetectionInstance.findElement = jest.fn(() => Promise.resolve(mockElement));
    feed = new Feed();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(ConfigService.getInstance).toHaveBeenCalled();
    expect(PatternDetectionService.getInstance).toHaveBeenCalled();
  });

  it('should hide feed elements', async () => {
    await feed.hide();
    expect(mockElement.style.display).toBe('none');
  });

  it('should show feed elements', async () => {
    mockElement.style.display = 'none';
    await feed.show();
    expect(mockElement.style.display).toBe('block');
  });

  it('should correctly identify hidden state', async () => {
    mockElement.style.display = 'none';
    expect(await feed.isHidden()).toBe(true);
    
    mockElement.style.display = 'block';
    expect(await feed.isHidden()).toBe(false);
  });

  it('should handle missing elements gracefully', async () => {
    document.body.removeChild(mockElement);
    await expect(feed.hide()).resolves.not.toThrow();
    await expect(feed.show()).resolves.not.toThrow();
    await expect(feed.isHidden()).resolves.toBe(false);
  });
}); 