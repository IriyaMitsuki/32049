# Custom Search Engine Extension

A secure browser extension that allows you to change your default search engine and customize your new tab page. Built with support for Chrome (Manifest V3) and Firefox, featuring SearXNG integration and automatic GitHub Actions builds.

## 🚀 Features

- **Custom Search Engine**: Replace default search with SearXNG, DuckDuckGo, or Startpage
- **New Tab Override**: Beautiful custom new tab page with search functionality
- **Cross-Browser Support**: Works on Chrome (Manifest V3) and Firefox
- **Secure Design**: No data collection, privacy-focused architecture
- **Easy Configuration**: Simple popup interface for settings
- **Auto-Build**: GitHub Actions for automated building and releases

## 🔧 Installation

### From Releases (Recommended)

1. Go to the [Releases page](https://github.com/yourusername/custom-search-extension/releases)
2. Download the appropriate ZIP file:
   - `chrome-extension.zip` for Chrome/Chromium browsers
   - `firefox-extension.zip` for Firefox
3. Extract the ZIP file
4. Follow browser-specific installation steps below

### Chrome/Chromium Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extracted Chrome folder
4. The extension will be installed and activated

### Firefox Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extracted Firefox folder and select `manifest.json`
5. The extension will be installed temporarily

## 🛠️ Development

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/custom-search-extension.git
cd custom-search-extension

# Install dependencies
npm install

# Build the extension
npm run build
```

### Build Commands

- `npm run build` - Build both Chrome and Firefox versions
- `npm run dev` - Development build with file watching
- `npm run clean` - Clean build directories
- `npm run lint` - Run ESLint code analysis

### Project Structure

```
├── manifest.json              # Chrome Manifest V3
├── manifest-firefox.json      # Firefox Manifest V2
├── background.js             # Chrome background script
├── background-firefox.js     # Firefox background script
├── content.js               # Content script (shared)
├── newtab.html             # New tab page
├── newtab.css              # New tab styles
├── newtab.js               # New tab functionality
├── popup.html              # Settings popup
├── popup.css               # Popup styles
├── popup.js                # Popup functionality
├── icons/                  # Extension icons
├── build.js                # Build script
└── .github/workflows/      # GitHub Actions
```

## ⚙️ Configuration

### Default Search Engines

The extension supports these search engines out of the box:

- **SearXNG** (default): Privacy-focused metasearch engine
- **DuckDuckGo**: Privacy-focused search with no tracking
- **Startpage**: Google results without tracking

### Custom SearXNG Setup

1. Open the extension popup
2. Select "SearXNG" as your search engine
3. Enter your custom SearXNG URL (e.g., `https://your-instance.com/search?q=`)
4. Make sure to include the search parameter (`q=`) at the end
5. Click "Save Settings"

## 🔒 Security Features

- **No Data Collection**: The extension doesn't collect or transmit any personal data
- **Local Storage Only**: All settings are stored locally in your browser
- **Content Security Policy**: Strict CSP prevents code injection
- **Permissions Minimization**: Only requests necessary permissions
- **Code Auditing**: Automated security scans via GitHub Actions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature X"`
5. Push to your fork: `git push origin feature-name`
6. Submit a pull request

### Code Style

- Use ESLint configuration provided
- Follow modern JavaScript/ES6+ practices
- Maintain browser compatibility
- Write clear, documented code

## 📦 GitHub Actions

The repository includes automated workflows:

- **Build**: Automatically builds extensions on push/PR
- **Security**: Runs security audits and code quality checks
- **Release**: Creates releases with downloadable extension files

### Setting Up Auto-Releases

1. Push code to main branch
2. Create a new tag: `git tag v1.0.0`
3. Push the tag: `git push origin v1.0.0`
4. GitHub Actions will automatically create a release with extension files

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Ensure you've extracted the ZIP file completely
- Check that manifest.json exists in the folder
- Verify you're loading the correct folder for your browser

**Search not working:**
- Check that the custom URL includes the search parameter
- Verify the search engine URL is accessible
- Try resetting to default settings

**Settings not saving:**
- Ensure the extension has storage permissions
- Check browser console for error messages
- Try reloading the extension

### Debug Mode

For development debugging:

1. Open browser developer tools
2. Go to Extensions tab
3. Find your extension and click "background page" or "inspect"
4. Check console for error messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Icons from Lucide React icon library
- SearXNG community for privacy-focused search
- Mozilla and Google for extension platform documentation
- GitHub Actions for automated builds

## 📧 Support

If you encounter issues or have questions:

1. Check the [Issues](https://github.com/yourusername/custom-search-extension/issues) page
2. Create a new issue with detailed description
3. Include browser version and error messages
4. Provide steps to reproduce the problem

---

**Privacy First** 🔒 | **Open Source** 💻 | **Cross-Platform** 🌐