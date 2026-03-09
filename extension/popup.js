// Guardian Shield Extension Popup Script
class GuardianShieldPopup {
    constructor() {
        this.currentTab = null;
        this.riskyDomains = [];
        this.settings = {
            enableNotifications: true,
            enableScreenshots: true,
            strictMode: false
        };
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadRiskyDomains();
        await this.getCurrentTab();
        this.setupEventListeners();
        
        // Update UI after loading
        setTimeout(() => {
            this.updateUI();
        }, 500);
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['settings']);
            this.settings = { ...this.settings, ...result.settings };
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({ settings: this.settings });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async loadRiskyDomains() {
        try {
            // Load from local storage first
            const result = await chrome.storage.local.get(['riskyDomains']);
            if (result.riskyDomains) {
                this.riskyDomains = result.riskyDomains;
            } else {
                // Fetch from API
                await this.fetchRiskyDomains();
            }
        } catch (error) {
            console.error('Error loading risky domains:', error);
        }
    }

    async fetchRiskyDomains() {
        try {
            const response = await fetch('http://localhost:3004/api/risky-domains');
            if (response.ok) {
                const data = await response.json();
                this.riskyDomains = data.domains || [];
                await chrome.storage.local.set({ riskyDomains: this.riskyDomains });
            }
        } catch (error) {
            console.error('Error fetching risky domains:', error);
            // Fallback to hardcoded domains
            this.riskyDomains = this.getDefaultRiskyDomains();
        }
    }

    getDefaultRiskyDomains() {
        return [
            'pornhub.com', 'xvideos.com', 'xnxx.com',
            'bet365.com', 'williamhill.com', 'betway.com',
            'darkweb.com', 'illegaldrugs.com'
        ];
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
        } catch (error) {
            console.error('Error getting current tab:', error);
        }
    }

    setupEventListeners() {
        // Copy URL button
        document.getElementById('copyUrl').addEventListener('click', () => {
            if (this.currentTab?.url) {
                navigator.clipboard.writeText(this.currentTab.url);
                this.showNotification('URL copied to clipboard');
            }
        });

        // Send alert button
        document.getElementById('sendAlert').addEventListener('click', () => {
            this.sendManualAlert();
        });

        // Screenshot button
        document.getElementById('captureScreenshot').addEventListener('click', () => {
            this.captureScreenshot();
        });

        // Download screenshot button
        document.getElementById('downloadScreenshot').addEventListener('click', () => {
            this.downloadScreenshot();
        });

        // Send screenshot button
        document.getElementById('sendScreenshot').addEventListener('click', () => {
            this.sendScreenshotAlert();
        });

        // Settings checkboxes
        document.getElementById('enableNotifications').addEventListener('change', (e) => {
            this.settings.enableNotifications = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('enableScreenshots').addEventListener('change', (e) => {
            this.settings.enableScreenshots = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('strictMode').addEventListener('change', (e) => {
            this.settings.strictMode = e.target.checked;
            this.saveSettings();
        });

        // Open dashboard button
        document.getElementById('openDashboard').addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:3004/dashboard' });
        });

        // Listen for messages from content script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'SCREENSHOT_CAPTURED') {
                this.handleCapturedScreenshot(message.screenshot);
            }
            sendResponse({ received: true });
        });

        // Refresh current tab info when popup opens
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                this.currentTab = tabs[0];
                this.updateUI();
            }
        });
    }

    updateUI() {
        if (!this.currentTab) {
            // Show loading state
            const urlText = document.querySelector('#currentUrl .url-text');
            if (urlText) {
                urlText.textContent = 'Loading...';
            }
            const statusText = document.getElementById('statusText');
            if (statusText) {
                statusText.textContent = 'Loading...';
            }
            return;
        }

        // Update current URL
        const urlElement = document.getElementById('currentUrl');
        const urlText = urlElement.querySelector('.url-text');
        if (urlText) {
            urlText.textContent = this.currentTab.url || 'No URL';
        }

        // Check if current site is risky
        const isRisky = this.isRiskySite(this.currentTab.url);
        const category = this.getRiskyCategory(this.currentTab.url);

        // Update site status
        const siteStatus = document.getElementById('siteStatus');
        const statusBadge = siteStatus.querySelector('.status-badge');
        if (statusBadge) {
            if (isRisky) {
                statusBadge.textContent = `${category?.toUpperCase()} - BLOCKED`;
                statusBadge.className = 'status-badge blocked';
            } else {
                statusBadge.textContent = 'SAFE';
                statusBadge.className = 'status-badge';
            }
        }

        // Update status indicator
        const statusIndicator = document.getElementById('statusIndicator');
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = document.getElementById('statusText');
        
        if (statusDot && statusText) {
            if (isRisky) {
                statusDot.className = 'status-dot error';
                statusText.textContent = 'Risky Site Detected';
            } else {
                statusDot.className = 'status-dot';
                statusText.textContent = 'Protected';
            }
        }

        // Update protection status
        this.updateProtectionStatus(isRisky);
    }

    updateProtectionStatus(isRisky) {
        const contentFilterStatus = document.getElementById('contentFilterStatus');
        const monitoringStatus = document.getElementById('monitoringStatus');

        if (contentFilterStatus) {
            contentFilterStatus.textContent = isRisky ? 'Content Blocked' : 'Active';
        }

        if (monitoringStatus) {
            monitoringStatus.textContent = 'Active';
        }
    }

    isRiskySite(url) {
        if (!url) return false;
        
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            return this.riskyDomains.some(riskyDomain => 
                domain.includes(riskyDomain) || riskyDomain.includes(domain)
            );
        } catch (error) {
            return false;
        }
    }

    getRiskyCategory(url) {
        if (!url) return undefined;
        
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            
            if (this.isPornDomain(domain)) return 'porn';
            if (this.isGamblingDomain(domain)) return 'gambling';
            if (this.isOtherRiskyDomain(domain)) return 'other';
            
            return undefined;
        } catch (error) {
            return undefined;
        }
    }

    isPornDomain(domain) {
        const pornKeywords = ['porn', 'xxx', 'sex', 'adult', 'nsfw'];
        return pornKeywords.some(keyword => domain.includes(keyword));
    }

    isGamblingDomain(domain) {
        const gamblingKeywords = ['bet', 'casino', 'poker', 'gambling', 'lottery'];
        return gamblingKeywords.some(keyword => domain.includes(keyword));
    }

    isOtherRiskyDomain(domain) {
        const otherKeywords = ['dark', 'illegal', 'weapon', 'drug'];
        return otherKeywords.some(keyword => domain.includes(keyword));
    }

    async sendManualAlert() {
        const childName = document.getElementById('childName').value.trim();
        const message = document.getElementById('alertMessage').value.trim();

        if (!childName || !message) {
            this.showNotification('Please enter both child name and alert message', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3004/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    childName,
                    message,
                    url: this.currentTab?.url,
                    timestamp: new Date().toISOString(),
                    manual: true
                })
            });

            if (response.ok) {
                document.getElementById('childName').value = '';
                document.getElementById('alertMessage').value = '';
                this.showNotification('Alert sent successfully!', 'success');
            } else {
                throw new Error('Failed to send alert');
            }
        } catch (error) {
            console.error('Error sending manual alert:', error);
            this.showNotification('Failed to send alert. Please try again.', 'error');
        }
    }

    async captureScreenshot() {
        try {
            // Capture visible tab
            const screenshot = await chrome.tabs.captureVisibleTab();
            this.handleCapturedScreenshot(screenshot);
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            this.showNotification('Failed to capture screenshot', 'error');
        }
    }

    handleCapturedScreenshot(screenshot) {
        const preview = document.getElementById('screenshotPreview');
        const image = document.getElementById('screenshotImage');
        
        if (preview && image) {
            image.src = screenshot;
            preview.classList.remove('hidden');
            this.currentScreenshot = screenshot;
        }
    }

    downloadScreenshot() {
        if (!this.currentScreenshot) return;

        try {
            const link = document.createElement('a');
            link.download = `guardian-shield-${Date.now()}.png`;
            link.href = this.currentScreenshot;
            link.click();
            this.showNotification('Screenshot downloaded', 'success');
        } catch (error) {
            console.error('Error downloading screenshot:', error);
            this.showNotification('Failed to download screenshot', 'error');
        }
    }

    async sendScreenshotAlert() {
        if (!this.currentScreenshot) return;

        const childName = document.getElementById('childName').value.trim();
        if (!childName) {
            this.showNotification('Please enter child name', 'error');
            return;
        }

        try {
            // Convert screenshot to blob
            const response = await fetch(this.currentScreenshot);
            const blob = await response.blob();
            
            const formData = new FormData();
            formData.append('screenshot', blob, 'screenshot.png');
            formData.append('childName', childName);
            formData.append('url', this.currentTab?.url || '');
            formData.append('timestamp', new Date().toISOString());

            const alertResponse = await fetch('http://localhost:3004/api/alerts', {
                method: 'POST',
                body: formData
            });

            if (alertResponse.ok) {
                this.showNotification('Screenshot alert sent successfully!', 'success');
            } else {
                throw new Error('Failed to send screenshot alert');
            }
        } catch (error) {
            console.error('Error sending screenshot alert:', error);
            this.showNotification('Failed to send screenshot alert', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease'
        });

        // Set color based on type
        const colors = {
            success: { bg: '#10b981', color: 'white' },
            error: { bg: '#ef4444', color: 'white' },
            info: { bg: '#3b82f6', color: 'white' }
        };

        const color = colors[type] || colors.info;
        notification.style.backgroundColor = color.bg;
        notification.style.color = color.color;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GuardianShieldPopup();
});
