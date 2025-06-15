import Reels from '../Reels';
import ConfigService from '../../../services/ConfigService';
import PatternDetectionService from '../../../services/PatternDetectionService';

// Mock the services
jest.mock('../../../services/ConfigService', () => ({
  getInstance: jest.fn().mockReturnValue({
    getSelector: jest.fn().mockReturnValue('[role="region"][aria-label*="Reels"]'),
  }),
}));

jest.mock('../../../services/PatternDetectionService', () => ({
  getInstance: jest.fn().mockReturnValue({
    mockFindElement: jest.fn(), // will assign to findElement in beforeEach
  }),
}));

describe('Reels Component', () => {
  let reels;
  let mockElement;
  let patternDetectionInstance;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.setAttribute('role', 'region');
    mockElement.setAttribute('aria-label', 'Reels');
    document.body.appendChild(mockElement);
    
    patternDetectionInstance = PatternDetectionService.getInstance();
    patternDetectionInstance.findElement = jest.fn(() => Promise.resolve(mockElement));
    reels = new Reels();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    jest.clearAllMocks();
  });

  it('should initialize with selectors from ConfigService', () => {
    expect(ConfigService.getInstance).toHaveBeenCalled();
    expect(PatternDetectionService.getInstance).toHaveBeenCalled();
  });

  it('should hide reels elements', async () => {
    await reels.hide();
    expect(mockElement.style.display).toBe('none');
  });

  it('should show reels elements', async () => {
    mockElement.style.display = 'none';
    await reels.show();
    expect(mockElement.style.display).toBe('block');
  });

  it('should correctly identify hidden state', async () => {
    mockElement.style.display = 'none';
    expect(await reels.isHidden()).toBe(true);
    
    mockElement.style.display = 'block';
    expect(await reels.isHidden()).toBe(false);
  });

  it('should handle missing elements gracefully', async () => {
    document.body.removeChild(mockElement);
    await expect(reels.hide()).resolves.not.toThrow();
    await expect(reels.show()).resolves.not.toThrow();
    await expect(reels.isHidden()).resolves.toBe(false);
  });
}); 