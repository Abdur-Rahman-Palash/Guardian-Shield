// Guardian Shield Content Script
class GuardianShieldContent {
    constructor() {
        this.riskyDomains = [];
        this.settings = {};
        this.isBlocked = false;
        this.originalContent = '';
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadRiskyDomains();
        this.checkCurrentSite();
        this.setupMessageListener();
        this.injectIndicator();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['settings']);
            this.settings = result.settings || {
                enableNotifications: true,
                enableScreenshots: true,
                strictMode: false
            };
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async loadRiskyDomains() {
        try {
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
            const response = await fetch('https://your-api-url.com/api/risky-domains');
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
            'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com',
            'bet365.com', 'williamhill.com', 'betway.com', 'paddypower.com',
            'darkweb.com', 'illegaldrugs.com', 'weaponssale.com'
        ];
    }

    checkCurrentSite() {
        const currentUrl = window.location.href;
        const isRisky = this.isRiskySite(currentUrl);
        const category = this.getRiskyCategory(currentUrl);

        if (isRisky) {
            this.blockSite(category);
            this.sendAlertToServer(currentUrl, category);
        } else {
            this.showSafeIndicator();
        }
    }

    isRiskySite(url) {
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

    blockSite(category) {
        if (this.isBlocked) return;
        
        this.isBlocked = true;
        this.originalContent = document.documentElement.innerHTML;
        
        // Create blocking overlay
        const blockOverlay = this.createBlockOverlay(category);
        document.documentElement.innerHTML = '';
        document.documentElement.appendChild(blockOverlay);
        
        // Prevent navigation
        this.preventNavigation();
        
        // Send notification
        this.showBrowserNotification(`Blocked: ${category.toUpperCase()} content`, 'danger');
    }

    createBlockOverlay(category) {
        const overlay = document.createElement('div');
        overlay.className = 'guardian-shield-block';
        overlay.innerHTML = `
            <div class="block-container">
                <div class="block-header">
                    <div class="block-logo">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            <path d="M12 22V8"/>
                        </svg>
                        <span>Guardian Shield</span>
                    </div>
                    <div class="block-category">${category?.toUpperCase() || 'BLOCKED'}</div>
                </div>
                <div class="block-content">
                    <h2>Content Blocked</h2>
                    <p>This website has been blocked by Guardian Shield to protect you from harmful content.</p>
                    <div class="block-details">
                        <div class="detail-item">
                            <strong>Category:</strong> ${category || 'Harmful Content'}
                        </div>
                        <div class="detail-item">
                            <strong>URL:</strong> ${window.location.href}
                        </div>
                    </div>
                    <div class="block-actions">
                        <button class="block-btn primary" onclick="window.open('https://your-dashboard-url.com/reports', '_blank')">
                            Report Issue
                        </button>
                        <button class="block-btn secondary" onclick="window.history.back()">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .guardian-shield-block {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .block-container {
                max-width: 500px;
                width: 90%;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .block-header {
                background: #ef4444;
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .block-logo {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 18px;
            }
            
            .block-category {
                background: rgba(255, 255, 255, 0.2);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .block-content {
                padding: 30px;
                text-align: center;
            }
            
            .block-content h2 {
                color: #1f2937;
                margin-bottom: 10px;
                font-size: 24px;
            }
            
            .block-content p {
                color: #6b7280;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .block-details {
                background: #f9fafb;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: left;
            }
            
            .detail-item {
                margin-bottom: 8px;
                font-size: 14px;
                color: #374151;
            }
            
            .block-actions {
                display: flex;
                gap: 10px;
            }
            
            .block-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .block-btn.primary {
                background: #3b82f6;
                color: white;
            }
            
            .block-btn.primary:hover {
                background: #2563eb;
            }
            
            .block-btn.secondary {
                background: #f3f4f6;
                color: #4b5563;
                border: 1px solid #d1d5db;
            }
            
            .block-btn.secondary:hover {
                background: #e5e7eb;
            }
        `;
        
        overlay.appendChild(style);
        return overlay;
    }

    showSafeIndicator() {
        // Add small indicator showing site is protected
        const indicator = document.createElement('div');
        indicator.id = 'guardian-shield-extension';
        indicator.setAttribute('data-version', '1.0.0');
        indicator.setAttribute('data-enabled', 'true');
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: #10b981;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                z-index: 1000;
                opacity: 0.8;
            ">
                ✓ Protected
            </div>
        `;
        document.body.appendChild(indicator);
    }

    preventNavigation() {
        // Prevent navigation away from blocked page
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = 'Navigation is blocked by Guardian Shield';
            return 'Navigation is blocked by Guardian Shield';
        });

        // Prevent right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Prevent keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Prevent Alt+Arrow, Ctrl+W, etc.
            if (e.altKey || (e.ctrlKey && (e.key === 'w' || e.key === 'F4'))) {
                e.preventDefault();
            }
        });
    }

    async sendAlertToServer(url, category) {
        try {
            await fetch('https://your-api-url.com/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url,
                    category,
                    timestamp: new Date().toISOString(),
                    automatic: true
                })
            });
        } catch (error) {
            console.error('Error sending alert to server:', error);
        }
    }

    showBrowserNotification(message, type = 'info') {
        if (!this.settings.enableNotifications) return;

        chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icons/icon48.png'),
            title: 'Guardian Shield',
            message: message
        });
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'GUARDIAN_SHIELD_CAPTURE_SCREENSHOT') {
                this.captureScreenshot();
                sendResponse({ received: true });
            }
            
            if (message.type === 'GUARDIAN_SHIELD_CHECK_STATUS') {
                sendResponse({
                    isBlocked: this.isBlocked,
                    url: window.location.href,
                    isRisky: this.isRiskySite(window.location.href)
                });
            }
        });
    }

    async captureScreenshot() {
        try {
            // Use html2canvas if available
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(document.body);
                const screenshot = canvas.toDataURL('image/png');
                
                // Send to popup
                chrome.runtime.sendMessage({
                    type: 'SCREENSHOT_CAPTURED',
                    screenshot: screenshot
                });
            }
        } catch (error) {
            console.error('Error capturing screenshot:', error);
        }
    }
}

// Initialize content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GuardianShieldContent();
    });
} else {
    new GuardianShieldContent();
}
