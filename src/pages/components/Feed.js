import ConfigService from '../../services/ConfigService';
import PatternDetectionService from '../../services/PatternDetectionService';

/**
 * Feed - Component for managing Facebook feed
 * Handles feed-specific interactions and state
 */
class Feed {
  constructor() {
    this.config = ConfigService.getInstance();
    this.patternDetection = PatternDetectionService.getInstance();
    this.feedSelector = this.config.getSelector('feed');
    this.feedContainer = null;
  }

  async initialize() {
    try {
      this.feedContainer = await this.patternDetection.findElement(this.feedSelector);
      if (this.feedContainer) {
        // Set up a mutation observer to filter new posts as they appear
        this.observeFeedChanges();
      }
      return true;
    } catch (error) {
      console.error('Bookcover: Error initializing feed:', error);
      return false;
    }
  }

  observeFeedChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.filterPosts();
        }
      });
    });

    observer.observe(this.feedContainer, {
      childList: true,
      subtree: true
    });
  }

  filterPosts() {
    if (!this.feedContainer) return;

    // Get all feed units
    const feedUnits = this.feedContainer.querySelectorAll('div[data-pagelet^="FeedUnit_"]');
    
    feedUnits.forEach(unit => {
      // Check if the post is from a friend or family member
      const isFriendOrFamily = this.isFriendOrFamilyPost(unit);
      
      // Check if it's a suggested post or group
      const isSuggested = this.isSuggestedContent(unit);
      
      // Show only friend/family posts, hide everything else
      unit.style.display = isFriendOrFamily && !isSuggested ? 'block' : 'none';
    });
  }

  isFriendOrFamilyPost(postElement) {
    // Look for friend/family indicators in the post
    const friendIndicators = [
      'Friend',
      'Close Friend',
      'Family',
      'Following'
    ];
    
    const postText = postElement.textContent;
    return friendIndicators.some(indicator => postText.includes(indicator));
  }

  isSuggestedContent(postElement) {
    // Look for suggested content indicators
    const suggestedIndicators = [
      'Suggested for you',
      'Suggested Group',
      'Suggested Page',
      'You might like',
      'Recommended for you'
    ];
    
    const postText = postElement.textContent;
    return suggestedIndicators.some(indicator => postText.includes(indicator));
  }

  async hide() {
    try {
      this.feedContainer = await this.patternDetection.findElement(this.feedSelector);
      if (this.feedContainer) {
        // Instead of hiding the entire feed, filter the posts
        this.filterPosts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error filtering feed:', error);
      return false;
    }
  }

  async show() {
    try {
      this.feedContainer = await this.patternDetection.findElement(this.feedSelector);
      if (this.feedContainer) {
        // Show all posts
        const feedUnits = this.feedContainer.querySelectorAll('div[data-pagelet^="FeedUnit_"]');
        feedUnits.forEach(unit => {
          unit.style.display = 'block';
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bookcover: Error showing feed:', error);
      return false;
    }
  }

  isHidden() {
    if (!this.feedContainer) {
      return false;
    }
    // Check if any posts are visible
    const visiblePosts = this.feedContainer.querySelectorAll('div[data-pagelet^="FeedUnit_"][style="display: block"]');
    return visiblePosts.length === 0;
  }
}

export default Feed; 