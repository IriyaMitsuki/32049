const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExtensionBuilder {
    constructor() {
        this.distDir = 'dist';
        this.chromeDir = 'dist/chrome';
        this.firefoxDir = 'dist/firefox';
    }

    async build() {
        console.log('🚀 Starting extension build...');
        
        // Clean and create directories
        this.cleanDist();
        this.createDirectories();
        
        // Build Chrome version
        await this.buildChrome();
        
        // Build Firefox version
        await this.buildFirefox();
        
        // Create ZIP files
        await this.createZipFiles();
        
        console.log('✅ Build completed successfully!');
        console.log(`📦 Chrome extension: ${this.chromeDir}.zip`);
        console.log(`🦊 Firefox extension: ${this.firefoxDir}.zip`);
    }

    cleanDist() {
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }
    }

    createDirectories() {
        fs.mkdirSync(this.distDir, { recursive: true });
        fs.mkdirSync(this.chromeDir, { recursive: true });
        fs.mkdirSync(this.firefoxDir, { recursive: true });
    }

    async buildChrome() {
        console.log('🔧 Building Chrome extension...');
        
        // Copy common files
        this.copyCommonFiles(this.chromeDir);
        
        // Copy Chrome-specific manifest
        fs.copyFileSync('manifest.json', path.join(this.chromeDir, 'manifest.json'));
        
        // Copy Chrome background script
        fs.copyFileSync('background.js', path.join(this.chromeDir, 'background.js'));
        
        console.log('✅ Chrome extension built');
    }

    async buildFirefox() {
        console.log('🦊 Building Firefox extension...');
        
        // Copy common files
        this.copyCommonFiles(this.firefoxDir);
        
        // Copy Firefox-specific manifest
        fs.copyFileSync('manifest-firefox.json', path.join(this.firefoxDir, 'manifest.json'));
        
        // Copy Firefox background script
        fs.copyFileSync('background-firefox.js', path.join(this.firefoxDir, 'background.js'));
        
        console.log('✅ Firefox extension built');
    }

    copyCommonFiles(targetDir) {
        const commonFiles = [
            'newtab.html',
            'newtab.css',
            'newtab.js',
            'popup.html',
            'popup.css',
            'popup.js',
            'content.js'
        ];

        const iconsDir = path.join(targetDir, 'icons');
        fs.mkdirSync(iconsDir, { recursive: true });

        // Copy common files
        commonFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.copyFileSync(file, path.join(targetDir, file));
            }
        });

        // Copy icons
        const iconFiles = fs.readdirSync('icons');
        iconFiles.forEach(icon => {
            fs.copyFileSync(
                path.join('icons', icon), 
                path.join(iconsDir, icon)
            );
        });
    }

    async createZipFiles() {
        console.log('📦 Creating ZIP files...');
        
        await Promise.all([
            this.createZip(this.chromeDir, `${this.chromeDir}.zip`),
            this.createZip(this.firefoxDir, `${this.firefoxDir}.zip`)
        ]);
    }

    createZip(sourceDir, outputPath) {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                console.log(`📦 ${outputPath} created (${archive.pointer()} total bytes)`);
                resolve();
            });

            archive.on('error', reject);
            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();
        });
    }
}

// Run build if called directly
if (require.main === module) {
    const builder = new ExtensionBuilder();
    builder.build().catch(console.error);
}

module.exports = ExtensionBuilder;