import ConfigService from '../ConfigService';

// Mock chrome API
global.chrome = {
  runtime: {
    getURL: jest.fn().mockReturnValue('chrome-extension://test/config.json'),
  },
};

describe('ConfigService', () => {
  let configService;

  beforeEach(() => {
    ConfigService.instance = null;
    configService = new ConfigService();
    configService.config = null; // Ensure config is null before each test
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
          feed: '[role="feed"]',
          reels: '[role="navigation"]',
          stories: '[role="complementary"]',
          sponsored: '[aria-label="Sponsored"]',
        },
        patterns: {
          feed: {
            selectors: ['[role="feed"]'],
            content: 'Content',
            structure: [],
          },
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
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
          feed: '[role="feed"]',
        },
      };
      expect(configService.getSelector('feed')).toBe('[role="feed"]');
    });

    it('should throw error if config is not loaded', () => {
      expect(() => configService.getSelector('feed')).toThrow('Config not loaded');
    });
  });

  describe('getConfig', () => {
    it('should return the entire config', () => {
      const mockConfig = {
        selectors: {
          feed: '[role="feed"]',
        },
      };
      configService.config = mockConfig;
      expect(configService.getConfig()).toEqual(mockConfig);
    });

    it('should throw error if config is not loaded', () => {
      expect(() => configService.getConfig()).toThrow('Config not loaded');
    });
  });
}); 