// Guardian Shield Background Service Worker
class GuardianShieldBackground {
    constructor() {
        this.riskyDomains = [];
        this.alerts = [];
        this.settings = {};
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadRiskyDomains();
        this.setupEventListeners();
        this.setupAlarms();
        this.initializeStorage();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['settings']);
            this.settings = result.settings || {
                enableNotifications: true,
                enableScreenshots: true,
                strictMode: false,
                checkInterval: 5 // minutes
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
                await this.fetchRiskyDomains();
            }
        } catch (error) {
            console.error('Error loading risky domains:', error);
        }
    }

    async fetchRiskyDomains() {
        try {
            const response = await fetch('http://localhost:3003/api/risky-domains');
            if (response.ok) {
                const data = await response.json();
                this.riskyDomains = data.domains || [];
                await chrome.storage.local.set({ riskyDomains: this.riskyDomains });
                
                // Update all tabs with new domains
                this.updateAllTabs();
            }
        } catch (error) {
            console.error('Error fetching risky domains:', error);
            // Fallback to hardcoded domains
            this.riskyDomains = this.getDefaultRiskyDomains();
            await chrome.storage.local.set({ riskyDomains: this.riskyDomains });
        }
    }

    getDefaultRiskyDomains() {
        return [
            'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
            'bet365.com', 'williamhill.com', 'betway.com', 'paddypower.com',
            'darkweb.com', 'illegaldrugs.com', 'weaponssale.com'
        ];
    }

    setupEventListeners() {
        // Tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.checkTab(tabId, tab.url);
            }
        });

        // Tab activation
        chrome.tabs.onActivated.addListener((activeInfo) => {
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                if (tab.url) {
                    this.checkTab(tab.id, tab.url);
                }
            });
        });

        // New tab creation
        chrome.tabs.onCreated.addListener((tab) => {
            if (tab.url) {
                this.checkTab(tab.id, tab.url);
            }
        });

        // Extension installation/update
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.handleInstall();
            } else if (details.reason === 'update') {
                this.handleUpdate(details.previousVersion);
            }
        });

        // Storage changes
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'sync' && changes.settings) {
                this.settings = { ...this.settings, ...changes.settings.newValue };
            }
            
            if (namespace === 'local' && changes.riskyDomains) {
                this.riskyDomains = changes.riskyDomains.newValue;
                this.updateAllTabs();
            }
        });

        // Message handling
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
        });
    }

    setupAlarms() {
        // Periodic domain updates
        chrome.alarms.create('updateDomains', {
            delayInMinutes: 60, // Update every hour
            periodInMinutes: 60
        });

        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'updateDomains') {
                this.fetchRiskyDomains();
            }
        });
    }

    async initializeStorage() {
        try {
            const result = await chrome.storage.local.get(['alerts', 'lastUpdate']);
            this.alerts = result.alerts || [];
            
            // Clean old alerts (older than 7 days)
            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            this.alerts = this.alerts.filter(alert => alert.timestamp > weekAgo);
            await chrome.storage.local.set({ alerts: this.alerts });
        } catch (error) {
            console.error('Error initializing storage:', error);
        }
    }

    async checkTab(tabId, url) {
        try {
            const isRisky = this.isRiskySite(url);
            const category = this.getRiskyCategory(url);

            if (isRisky) {
                await this.blockTab(tabId, url, category);
                await this.sendAlert(url, category);
            }
        } catch (error) {
            console.error('Error checking tab:', error);
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

    async blockTab(tabId, url, category) {
        try {
            // Inject content script to block the page
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['content.js']
            });
        } catch (error) {
            console.error('Error blocking tab:', error);
        }
    }

    async sendAlert(url, category) {
        try {
            const alert = {
                id: Date.now().toString(),
                url,
                category,
                timestamp: new Date().toISOString(),
                automatic: true
            };

            // Store alert locally
            this.alerts.push(alert);
            await chrome.storage.local.set({ alerts: this.alerts });

            // Send to server
            await fetch('https://your-api-url.com/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY'
                },
                body: JSON.stringify(alert)
            });

            // Send notification
            if (this.settings.enableNotifications) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: chrome.runtime.getURL('icon.svg'),
                    title: 'Guardian Shield Alert',
                    message: `Blocked ${category?.toUpperCase()} content: ${new URL(url).hostname}`
                });
            }
        } catch (error) {
            console.error('Error sending alert:', error);
        }
    }

    async updateAllTabs() {
        try {
            const tabs = await chrome.tabs.query({});
            
            for (const tab of tabs) {
                if (tab.url && !tab.url.startsWith('chrome://')) {
                    await this.checkTab(tab.id, tab.url);
                }
            }
        } catch (error) {
            console.error('Error updating all tabs:', error);
        }
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.type) {
                case 'GET_RISKY_DOMAINS':
                    sendResponse({ domains: this.riskyDomains });
                    break;

                case 'ADD_RISKY_DOMAIN':
                    await this.addRiskyDomain(message.domain, message.category);
                    sendResponse({ success: true });
                    break;

                case 'REMOVE_RISKY_DOMAIN':
                    await this.removeRiskyDomain(message.domain);
                    sendResponse({ success: true });
                    break;

                case 'GET_ALERTS':
                    sendResponse({ alerts: this.alerts });
                    break;

                case 'CLEAR_ALERTS':
                    await this.clearAlerts();
                    sendResponse({ success: true });
                    break;

                case 'GET_SETTINGS':
                    sendResponse({ settings: this.settings });
                    break;

                case 'UPDATE_SETTINGS':
                    await this.updateSettings(message.settings);
                    sendResponse({ success: true });
                    break;

                case 'CAPTURE_SCREENSHOT':
                    await this.captureScreenshot(sender.tab?.id);
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ error: 'Unknown message type' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ error: error.message });
        }
    }

    async addRiskyDomain(domain, category) {
        if (!this.riskyDomains.includes(domain)) {
            this.riskyDomains.push(domain);
            await chrome.storage.local.set({ riskyDomains: this.riskyDomains });
            this.updateAllTabs();
        }
    }

    async removeRiskyDomain(domain) {
        this.riskyDomains = this.riskyDomains.filter(d => d !== domain);
        await chrome.storage.local.set({ riskyDomains: this.riskyDomains });
        this.updateAllTabs();
    }

    async clearAlerts() {
        this.alerts = [];
        await chrome.storage.local.set({ alerts: this.alerts });
    }

    async updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        await chrome.storage.sync.set({ settings: this.settings });
    }

    async captureScreenshot(tabId) {
        try {
            const screenshot = await chrome.tabs.captureVisibleTab(tabId);
            
            // Store screenshot
            const screenshotData = {
                id: Date.now().toString(),
                data: screenshot,
                timestamp: new Date().toISOString(),
                tabId
            };
            
            const screenshots = await chrome.storage.local.get(['screenshots']);
            const allScreenshots = screenshots.screenshots || [];
            allScreenshots.push(screenshotData);
            
            // Keep only last 50 screenshots
            if (allScreenshots.length > 50) {
                allScreenshots.splice(0, allScreenshots.length - 50);
            }
            
            await chrome.storage.local.set({ screenshots: allScreenshots });
            
            return screenshot;
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            throw error;
        }
    }

    handleInstall() {
        // Open welcome page
        chrome.tabs.create({
            url: chrome.runtime.getURL('welcome.html')
        });

        // Set default settings
        this.updateSettings({
            enableNotifications: true,
            enableScreenshots: true,
            strictMode: false,
            checkInterval: 5
        });
    }

    handleUpdate(previousVersion) {
        // Show update notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon.svg'),
            title: 'Guardian Shield Updated',
            message: `Updated from version ${previousVersion} to ${chrome.runtime.getManifest().version}`
        });
    }
}

// Initialize background script
new GuardianShieldBackground();
