# HR Tools Portal - Testing Guide

## 🧪 Demo Mode Testing

The portal is currently configured in **demo mode** for immediate testing without requiring Supabase setup.

### Demo Credentials

Use any of these credentials to test the login:

| Username | Password |
|----------|----------|
| `demo`   | `demo123` |
| `admin`  | `admin123` |
| `hr`     | `hr123` |

## 🚀 Quick Test Instructions

### 1. Start Local Server

Choose one of these methods to serve the files:

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000

# Node.js (if http-server is installed)
npx http-server -p 3000

# PHP
php -S localhost:3000
```

### 2. Open in Browser

Navigate to `http://localhost:3000` and you should see the Matrix-style login page.

### 3. Test Login Flow

1. **Matrix Animation**: Verify the blue falling characters are animated
2. **Form Interaction**: 
   - Try typing in the username field (placeholder should have typing effect)
   - Focus/blur should show glow effects
3. **Authentication**:
   - Try invalid credentials first (should show error)
   - Use demo credentials (should redirect to dashboard)

### 4. Test Dashboard

1. **User Interface**:
   - Check responsive design on different screen sizes
   - Verify all tool cards display correctly
   - Test user dropdown menu
2. **Tool Launching**:
   - Click "Launch" on Resume Screening Tool
   - Click "Launch" on LinkedIn Talent Search Tool
   - Verify external links open in new tabs
3. **Session Management**:
   - Test logout functionality
   - Verify redirect back to login

## 📱 Mobile Testing

### Screen Sizes to Test

- **Phone**: 375px width (iPhone SE)
- **Tablet**: 768px width (iPad)
- **Desktop**: 1200px+ width

### What to Verify

- [ ] Matrix animation adapts to screen size
- [ ] Login form is touch-friendly
- [ ] Dashboard cards stack properly
- [ ] Navigation menu works on mobile
- [ ] Tool buttons are large enough for touch

## 🔧 Browser Compatibility

Test in these browsers:

- [ ] Chrome/Edge (Chromium-based)
- [ ] Firefox
- [ ] Safari (if on Mac/iOS)
- [ ] Mobile browsers (Chrome Mobile, Safari Mobile)

## 🎯 Feature Checklist

### Login Page
- [ ] Matrix animation runs smoothly
- [ ] Login form validates input
- [ ] Error messages display correctly
- [ ] Success animation shows on login
- [ ] Demo credentials work
- [ ] Page is responsive

### Dashboard
- [ ] User welcome message shows
- [ ] Tool cards display with correct status
- [ ] Active tools have launch buttons
- [ ] Developing tools show "Coming Soon"
- [ ] External links open correctly
- [ ] Logout works properly
- [ ] Animations are smooth

### Performance
- [ ] Page loads under 3 seconds
- [ ] Animations don't cause lag
- [ ] Images/assets load properly
- [ ] No JavaScript errors in console

## 🐛 Common Issues & Solutions

### Matrix Animation Not Working

**Symptoms**: Black screen or no falling characters
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify `src/js/matrix-animation.js` is loading
3. Check if browser supports required CSS/JS features

### Login Not Working

**Symptoms**: Form submits but doesn't redirect
**Solutions**:
1. Verify demo mode is enabled (`DEMO_MODE = true`)
2. Check browser console for errors
3. Ensure local server is running

### Dashboard Not Loading

**Symptoms**: Blank page after login
**Solutions**:
1. Check if `dashboard.html` exists
2. Verify JavaScript files are loading
3. Check browser console for errors

### Tool Links Not Working

**Symptoms**: Launch buttons don't open external tools
**Solutions**:
1. Check if popup blocker is enabled
2. Verify URLs are correct
3. Test in different browser

## 🔍 Debug Mode

Enable additional logging:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
location.reload();
```

This will show additional console logs for troubleshooting.

## 📊 Performance Testing

### Lighthouse Checks

Run Chrome DevTools Lighthouse audit and aim for:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 80+

### Network Testing

Test on different connection speeds:
- Fast 3G simulation
- Slow 3G simulation
- Offline (should show appropriate error)

## 🚀 Production Testing

Once you're ready to deploy with real authentication:

### 1. Disable Demo Mode

Edit `src/js/login.js`:
```javascript
const DEMO_MODE = false; // Set to false for production
```

### 2. Configure Supabase

1. Create Supabase project
2. Update `src/js/supabase-client.js` with real credentials
3. Deploy Edge function
4. Test with real Google Sheets

### 3. Update Tool URLs

Replace placeholder URLs with your actual deployed HR tools.

## ✅ Pre-Deployment Checklist

Before going live:

- [ ] Demo mode is disabled
- [ ] All credentials are configured
- [ ] External tool URLs are updated
- [ ] HTTPS is enabled
- [ ] Error handling is in place
- [ ] Mobile testing is complete
- [ ] Performance is optimized
- [ ] Security review is done

## 🆘 Need Help?

1. **Check README.md** for setup instructions
2. **Review console logs** in browser developer tools
3. **Test in demo mode** to isolate issues
4. **Verify file paths** and server configuration

---

**Happy Testing! 🎉**