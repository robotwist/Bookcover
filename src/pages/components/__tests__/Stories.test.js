import Stories from '../Stories';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

// Mock the services
jest.mock('../../../services/ConfigService', () => ({
  getInstance: jest.fn().mockReturnValue({
    getSelector: jest.fn().mockReturnValue('[role="region"][aria-label*="Stories"]'),
  }),
}));

jest.mock('../../../services/PatternDetectionService', () => ({
  getInstance: jest.fn().mockReturnValue({
    mockFindElement: jest.fn(), // will assign to findElement in beforeEach
  }),
}));

describe('Stories Component', () => {
  let stories;
  let mockElement;
  let patternDetectionInstance;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.setAttribute('role', 'region');
    mockElement.setAttribute('aria-label', 'Stories');
    document.body.appendChild(mockElement);
    
    patternDetectionInstance = PatternDetectionService.getInstance();
    patternDetectionInstance.findElement = jest.fn(() => Promise.resolve(mockElement));
    stories = new Stories();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(ConfigService.getInstance).toHaveBeenCalled();
    expect(PatternDetectionService.getInstance).toHaveBeenCalled();
  });

  it('should hide stories elements', async () => {
    await stories.hide();
    expect(mockElement.style.display).toBe('none');
  });

  it('should show stories elements', async () => {
    mockElement.style.display = 'none';
    await stories.show();
    expect(mockElement.style.display).toBe('block');
  });

  it('should correctly identify hidden state', async () => {
    mockElement.style.display = 'none';
    expect(await stories.isHidden()).toBe(true);
    
    mockElement.style.display = 'block';
    expect(await stories.isHidden()).toBe(false);
  });

  it('should handle missing elements gracefully', async () => {
    document.body.removeChild(mockElement);
    await expect(stories.hide()).resolves.not.toThrow();
    await expect(stories.show()).resolves.not.toThrow();
    await expect(stories.isHidden()).resolves.toBe(false);
  });
}); 