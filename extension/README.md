# Guardian Shield Browser Extension

A comprehensive browser extension for protecting children from harmful content with real-time monitoring and alerts.

## Features

### 🔒 Content Protection
- **Real-time URL blocking** for porn, gambling, and other risky sites
- **Category-based filtering** with customizable strictness levels
- **Automatic detection** and blocking of harmful content
- **Safe browsing indicators** on protected sites

### 📊 Monitoring & Alerts
- **Automatic alerts** when risky content is detected
- **Manual alert system** for parents to report concerns
- **Screenshot capture** with html2canvas integration
- **Real-time notifications** to parents' devices

### 🛠️ Management
- **Extension popup** with status dashboard
- **Settings configuration** for notifications and screenshots
- **Domain management** with remote updates
- **Alert history** and reporting

## Installation

### Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked extension"
4. Select the `extension` folder

### Firefox Extension
1. Open Firefox and go to `about:debugging`
2. Click "Load Temporary Add-on"
3. Select the `extension` folder

## Configuration

### Environment Variables
Update the following URLs in the extension files:
- `https://your-api-url.com` → Your Guardian Shield API URL
- `YOUR_API_KEY` → Your API authentication key

### Settings
- **Enable Notifications**: Show browser notifications for alerts
- **Auto Screenshots**: Automatically capture screenshots on alerts
- **Strict Mode**: Block more aggressively with lower thresholds

## File Structure

```
extension/
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup interface
├── popup.css              # Popup styles
├── popup.js               # Popup functionality
├── content.js             # Content script for page injection
├── content.css            # Content script styles
├── background.js          # Service worker for background tasks
├── icons/                 # Extension icons
└── README.md              # This file
```

## API Integration

### Required Endpoints
- `GET /api/risky-domains` - Fetch blocked domains
- `POST /api/alerts` - Send security alerts
- `POST /api/check-domain` - Check domain status

### Alert Payload
```json
{
  "url": "https://example.com",
  "category": "porn",
  "timestamp": "2024-03-04T12:00:00Z",
  "automatic": true,
  "screenshot": "data:image/png;base64,..."
}
```

## Development

### Local Testing
1. Update API URLs to point to local development server
2. Load extension in developer mode
3. Open browser console for debugging
4. Test with various risky domains

### Building for Production
1. Update API URLs to production endpoints
2. Ensure all placeholder values are replaced
3. Test thoroughly in multiple browsers
4. Submit to Chrome Web Store and Firefox Add-ons

## Security Features

### Content Blocking
- **Domain matching** with subdomain support
- **Keyword detection** for dynamic content
- **Category-based rules** for different threat levels
- **Real-time updates** from server

### Privacy Protection
- **Local storage** for sensitive data
- **Encrypted communication** with API
- **No data collection** beyond security alerts
- **User consent** for screenshots

## Browser Compatibility

### Chrome
- ✅ Manifest V3 support
- ✅ Service Worker background scripts
- ✅ Content Security Policy
- ✅ Extensions API v3

### Firefox
- ✅ Manifest V3 support
- ✅ Background service workers
- ✅ Content scripts
- ✅ Storage API

### Safari (Future)
- 🔄 Planned for future versions
- 🔄 Requires Safari Web Extensions

## Troubleshooting

### Common Issues
1. **Extension not loading**: Check manifest syntax and permissions
2. **Content script not injecting**: Verify CSP headers
3. **API calls failing**: Check CORS and authentication
4. **Notifications not showing**: Verify permissions

### Debug Mode
Enable console logging:
```javascript
// In background.js
console.log('Guardian Shield Debug Mode Enabled');
```

### Performance Optimization
- **Debounce API calls** to prevent spam
- **Cache domains locally** for offline access
- **Lazy load screenshots** only when needed
- **Optimize DOM queries** in content scripts

## Updates

### Automatic Updates
- Extension updates through browser stores
- Domain list updates every hour
- Settings synchronization across devices
- Version compatibility checks

### Manual Updates
- Force update from popup menu
- Clear cache and reload domains
- Reset to default settings

## Support

### Documentation
- [API Documentation](../docs/api.md)
- [User Guide](../docs/user-guide.md)
- [Developer Guide](../docs/developer-guide.md)

### Contact
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Support: support@guardian-shield.com
- Documentation: docs.guardian-shield.com

## License

MIT License - see [LICENSE](../LICENSE) file for details.
