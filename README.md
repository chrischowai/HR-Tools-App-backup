# HR Tools Portal

A professional, innovative HR tools portal with Matrix-style authentication and a comprehensive dashboard for managing HR workflows. Built with HTML, Tailwind CSS, JavaScript, and Supabase for authentication.

## 🌟 Features

### Login Page
- **Matrix-style terminal design** with falling blue characters animation
- **Secure authentication** via Google Sheets integration through Supabase Edge functions
- **Responsive design** compatible with desktop and mobile devices
- **Professional UI/UX** with smooth animations and transitions

### Dashboard
- **Categorized HR tools** organized by function:
  - **Talent Acquisition**: Resume Screening, LinkedIn Talent Search
  - **Training & Development**: Professional Coach, Certificate Generator
  - **Staff Engagement**: Social Media Generator, Wellness Advisor
- **Professional design** with modern cards, stats overview, and intuitive navigation
- **Expandable architecture** ready for new tools
- **User session management** with secure logout

## 🛠 Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Authentication**: Supabase + Google Sheets API
- **Icons**: Font Awesome 6
- **Animations**: CSS3 + JavaScript
- **Deployment**: Static hosting (Netlify, Vercel, etc.)

## 📁 Project Structure

```
HR tool/
├── index.html                      # Matrix-style login page
├── dashboard.html                  # HR tools dashboard
├── README.md                       # This file
├── .env.example                    # Environment variables template
├── src/
│   ├── css/
│   │   ├── matrix.css             # Matrix animation styles
│   │   └── dashboard.css          # Dashboard styles
│   ├── js/
│   │   ├── matrix-animation.js    # Matrix falling text animation
│   │   ├── supabase-client.js     # Authentication client
│   │   ├── login.js               # Login form handler
│   │   └── dashboard.js           # Dashboard functionality
│   └── assets/                    # Static assets
└── supabase/
    ├── config.toml                # Supabase configuration
    └── functions/
        └── validate-login/
            └── index.ts           # Edge function for login validation
```

## 🚀 Quick Start

### Prerequisites

1. **Supabase Account**: Sign up at [supabase.io](https://supabase.io)
2. **Google Cloud Account**: For Google Sheets API access
3. **Web Server**: For serving the static files

### Step 1: Clone and Setup

1. Download or clone this repository
2. Copy `.env.example` to `.env`
3. Update the environment variables (see Configuration section)

### Step 2: Configure Supabase

1. Create a new Supabase project
2. Go to Settings > API and copy:
   - Project URL
   - Anon public key
3. Update `src/js/supabase-client.js` with your credentials
4. Deploy the Edge function:
   ```bash
   supabase functions deploy validate-login
   ```

### Step 3: Configure Google Sheets

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create API key credentials
5. Update your Google Sheet permissions to be accessible via API
6. Ensure your sheet has columns: "Login Name" and "Password"

### Step 4: Deploy

Upload all files to your web hosting service (Netlify, Vercel, GitHub Pages, etc.)

## ⚙️ Configuration

### Environment Variables

Update the following in your deployment environment:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
GOOGLE_SHEETS_API_KEY=your-api-key-here
GOOGLE_SHEET_ID=your-sheet-id-here
```

### Google Sheets Format

Your authentication Google Sheet should have this structure:

| Login Name | Password | ... |
|------------|----------|-----|
| admin      | admin123 | ... |
| hr         | hr123    | ... |

**Important**: Make sure your Google Sheet has proper permissions and the API key has access.

## 🎨 Customization

### Adding New Tools

1. **Add to dashboard.html**:
   ```html
   <div class="tool-card">
       <!-- Your tool card HTML -->
       <button onclick="openTool('https://your-tool-url.com')">Launch</button>
   </div>
   ```

2. **Update tool count** in statistics section

### Styling Customization

- **Colors**: Modify Tailwind config in HTML files
- **Animations**: Update CSS files in `src/css/`
- **Matrix theme**: Customize `src/css/matrix.css`

### Authentication

- **Demo Mode**: Set `DEMO_MODE = true` in `src/js/login.js` for testing
- **Session Duration**: Modify session expiry in `src/js/supabase-client.js`

## 🔧 Development

### Local Development

1. Serve files using a local web server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js (http-server)
   npx http-server -p 3000
   
   # Using PHP
   php -S localhost:3000
   ```

2. Open `http://localhost:3000` in your browser

### Testing

- **Login Testing**: Use demo mode or configure test credentials
- **Responsive Testing**: Test on various screen sizes
- **Browser Testing**: Ensure compatibility across browsers

## 📱 Mobile Compatibility

The portal is fully responsive with:
- **Adaptive layouts** for different screen sizes
- **Touch-friendly interfaces** with proper tap targets
- **Optimized animations** that respect motion preferences
- **Mobile-first approach** in CSS design

## 🔒 Security

- **Session Management**: Secure client-side session with expiry
- **API Security**: Supabase Edge functions handle sensitive operations
- **Input Validation**: All forms have proper validation
- **HTTPS Recommended**: Always deploy with SSL certificate

## 🚀 Deployment Options

### Netlify (Recommended)

1. Connect your GitHub repository
2. Set environment variables in site settings
3. Deploy automatically on push

### Vercel

1. Import project from GitHub
2. Configure environment variables
3. Deploy with zero configuration

### Traditional Hosting

1. Upload files via FTP/SFTP
2. Configure environment variables server-side
3. Ensure HTTPS is enabled

## 🆘 Troubleshooting

### Common Issues

1. **Login not working**: Check Supabase and Google Sheets API configuration
2. **Matrix animation not showing**: Verify JavaScript files are loading
3. **Tools not opening**: Check URL configurations and CORS settings
4. **Mobile display issues**: Test responsive breakpoints

### Debug Mode

Enable debug mode by setting `localStorage.setItem('debug', 'true')` in browser console.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for internal HR use. Modify as needed for your organization.

## 🆕 Future Enhancements

- **Analytics Dashboard**: Usage statistics and metrics
- **Mobile App**: Native mobile applications
- **API Integration**: Connect with existing HR systems
- **AI Assistant**: Intelligent HR guidance and automation
- **Advanced Security**: SSO and MFA support

## 📞 Support

For technical support or questions:
1. Check this README first
2. Review the code comments
3. Test in demo mode
4. Check browser console for errors

---

**Built with ❤️ for HR professionals**