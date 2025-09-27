# 7K Money PWA - Troubleshooting Guide

## 🔑 API Key Issues

### Problem: "Invalid API Key" Error
**Solutions:**

1. **Verify API Key Format**
   - Gemini API keys start with `AIzaSy...`
   - Keys are typically 35+ characters long
   - No spaces or extra characters

2. **Get Valid API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create or regenerate your API key
   - Ensure the key has Gemini model permissions

3. **Test Your API Key**
   - Go to AI Assistant tab
   - Enable AI Assistant
   - Click "🔧 Test API Key" button
   - Verify the key works before using

4. **Common API Errors**
   - `403 Forbidden`: API key invalid or no permissions
   - `429 Rate Limited`: Too many requests, wait and retry
   - `400 Bad Request`: Check API key format

## 📱 PWA Caching Issues

### Problem: App Not Updating on Custom Domain
**This is now FIXED with v2.0.1 updates!**

**Solutions:**

1. **Clear App Cache** (Use in browser console):
   ```javascript
   // Run in browser developer console
   fetch('./clear-cache.js').then(r => r.text()).then(eval);
   clearAppCache();
   ```

2. **Force Refresh**:
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or use browser console: `forceUpdate()`

3. **Manual Cache Clear**:
   - Open browser DevTools (F12)
   - Go to Application tab
   - Clear Storage → Clear site data

4. **For Deployed Apps**:
   - The app now auto-updates every 30 minutes
   - Network-first strategy for HTML files
   - Daily cache versioning prevents stale content

## 🚀 Deployment Best Practices

### For Vercel Deployment:

1. **Add these headers** in `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/sw.js",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=0, must-revalidate"
           }
         ]
       },
       {
         "source": "/index.html",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=0, must-revalidate"
           }
         ]
       }
     ]
   }
   ```

2. **Custom Domain Cache Issues**:
   - Cloudflare/CDN may cache files longer
   - Check your domain's caching settings
   - Consider using cache-busting query parameters

### Version Check:
- Look for version number in header: "v2.0.1 - Updated Cache System"
- This confirms you have the latest caching fixes

## 🛠️ Debug Mode

To enable debug mode, add this to browser console:
```javascript
localStorage.setItem('7k_debug', 'true');
window.location.reload();
```

## 📞 Still Having Issues?

1. Check browser console for errors (F12 → Console)
2. Verify API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Try incognito/private mode to test without cache
4. Clear all browser data for the domain

## ✅ Verification Checklist

- [ ] API key starts with `AIzaSy...` and is 35+ characters
- [ ] API key tested successfully in app
- [ ] App version shows "v2.0.1" or higher
- [ ] Service Worker registered (check DevTools → Application)
- [ ] No console errors related to API calls
- [ ] Cache updates working (app prompts for updates)