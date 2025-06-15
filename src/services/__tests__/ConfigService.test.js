import ConfigService from '../ConfigService';

describe('ConfigService', () => {
  let configService;

  beforeEach(() => {
    ConfigService.instance = null;
    configService = new ConfigService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('loadConfig', () => {
    it('should load config successfully', async () => {
      const mockConfig = {
        selectors: {
          feed: '[data-testid="feed"]',
          reels: '[data-testid="reels"]',
          stories: '[data-testid="stories"]',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockConfig),
      });

      const result = await configService.loadConfig();
      expect(result).toBe(true);
      expect(configService.config).toEqual(mockConfig);
    });

    it('should handle loading errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Test error'));

      const result = await configService.loadConfig();
      expect(result).toBe(false);
      expect(configService.config).toBeNull();
    });
  });

  describe('getSelector', () => {
    it('should return the correct selector', () => {
      configService.config = {
        selectors: {
          feed: '[data-testid="feed"]',
        },
      };

      const selector = configService.getSelector('feed');
      expect(selector).toBe('[data-testid="feed"]');
    });

    it('should throw error if config is not loaded', () => {
      expect(() => configService.getSelector('feed')).toThrow('Config not loaded');
    });
  });

  describe('getConfig', () => {
    it('should return the entire config', () => {
      const mockConfig = {
        selectors: {
          feed: '[data-testid="feed"]',
        },
      };
      configService.config = mockConfig;

      const config = configService.getConfig();
      expect(config).toEqual(mockConfig);
    });

    it('should throw error if config is not loaded', () => {
      expect(() => configService.getConfig()).toThrow('Config not loaded');
    });
  });
}); 