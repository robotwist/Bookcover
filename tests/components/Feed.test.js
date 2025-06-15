import Feed from '../../src/pages/components/Feed';
import ConfigService from '../../src/services/ConfigService';

// Mock ConfigService
jest.mock('../../src/services/ConfigService', () => {
  const mockInstance = {
    getSelector: jest.fn().mockImplementation((key) => {
      const selectors = {
        feed: '[role="feed"]',
        feedUnit: 'div[data-pagelet^="FeedUnit_"]',
        sponsored: '[aria-label="Sponsored"]',
      };
      return selectors[key];
    }),
  };

  return {
    getInstance: jest.fn().mockReturnValue(mockInstance),
  };
});

describe('Feed Component', () => {
  let feed;

  beforeEach(() => {
    document.body.innerHTML = `
      <div role="feed">
        <div data-pagelet="FeedUnit_1">Feed Content 1</div>
        <div data-pagelet="FeedUnit_2">Feed Content 2</div>
      </div>
      <div aria-label="Sponsored">Sponsored Content</div>
    `;

    feed = new Feed();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should initialize with selectors from ConfigService', () => {
    expect(feed.feedSelector).toBe('[role="feed"]');
    expect(ConfigService.getInstance).toHaveBeenCalled();
  });

  test('should hide feed elements', async () => {
    const result = await feed.hide();
    expect(result).toBe(true);

    const elements = document.querySelectorAll('[role="feed"], div[data-pagelet^="FeedUnit_"], [aria-label="Sponsored"]');
    elements.forEach((el) => {
      expect(el.style.display).toBe('none');
    });
  });

  test('should correctly identify hidden state', async () => {
    await feed.hide();
    const isHidden = await feed.isHidden();
    expect(isHidden).toBe(true);
  });

  test('should handle missing elements gracefully', async () => {
    document.body.innerHTML = '';
    const isHidden = await feed.isHidden();
    expect(isHidden).toBe(false);
  });
});
