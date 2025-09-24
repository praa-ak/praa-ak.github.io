# Contact Form Setup Guide for Static Sites

## Current Issues Fixed ✅

1. **PHP Library Missing**: Replaced with JavaScript solution
2. **Static Site Compatibility**: No server-side code needed
3. **Free Solutions**: Multiple free options provided

## Available Solutions

### Option 1: Formspree (Recommended) 🌟

**Pros**: Easy setup, reliable, free tier (50 submissions/month)
**Cons**: Limited free submissions

#### Setup Steps:
1. Go to [formspree.io](https://formspree.io)
2. Sign up for free account
3. Create a new form
4. Copy your form endpoint URL
5. Update `contact-form.js` line 10:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

### Option 2: Local Storage (Current Default) 💾

**Pros**: Completely free, works offline, data stored on user's device
**Cons**: Data only accessible on the device where form was submitted

#### Features:
- Automatic local storage backup
- Admin panel at `/admin/contact-admin.html`
- CSV export functionality
- Search and filter submissions

### Option 3: EmailJS 📧

**Pros**: Sends emails directly, free tier (200 emails/month)
**Cons**: Requires more setup

#### Setup Steps:
1. Go to [emailjs.com](https://www.emailjs.com)
2. Create account and email service
3. Create email template
4. Update `contact-form.js` with EmailJS configuration

### Option 4: Google Sheets Integration 📊

**Pros**: Data stored in Google Sheets, accessible anywhere
**Cons**: Requires Google Apps Script setup

#### Setup Required:
1. Create Google Apps Script
2. Set up webhook endpoint
3. Update `contact-form.js` with script URL

## Current Implementation

Your contact form now:
- ✅ Works on static sites (no PHP needed)
- ✅ Stores data locally as backup
- ✅ Has admin panel for viewing submissions
- ✅ Can export data to CSV/Excel
- ✅ Compatible with Cloudflare/GitHub Pages
- ✅ Mobile responsive
- ✅ Search functionality

## Files Added/Modified

### New Files:
- `assets/js/contact-form.js` - Main form handler
- `admin/contact-admin.html` - Admin panel for viewing submissions

### Modified Files:
- `index.html` - Added contact-form.js script reference

## How to Access Admin Panel

1. Open your website
2. Navigate to `/admin/contact-admin.html`
3. View all form submissions
4. Export to Excel/CSV
5. Search and filter submissions

## Quick Start (Using Local Storage Only)

1. Your form is ready to use immediately
2. Submissions are stored in browser's local storage
3. Access admin panel to view submissions
4. Export data to CSV for Excel compatibility

## Upgrading to External Service

To use Formspree or other services:
1. Sign up for the service
2. Get your endpoint URL
3. Update the configuration in `contact-form.js`
4. Test the form

## Data Storage Options Summary

| Option | Cost | Setup | Data Location | Accessibility |
|--------|------|-------|---------------|---------------|
| Local Storage | Free | None | Browser | Device only |
| Formspree | Free/Paid | Easy | Cloud | Anywhere |
| EmailJS | Free/Paid | Medium | Email | Email inbox |
| Google Sheets | Free | Hard | Google Drive | Anywhere |

## Security Notes

- Local storage data is only accessible on the same device
- For production use, consider using Formspree or similar service
- Never expose API keys in client-side code
- Always validate form data

## Support

If you need help setting up any of these options, the admin panel provides a complete interface for managing your contact form submissions locally.