/**
 * Contact Form Handler for Static Sites
 * Uses Formspree API for form submissions
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

    let contactForms = document.querySelectorAll('.php-email-form');

    contactForms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let thisForm = this;
            let formData = new FormData(thisForm);
            
            // Show loading state
            showLoadingState(thisForm);
            
            // Submit to Formspree
            submitToFormspree(thisForm, formData);
            
            // Alternative: Submit to local storage for testing
            // submitToLocalStorage(thisForm, formData);
            
            // Alternative: Submit to Google Sheets (requires setup)
            // submitToGoogleSheets(thisForm, formData);
        });
    });

    /**
     * Submit form to Formspree
     */
    function submitToFormspree(form, formData) {
        if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === 'https://formspree.io/f/xvgwonak') {
            displayError(form, 'Please configure your Formspree endpoint in contact-form.js');
            return;
        }

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                displaySuccess(form);
                form.reset();
                
                // Save to local storage as backup
                saveToLocalStorage(formData);
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        throw new Error(data.errors.map(error => error.message).join(', '));
                    } else {
                        throw new Error('Form submission failed');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            displayError(form, 'Sorry, there was an error submitting your form. Please try again.');
            
            // Save to local storage as fallback
            saveToLocalStorage(formData);
        });
    }

    /**
     * Save form data to local storage as backup
     */
    function saveToLocalStorage(formData) {
        try {
            const submission = {
                timestamp: new Date().toISOString(),
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Get existing submissions
            let submissions = JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
            submissions.push(submission);
            
            // Keep only last 50 submissions
            if (submissions.length > 50) {
                submissions = submissions.slice(-50);
            }
            
            localStorage.setItem('contactFormSubmissions', JSON.stringify(submissions));
            console.log('Form data saved to local storage:', submission);
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    }

    /**
     * Submit to local storage only (for testing)
     */
    function submitToLocalStorage(form, formData) {
        // Simulate network delay
        setTimeout(() => {
            saveToLocalStorage(formData);
            displaySuccess(form);
            form.reset();
        }, 1000);
    }

    /**
     * Submit to Google Sheets (requires Google Apps Script setup)
     */
    function submitToGoogleSheets(form, formData) {
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
        
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            displayError(form, 'Google Sheets integration not configured');
            return;
        }

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                displaySuccess(form);
                form.reset();
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Google Sheets submission error:', error);
            displayError(form, 'Sorry, there was an error submitting your form.');
            
            // Fallback to local storage
            saveToLocalStorage(formData);
        });
    }

    /**
     * Show loading state
     */
    function showLoadingState(form) {
        const loading = form.querySelector('.loading');
        const errorMsg = form.querySelector('.error-message');
        const successMsg = form.querySelector('.sent-message');
        
        if (loading) loading.style.display = 'block';
        if (errorMsg) errorMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
    }

    /**
     * Display success message
     */
    function displaySuccess(form) {
        const loading = form.querySelector('.loading');
        const successMsg = form.querySelector('.sent-message');
        
        if (loading) loading.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
    }

    /**
     * Display error message
     */
    function displayError(form, message) {
        const loading = form.querySelector('.loading');
        const errorMsg = form.querySelector('.error-message');
        
        if (loading) loading.style.display = 'none';
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }
    }

    // Export functions for admin panel
    window.ContactFormUtils = {
        getStoredSubmissions: function() {
            return JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
        },
        exportSubmissions: function() {
            const submissions = this.getStoredSubmissions();
            const csv = this.convertToCSV(submissions);
            this.downloadCSV(csv, 'contact-form-submissions.csv');
        },
        convertToCSV: function(submissions) {
            if (submissions.length === 0) return '';
            
            const headers = ['Timestamp', 'Name', 'Email', 'Subject', 'Message'];
            const csvContent = [
                headers.join(','),
                ...submissions.map(sub => [
                    sub.timestamp,
                    `"${sub.name || ''}"`,
                    sub.email || '',
                    `"${sub.subject || ''}"`,
                    `"${(sub.message || '').replace(/"/g, '""')}"`
                ].join(','))
            ].join('\n');
            
            return csvContent;
        },
        downloadCSV: function(csv, filename) {
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        clearSubmissions: function() {
            if (confirm('Are you sure you want to clear all stored submissions?')) {
                localStorage.removeItem('contactFormSubmissions');
                alert('All submissions cleared.');
            }
        }
    };

})();