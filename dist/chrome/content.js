// Content Script for search interception
(function() {
  'use strict';
  
  let settings = {};
  
  // Get settings from storage
  const getSettings = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        settings = await chrome.storage.sync.get(['searchEngine', 'customUrl']);
      } else if (typeof browser !== 'undefined' && browser.storage) {
        settings = await browser.storage.sync.get(['searchEngine', 'customUrl']);
      }
    } catch (error) {
      console.error('Failed to get settings:', error);
    }
  };
  
  // Initialize
  getSettings();
  
  // Intercept form submissions for search
  document.addEventListener('submit', function(e) {
    const form = e.target;
    const searchInput = form.querySelector('input[name="q"], input[name="query"], input[name="search"]');
    
    if (searchInput && searchInput.value.trim()) {
      const query = searchInput.value.trim();
      
      // Check if this is a search form we should intercept
      if (shouldInterceptSearch(form)) {
        e.preventDefault();
        performCustomSearch(query);
      }
    }
  }, true);
  
  function shouldInterceptSearch(form) {
    const action = form.action.toLowerCase();
    const isGoogleSearch = action.includes('google.com/search') || action.includes('google.com/complete');
    const isBingSearch = action.includes('bing.com/search');
    const isYahooSearch = action.includes('yahoo.com/search');
    
    return isGoogleSearch || isBingSearch || isYahooSearch;
  }
  
  function performCustomSearch(query) {
    let searchUrl;
    
    switch (settings.searchEngine) {
      case 'searxng':
        searchUrl = (settings.customUrl || 'https://opnxng.com/search?q=') + encodeURIComponent(query);
        break;
      case 'duckduckgo':
        searchUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
        break;
      case 'startpage':
        searchUrl = 'https://www.startpage.com/sp/search?query=' + encodeURIComponent(query);
        break;
      default:
        searchUrl = 'https://opnxng.com/search?q=' + encodeURIComponent(query);
    }
    
    window.location.href = searchUrl;
  }
  
  // Listen for settings changes
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.onChanged.addListener(getSettings);
  } else if (typeof browser !== 'undefined' && browser.storage) {
    browser.storage.onChanged.addListener(getSettings);
  }
})();