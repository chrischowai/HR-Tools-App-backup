# HR Tools Portal - Production Deployment Guide

## 🚀 Quick Start

Your HR Tools Portal has been configured for production deployment. Follow this guide to complete the setup.

## ✅ Pre-Deployment Checklist

### 1. Supabase Configuration
- [x] **Supabase URL configured**: `https://wvtojojfwkryzixshczr.supabase.co`
- [x] **Anon Key configured**: Already set in production config
- [x] **Edge Function endpoint**: `validate-login-HR-TOOLS` configured
- [ ] **Verify Edge Function is deployed** (see instructions below)

### 2. Google Sheets Integration
- [ ] **Service Account Key**: Set up `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64_HR_TOOLS` in Supabase
- [x] **Google Sheet ID**: `1VNg2B5XpnGPQKBZ1S9_uvq5MmHyrwqp0Ist65WQ8NAU`
- [ ] **Verify Sheet Access**: Ensure service account has access to the sheet
- [ ] **Sheet Format**: Ensure columns are named "Login Name" and "Password"

### 3. Authentication System
- [x] **Demo mode disabled**: Production authentication active
- [x] **Request format updated**: Uses `loginName` parameter
- [x] **Response handling updated**: Handles Edge function response format

## 🔧 Required Setup Steps

### Step 1: Deploy Supabase Edge Function

If you haven't already deployed the Edge function, run:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref wvtojojfwkryzixshczr

# Deploy the Edge function
supabase functions deploy validate-login-HR-TOOLS
```

### Step 2: Set Edge Function Environment Variables

In your Supabase dashboard, go to **Edge Functions** → **validate-login-HR-TOOLS** → **Settings**:

```bash
# Set the Google Service Account key (Base64 encoded)
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64_HR_TOOLS=[your_base64_encoded_service_account_json]
```

To get the Base64 encoded service account:
1. Download your Google Cloud service account JSON file
2. Encode it: `base64 -w 0 path/to/service-account.json`
3. Set the result as the environment variable

### Step 3: Google Sheets Setup

1. **Create/Update Your Credentials Sheet**:
   - Sheet ID: `1VNg2B5XpnGPQKBZ1S9_uvq5MmHyrwqp0Ist65WQ8NAU`
   - Column A: "Login Name"
   - Column B: "Password"

2. **Share Sheet with Service Account**:
   - Share your Google Sheet with the service account email
   - Grant "Viewer" permissions

3. **Test Sheet Format**:
   ```
   | Login Name | Password    |
   |------------|-------------|
   | admin      | admin123    |
   | hr_user    | secure_pass |
   ```

### Step 4: Deploy to Hosting Platform

#### Option A: Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `echo 'Static site - no build required'`
   - Publish directory: `.`
3. Deploy!

#### Option B: Vercel
1. Import your project from GitHub
2. Configure build settings (no build required)
3. Deploy!

#### Option C: Traditional Hosting
1. Upload all files to your web server
2. Ensure HTTPS is enabled
3. Configure security headers

## 🔒 Security Configuration

### Required Environment Variables (Supabase Edge Function Only)
- `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64_HR_TOOLS`: Base64 encoded service account JSON

### Security Headers
The following security headers are automatically configured:
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- HSTS (Strict Transport Security)

## 🧪 Testing Your Production Deployment

### 1. Test Authentication
1. Navigate to your deployed URL
2. Try logging in with credentials from your Google Sheet
3. Verify successful login and redirect to dashboard
4. Test logout functionality

### 2. Test HR Tools
1. Click "Launch" on Resume Screening Tool
2. Click "Launch" on LinkedIn Talent Search Tool
3. Verify external tools open in new tabs

### 3. Test Security
1. Check that HTTPS is enforced
2. Verify security headers using [Security Headers](https://securityheaders.com/)
3. Test on different devices and browsers

## 🔧 Troubleshooting

### Login Issues
- **Symptom**: Login fails with "Authentication service unavailable"
- **Solution**: Check Edge function deployment and Google Sheets access

### Edge Function Errors
- **Symptom**: Network errors when logging in
- **Solution**: Verify Edge function is deployed and environment variables are set

### Google Sheets Access
- **Symptom**: "Access denied" or "sheet not found"
- **Solution**: Check service account permissions and sheet sharing settings

### Console Errors
Check browser console for specific error messages and refer to:
1. Network tab for API call failures
2. Console tab for JavaScript errors
3. Application tab for session storage issues

## 📱 Mobile Testing

Test on various screen sizes:
- **Phone**: 375px width
- **Tablet**: 768px width  
- **Desktop**: 1200px+ width

## 🚀 Performance Optimization

The application is already optimized with:
- ✅ Matrix animation performance optimization
- ✅ Responsive design
- ✅ Efficient session management
- ✅ Static asset caching headers

## 🔄 Updates and Maintenance

### Regular Tasks
1. **Monitor Edge function logs** in Supabase dashboard
2. **Update user credentials** in Google Sheet as needed
3. **Review security headers** periodically
4. **Test functionality** after any changes

### Updating User Credentials
1. Edit your Google Sheet with new/updated credentials
2. Changes are effective immediately (no deployment needed)

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test Edge function directly using the curl command provided
4. Ensure Google Sheet is accessible and properly formatted

---

## 🎉 Deployment Complete!

Once you've completed all steps above, your HR Tools Portal will be live and ready for production use!

**Next Steps:**
1. Share the live URL with your team
2. Add more user credentials to your Google Sheet as needed
3. Monitor usage and performance
4. Consider adding additional HR tools to the dashboard