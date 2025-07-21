// New Tab functionality
(function() {
    'use strict';
    
    let currentEngine = 'searxng';
    let customUrl = 'https://opnxng.com/search?q=';
    
    // DOM elements
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const engineButtons = document.querySelectorAll('.engine-btn');
    const settingsIcon = document.getElementById('settingsIcon');
    
    // Initialize
    init();
    
    async function init() {
        await loadSettings();
        setupEventListeners();
        updateActiveEngine();
        searchInput.focus();
    }
    
    async function loadSettings() {
        try {
            let storage;
            if (typeof chrome !== 'undefined' && chrome.storage) {
                storage = await chrome.storage.sync.get(['searchEngine', 'customUrl', 'theme']);
            } else if (typeof browser !== 'undefined' && browser.storage) {
                storage = await browser.storage.sync.get(['searchEngine', 'customUrl', 'theme']);
            }
            
            currentEngine = storage.searchEngine || 'searxng';
            customUrl = storage.customUrl || 'https://opnxng.com/search?q=';
            
            if (storage.theme === 'light') {
                document.body.classList.add('light-theme');
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }
    
    function setupEventListeners() {
        // Search form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });
        
        // Engine button clicks
        engineButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const engine = btn.dataset.engine;
                selectEngine(engine);
            });
        });
        
        // Settings icon click
        settingsIcon.addEventListener('click', () => {
            openSettings();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            
            // Tab to cycle through engines
            if (e.key === 'Tab' && searchInput === document.activeElement) {
                e.preventDefault();
                cycleEngine();
            }
        });
        
        // Auto-focus search input
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    searchInput.focus();
                }
            }, 100);
        });
    }
    
    function updateActiveEngine() {
        engineButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.engine === currentEngine);
        });
        
        // Update placeholder
        const placeholders = {
            searxng: 'Search with SearXNG...',
            duckduckgo: 'Search with DuckDuckGo...',
            startpage: 'Search with Startpage...'
        };
        
        searchInput.placeholder = placeholders[currentEngine] || 'Search the web...';
    }
    
    function selectEngine(engine) {
        currentEngine = engine;
        updateActiveEngine();
        saveSettings();
        searchInput.focus();
    }
    
    function cycleEngine() {
        const engines = ['searxng', 'duckduckgo', 'startpage'];
        const currentIndex = engines.indexOf(currentEngine);
        const nextIndex = (currentIndex + 1) % engines.length;
        selectEngine(engines[nextIndex]);
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        let searchUrl;
        
        switch (currentEngine) {
            case 'searxng':
                searchUrl = customUrl + encodeURIComponent(query);
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
    
    async function saveSettings() {
        try {
            const settings = {
                searchEngine: currentEngine,
                customUrl: customUrl
            };
            
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.sync.set(settings);
            } else if (typeof browser !== 'undefined' && browser.storage) {
                await browser.storage.sync.set(settings);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }
    
    function openSettings() {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.openOptionsPage();
        } else if (typeof browser !== 'undefined' && browser.runtime) {
            browser.runtime.openOptionsPage();
        } else {
            // Fallback: open popup
            window.open('popup.html', '_blank', 'width=400,height=500');
        }
    }
    
    // Auto-complete suggestions (basic implementation)
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length > 2) {
                // Could implement autocomplete here
                console.log('Could fetch suggestions for:', query);
            }
        }, 300);
    });
})();