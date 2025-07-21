// Chrome Manifest V3 Background Script
chrome.runtime.onInstalled.addListener(async () => {
  // Set default search engine settings
  const defaultSettings = {
    searchEngine: 'searxng',
    customUrl: 'https://opnxng.com/search?q=',
    theme: 'dark'
  };
  
  const existingSettings = await chrome.storage.sync.get(Object.keys(defaultSettings));
  const newSettings = { ...defaultSettings, ...existingSettings };
  
  await chrome.storage.sync.set(newSettings);
  
  console.log('Custom Search Engine extension installed');
});

// Handle search engine changes
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'sync' && changes.searchEngine) {
    const { searchEngine, customUrl } = await chrome.storage.sync.get(['searchEngine', 'customUrl']);
    await updateSearchProvider(searchEngine, customUrl);
  }
});

async function updateSearchProvider(engine, customUrl) {
  const searchProviders = {
    searxng: {
      name: 'SearXNG',
      search_url: customUrl || 'https://opnxng.com/search?q={searchTerms}',
      favicon_url: 'https://opnxng.com/favicon.ico'
    },
    duckduckgo: {
      name: 'DuckDuckGo',
      search_url: 'https://duckduckgo.com/?q={searchTerms}',
      favicon_url: 'https://duckduckgo.com/favicon.ico'
    },
    startpage: {
      name: 'Startpage',
      search_url: 'https://www.startpage.com/sp/search?query={searchTerms}',
      favicon_url: 'https://www.startpage.com/favicon.ico'
    }
  };

  const provider = searchProviders[engine];
  if (provider) {
    try {
      // Note: Chrome doesn't allow dynamic search provider changes via API
      // This would need to be handled through chrome_settings_overrides in manifest
      console.log('Search provider would be updated to:', provider.name);
    } catch (error) {
      console.error('Failed to update search provider:', error);
    }
  }
}

// Handle omnibox input (if needed in future)
chrome.omnibox.onInputEntered.addListener(async (text) => {
  const { searchEngine, customUrl } = await chrome.storage.sync.get(['searchEngine', 'customUrl']);
  let searchUrl;
  
  switch (searchEngine) {
    case 'searxng':
      searchUrl = (customUrl || 'https://opnxng.com/search?q=') + encodeURIComponent(text);
      break;
    case 'duckduckgo':
      searchUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(text);
      break;
    case 'startpage':
      searchUrl = 'https://www.startpage.com/sp/search?query=' + encodeURIComponent(text);
      break;
    default:
      searchUrl = 'https://opnxng.com/search?q=' + encodeURIComponent(text);
  }
  
  chrome.tabs.create({ url: searchUrl });
});