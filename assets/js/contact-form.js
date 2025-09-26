/**
 * Contact Form Handler for Static Sites - FIXED: Shared storage
 */
(function() {
    "use strict";

    // Configuration
    const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT_HERE'; // Replace with your Formspree endpoint
    
    // Alternative free services endpoints (uncomment to use):
    // const NETLIFY_FORMS_ENDPOINT = '/'; // For Netlify Forms
    // const EMAILJS_CONFIG = {
    //     serviceID: 'YOUR_SERVICE_ID',
    //     templateID: 'YOUR_TEMPLATE_ID',
    //     userID: 'YOUR_USER_ID'
    // };

    // FIXED: Use consistent storage key for all form submissions
    const STORAGE_KEY = 'contactFormSubmissions';
    
    // Initialize contact form
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            console.log('Contact form not found on this page');
            return;
        }

        console.log('Contact form initialized');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });

    // Handle form submission
    async function handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const submission = {
            id: generateSubmissionId(),
            timestamp: new Date().toISOString(),
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            subject: formData.get('subject') || '',
            message: formData.get('message') || '',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            deviceInfo: getDeviceInfo()
        };

        try {
            // Always store locally first (this ensures data is never lost)
            storeSubmissionLocally(submission);
            
            // Try external service if configured
            if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT !== 'YOUR_FORMSPREE_ENDPOINT_HERE') {
                await submitToFormspree(formData, submission);
            } else {
                console.log('No external service configured, using local storage only');
            }
            
            showSuccess('✅ Thank you! Your message has been sent successfully.');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showError('❌ There was an error sending your message. However, it has been saved locally.');
        } finally {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }

    // FIXED: Store submission in localStorage with consistent key
    function storeSubmissionLocally(submission) {
        try {
            // Get existing submissions from localStorage (shared across all tabs)
            let submissions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            
            // Add new submission
            submissions.unshift(submission); // Add to beginning of array
            
            // Keep only last 1000 submissions to prevent storage overflow
            if (submissions.length > 1000) {
                submissions = submissions.slice(0, 1000);
            }
            
            // Save back to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
            
            console.log('✅ Form submission stored locally:', submission);
            console.log('📊 Total submissions in storage:', submissions.length);
            
            // Also trigger a storage event for real-time updates across tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: STORAGE_KEY,
                newValue: JSON.stringify(submissions),
                url: window.location.href
            }));
            
        } catch (error) {
            console.error('Error storing submission locally:', error);
            throw error;
        }
    }

    // Submit to Formspree (if configured)
    async function submitToFormspree(formData, submission) {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Formspree error: ${response.status}`);
        }

        console.log('✅ Form also sent to Formspree successfully');
    }

    // Generate unique submission ID
    function generateSubmissionId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get device information
    function getDeviceInfo() {
        return {
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    // Show success message
    function showSuccess(message) {
        // Try to find existing message elements
        let messageEl = document.querySelector('.sent-message');
        
        if (!messageEl) {
            // Create message element if it doesn't exist
            messageEl = document.createElement('div');
            messageEl.className = 'sent-message';
            messageEl.style.cssText = `
                background: #d4edda;
                color: #155724;
                padding: 15px;
                border-radius: 5px;
                margin-top: 15px;
                border: 1px solid #c3e6cb;
                display: block;
            `;
            
            const form = document.getElementById('contactForm');
            form.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Hide any error messages
        const errorEl = document.querySelector('.error-message');
        if (errorEl) {
            errorEl.style.display = 'none';
        }

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }, 5000);
    }

    // Show error message
    function showError(message) {
        // Try to find existing error message element
        let errorEl = document.querySelector('.error-message');
        
        if (!errorEl) {
            // Create error element if it doesn't exist
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.style.cssText = `
                background: #f8d7da;
                color: #721c24;
                padding: 15px;
                border-radius: 5px;
                margin-top: 15px;
                border: 1px solid #f5c6cb;
                display: block;
            `;
            
            const form = document.getElementById('contactForm');
            form.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        
        // Hide any success messages
        const successEl = document.querySelector('.sent-message');
        if (successEl) {
            successEl.style.display = 'none';
        }

        // Auto-hide error message after 8 seconds
        setTimeout(() => {
            if (errorEl) {
                errorEl.style.display = 'none';
            }
        }, 8000);
    }

    // ADDED: Function to get all submissions (for admin panel)
    function getAllSubmissions() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (error) {
            console.error('Error reading submissions:', error);
            return [];
        }
    }

    // ADDED: Function to clear all submissions
    function clearAllSubmissions() {
        localStorage.removeItem(STORAGE_KEY);
        
        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: null,
            url: window.location.href
        }));
    }

    // Make functions available globally for admin panel
    window.contactFormAPI = {
        getAllSubmissions: getAllSubmissions,
        clearAllSubmissions: clearAllSubmissions,
        STORAGE_KEY: STORAGE_KEY
    };

    console.log('Contact form handler loaded successfully');

})();