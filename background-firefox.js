// Firefox Background Script
browser.runtime.onInstalled.addListener(async () => {
  // Set default search engine settings
  const defaultSettings = {
    searchEngine: 'searxng',
    customUrl: 'https://opnxng.com/search?q=',
    theme: 'dark'
  };
  
  const existingSettings = await browser.storage.sync.get(Object.keys(defaultSettings));
  const newSettings = { ...defaultSettings, ...existingSettings };
  
  await browser.storage.sync.set(newSettings);
  
  console.log('Custom Search Engine extension installed');
});

// Handle storage changes
browser.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.searchEngine) {
    console.log('Search engine changed to:', changes.searchEngine.newValue);
  }
});

// Handle omnibox input
browser.omnibox.onInputEntered.addListener(async (text) => {
  const { searchEngine, customUrl } = await browser.storage.sync.get(['searchEngine', 'customUrl']);
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
  
  browser.tabs.create({ url: searchUrl });
});