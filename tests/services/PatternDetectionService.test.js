import PatternDetectionService from '../../src/services/PatternDetectionService';

describe('PatternDetectionService', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    PatternDetectionService.knownPatterns.clear();
    PatternDetectionService.observationCount.clear();
  });

  afterEach(() => {
    PatternDetectionService.stopObserving();
  });

  test('should start and stop observing', () => {
    PatternDetectionService.startObserving();
    expect(PatternDetectionService.observer).toBeTruthy();
    
    PatternDetectionService.stopObserving();
    expect(PatternDetectionService.observer).toBeNull();
  });

  test('should detect new patterns', () => {
    // Add a potential distraction element
    document.body.innerHTML = `
      <div role="feed" aria-label="News Feed">
        <div class="feed-content">Content</div>
      </div>
    `;

    // Trigger pattern detection
    PatternDetectionService.analyzeChanges();

    // Check if the pattern was recorded
    const patterns = Array.from(PatternDetectionService.knownPatterns.values());
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0].selectors).toContain('[role="feed"]');
  });

  test('should generate appropriate selectors', () => {
    document.body.innerHTML = `
      <div id="test-feed" class="feed-container" role="feed" aria-label="Test Feed">
        <div class="feed-item">Item</div>
      </div>
    `;

    const element = document.querySelector('#test-feed');
    const selectors = PatternDetectionService.generateSelectors(element);

    expect(selectors).toContain('#test-feed');
    expect(selectors).toContain('.feed-container');
    expect(selectors).toContain('[role="feed"]');
    expect(selectors).toContain('[aria-label="Test Feed"]');
  });

  test('should track observation count', () => {
    document.body.innerHTML = `
      <div role="feed">Content</div>
    `;

    // Simulate multiple observations
    for (let i = 0; i < 3; i++) {
      PatternDetectionService.analyzeChanges();
    }

    const signatures = Array.from(PatternDetectionService.observationCount.keys());
    expect(signatures.length).toBeGreaterThan(0);
    
    const count = PatternDetectionService.observationCount.get(signatures[0]);
    expect(count).toBe(3);
  });

  test('should report patterns after threshold', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    document.body.innerHTML = `
      <div role="feed">Content</div>
    `;

    // Simulate observations above threshold
    for (let i = 0; i < 4; i++) {
      PatternDetectionService.analyzeChanges();
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      'Bookcover: New pattern detected:',
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });
}); 