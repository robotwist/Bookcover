import FacebookPage from '../../src/pages/FacebookPage';

describe('FacebookPage', () => {
  let page;

  beforeEach(() => {
    // Set up a basic DOM structure that mimics Facebook
    document.body.innerHTML = `
      <div role="feed">
        <div data-pagelet="FeedUnit_1">Feed Content 1</div>
        <div data-pagelet="FeedUnit_2">Feed Content 2</div>
      </div>
      <div aria-label="Reels">
        <div>Reels Content</div>
      </div>
      <a href="/reels">Reels Link</a>
    `;

    page = new FacebookPage();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should initialize components', () => {
    expect(page.feed).toBeTruthy();
    expect(page.reels).toBeTruthy();
  });

  test('should hide feed elements', async () => {
    await page.hideDistractions();
    const feedHidden = await page.isFeedHidden();
    expect(feedHidden).toBe(true);
  });

  test('should hide reels elements', async () => {
    await page.hideDistractions();
    const reelsHidden = await page.isReelsHidden();
    expect(reelsHidden).toBe(true);
  });

  test('should handle errors gracefully', async () => {
    // Simulate an error by removing elements
    document.body.innerHTML = '';

    // Should not throw, but return false for hidden checks
    const feedHidden = await page.isFeedHidden();
    const reelsHidden = await page.isReelsHidden();

    expect(feedHidden).toBe(false);
    expect(reelsHidden).toBe(false);
  });
});
