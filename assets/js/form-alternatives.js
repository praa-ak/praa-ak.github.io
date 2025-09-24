/**
 * Alternative Contact Form Solutions
 * This file provides additional methods for form handling
 */

// Alternative Solution 1: Using Netlify Forms (if hosted on Netlify)
function setupNetlifyForms() {
    // Add data-netlify="true" to your form tag in HTML
    // Example: <form data-netlify="true" name="contact" method="POST">
    // Netlify automatically handles form submissions
}

// Alternative Solution 2: Using Web3Forms (Free service)
function setupWeb3Forms() {
    const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
    
    // Add hidden input to your form:
    // <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
    // <input type="hidden" name="redirect" value="https://web3forms.com/success">
}

// Alternative Solution 3: Using Basin (Simple form backend)
function setupBasin() {
    const BASIN_ENDPOINT = 'https://usebasin.com/f/YOUR_FORM_ID';
    
    // Submit to Basin
    return fetch(BASIN_ENDPOINT, {
        method: 'POST',
        body: formData
    });
}

// Alternative Solution 4: Using Getform.io
function setupGetform() {
    const GETFORM_ENDPOINT = 'https://getform.io/f/YOUR_FORM_ID';
    
    return fetch(GETFORM_ENDPOINT, {
        method: 'POST',
        body: formData
    });
}

// Alternative Solution 5: Email notification using EmailJS template
function setupEmailNotification(formData) {
    // EmailJS configuration
    const emailJSConfig = {
        serviceID: 'YOUR_SERVICE_ID', // Gmail, Outlook, etc.
        templateID: 'YOUR_TEMPLATE_ID',
        userID: 'YOUR_USER_ID' // Public key
    };

    // Email template variables
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_email: 'your-email@domain.com' // Your email to receive notifications
    };

    // Send email using EmailJS
    return emailjs.send(
        emailJSConfig.serviceID,
        emailJSConfig.templateID,
        templateParams,
        emailJSConfig.userID
    );
}

// Alternative Solution 6: Google Apps Script webhook
function createGoogleAppsScript() {
    /*
    // Paste this code in Google Apps Script (script.google.com):
    
    function doPost(e) {
        try {
            // Get the spreadsheet
            const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
            
            // Get form data
            const data = e.parameter;
            
            // Add timestamp
            const timestamp = new Date();
            
            // Append data to sheet
            sheet.appendRow([
                timestamp,
                data.name || '',
                data.email || '',
                data.subject || '',
                data.message || ''
            ]);
            
            // Optional: Send email notification
            MailApp.sendEmail({
                to: 'your-email@gmail.com',
                subject: 'New Contact Form Submission: ' + (data.subject || 'No Subject'),
                body: `
                    New contact form submission received:
                    
                    Name: ${data.name || 'Not provided'}
                    Email: ${data.email || 'Not provided'}
                    Subject: ${data.subject || 'Not provided'}
                    Message: ${data.message || 'Not provided'}
                    
                    Submitted at: ${timestamp}
                `
            });
            
            return ContentService
                .createTextOutput(JSON.stringify({result: 'success'}))
                .setMimeType(ContentService.MimeType.JSON);
                
        } catch (error) {
            return ContentService
                .createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
                .setMimeType(ContentService.MimeType.JSON);
        }
    }
    */
}

// Alternative Solution 7: Zapier Webhooks (connects to 1000+ apps)
function setupZapierWebhook() {
    const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID';
    
    return fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        body: formData
    });
}

// Alternative Solution 8: Simple JSON file storage (for development/testing)
function saveToJSONFile(formData) {
    // This would require a simple server or build process
    // Not suitable for pure static sites, but useful for testing
    const submission = {
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // In a Node.js environment:
    // const fs = require('fs');
    // const submissions = JSON.parse(fs.readFileSync('submissions.json', 'utf8') || '[]');
    // submissions.push(submission);
    // fs.writeFileSync('submissions.json', JSON.stringify(submissions, null, 2));
}

// Comparison table of services:
const serviceComparison = {
    'Formspree': {
        cost: 'Free (50/month) / $8/month',
        setup: 'Easy',
        features: 'Email notifications, spam protection, file uploads',
        limitations: 'Free tier limited'
    },
    'Web3Forms': {
        cost: 'Free (1000/month)',
        setup: 'Very Easy',
        features: 'Email notifications, no signup required',
        limitations: 'Basic features only'
    },
    'Netlify Forms': {
        cost: 'Free (100/month) / $19/month',
        setup: 'Very Easy (if on Netlify)',
        features: 'Spam detection, webhook integration',
        limitations: 'Only works on Netlify hosting'
    },
    'EmailJS': {
        cost: 'Free (200/month) / $15/month',
        setup: 'Medium',
        features: 'Direct email sending, template support',
        limitations: 'API keys visible in frontend'
    },
    'Basin': {
        cost: 'Free (100/month) / $5/month',
        setup: 'Easy',
        features: 'Dashboard, export data',
        limitations: 'Limited free tier'
    },
    'Local Storage': {
        cost: 'Free',
        setup: 'None',
        features: 'Offline support, full control',
        limitations: 'Data only on local device'
    }
};

export { 
    setupNetlifyForms, 
    setupWeb3Forms, 
    setupBasin, 
    setupGetform,
    setupEmailNotification,
    setupZapierWebhook,
    serviceComparison 
};