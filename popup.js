// Popup Settings functionality
(function() {
    'use strict';
    
    // DOM elements
    const searchEngineRadios = document.querySelectorAll('input[name="searchEngine"]');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const customUrlInput = document.getElementById('customUrl');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const status = document.getElementById('status');
    
    // Initialize
    init();
    
    async function init() {
        await loadSettings();
        setupEventListeners();
    }
    
    async function loadSettings() {
        try {
            let settings;
            if (typeof chrome !== 'undefined' && chrome.storage) {
                settings = await chrome.storage.sync.get(['searchEngine', 'customUrl', 'theme']);
            } else if (typeof browser !== 'undefined' && browser.storage) {
                settings = await browser.storage.sync.get(['searchEngine', 'customUrl', 'theme']);
            }
            
            // Set search engine
            const searchEngine = settings.searchEngine || 'searxng';
            const engineRadio = document.querySelector(`input[name="searchEngine"][value="${searchEngine}"]`);
            if (engineRadio) {
                engineRadio.checked = true;
            }
            
            // Set custom URL
            customUrlInput.value = settings.customUrl || 'https://opnxng.com/search?q=';
            
            // Set theme
            const theme = settings.theme || 'dark';
            const themeRadio = document.querySelector(`input[name="theme"][value="${theme}"]`);
            if (themeRadio) {
                themeRadio.checked = true;
            }
            
            // Apply theme
            if (theme === 'light') {
                document.body.classList.add('light-theme');
            }
            
        } catch (error) {
            console.error('Failed to load settings:', error);
            showStatus('Failed to load settings', 'error');
        }
    }
    
    function setupEventListeners() {
        // Save button
        saveBtn.addEventListener('click', saveSettings);
        
        // Reset button
        resetBtn.addEventListener('click', resetSettings);
        
        // Theme change
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'light') {
                    document.body.classList.add('light-theme');
                } else {
                    document.body.classList.remove('light-theme');
                }
            });
        });
        
        // Auto-save on change
        [...searchEngineRadios, ...themeRadios].forEach(radio => {
            radio.addEventListener('change', saveSettings);
        });
        
        customUrlInput.addEventListener('blur', saveSettings);
        
        // Enter key to save
        customUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveSettings();
            }
        });
    }
    
    async function saveSettings() {
        try {
            const selectedEngine = document.querySelector('input[name="searchEngine"]:checked')?.value || 'searxng';
            const selectedTheme = document.querySelector('input[name="theme"]:checked')?.value || 'dark';
            const customUrl = customUrlInput.value.trim() || 'https://opnxng.com/search?q=';
            
            // Validate custom URL
            if (!isValidSearchUrl(customUrl)) {
                showStatus('Invalid URL format. Must include search parameter.', 'error');
                return;
            }
            
            const settings = {
                searchEngine: selectedEngine,
                customUrl: customUrl,
                theme: selectedTheme
            };
            
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.sync.set(settings);
            } else if (typeof browser !== 'undefined' && browser.storage) {
                await browser.storage.sync.set(settings);
            }
            
            showStatus('Settings saved successfully!', 'success');
            
            // Update new tab pages
            updateNewTabPages();
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            showStatus('Failed to save settings', 'error');
        }
    }
    
    async function resetSettings() {
        const defaultSettings = {
            searchEngine: 'searxng',
            customUrl: 'https://opnxng.com/search?q=',
            theme: 'dark'
        };
        
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.sync.set(defaultSettings);
            } else if (typeof browser !== 'undefined' && browser.storage) {
                await browser.storage.sync.set(defaultSettings);
            }
            
            // Update UI
            document.querySelector(`input[name="searchEngine"][value="searxng"]`).checked = true;
            document.querySelector(`input[name="theme"][value="dark"]`).checked = true;
            customUrlInput.value = 'https://opnxng.com/search?q=';
            document.body.classList.remove('light-theme');
            
            showStatus('Settings reset to default', 'success');
            
        } catch (error) {
            console.error('Failed to reset settings:', error);
            showStatus('Failed to reset settings', 'error');
        }
    }
    
    function isValidSearchUrl(url) {
        try {
            const urlObj = new URL(url);
            return url.includes('q=') || url.includes('query=') || url.includes('search=');
        } catch {
            return false;
        }
    }
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status show ${type}`;
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }
    
    async function updateNewTabPages() {
        // Notify all new tab pages of settings change
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                const tabs = await chrome.tabs.query({ url: chrome.runtime.getURL('newtab.html') });
                tabs.forEach(tab => {
                    chrome.tabs.reload(tab.id);
                });
            } else if (typeof browser !== 'undefined' && browser.tabs) {
                const tabs = await browser.tabs.query({ url: browser.runtime.getURL('newtab.html') });
                tabs.forEach(tab => {
                    browser.tabs.reload(tab.id);
                });
            }
        } catch (error) {
            console.error('Failed to update new tab pages:', error);
        }
    }
})();