// Bookcover: Remove Facebook distractions
console.log('Bookcover: Content script loaded');

// --- CONFIG ---

// Inline config for local extension use
const selectorsToHide = [
  '[role="feed"]',
  'div[aria-label="Reels"]',
  'a[href*="reels"]',
  'a[href="/watch/"]',
  '[aria-label="Stories"]',
  '[aria-label="Create a story"]',
  'div[aria-label="Your Shortcuts"]',
  'div[aria-label="Contacts"]',
  '[aria-label="Suggested for You"]',
  'div[role="complementary"]',
  '[aria-label="Sponsored"]',
  '[aria-label="Groups Feed"]',
  '[aria-label="Notifications"]',
  'div[data-pagelet^="FeedUnit_"]'
];
const keywordsToHide = [
  'Sponsored',
  'Reels',
  'Suggested for You',
  'Watch',
  'Stories',
  'Marketplace',
  'Gaming'
];
const FILTER_RUN_INTERVAL = 5000; // 5 seconds



// --- FILTERING & LOGGING ---
function hideBySelectors() {
  selectorsToHide.forEach(selector => {
    let found = false;
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = "none";
      found = true;
    });
    if (!found) {
      console.warn('Bookcover: Selector found nothing:', selector);
    }
  });
}


function hideAllFeedUnits() {
  document.querySelectorAll('div[data-pagelet^="FeedUnit_"]').forEach(el => {
    el.style.display = "none";
  });
}


function hideDistractions() {
  hideBySelectors();
  hideAllFeedUnits();
}

// --- SCHEDULING ---
hideDistractions();
setInterval(hideDistractions, FILTER_RUN_INTERVAL);
const observer = new MutationObserver(hideDistractions);
observer.observe(document.body, { childList: true, subtree: true });