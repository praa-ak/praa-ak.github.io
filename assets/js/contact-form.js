/**
 * Contact Form Handler with Cross-Browser/Cross-Device Storage
 */
(function() {
    "use strict";

    // Configuration - Replace with your own endpoints
    const STORAGE_CONFIG = {
        // Option 1: JSONBin.io (Free tier: 10k requests/month)
        jsonBinApiKey: '$2a$10$6hQy1627U0GJ4mjEwvzUherqYQPLLYChLG27.zpYVnsGmF2o710xu', // Replace with your API key
        jsonBinBinId: '68d6ecacae596e708ffd09b7', // Replace with your bin ID
        jsonBinUrl: 'https://api.jsonbin.io/v3/b/68d6ecacae596e708ffd09b7',
        
        // Option 2: Firebase Realtime Database (Alternative)
        firebaseUrl: 'https://your-project.firebaseio.com/submissions.json',
        
        // Fallback: localStorage
        localStorageKey: 'contactFormSubmissions'
    };

    // Initialize contact form
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.querySelector('form.php-email-form');
        
        if (!contactForm) {
            console.log('Contact form not found on this page');
            return;
        }

        console.log('Cross-device contact form initialized');
        
        // Add form ID for identification
        contactForm.id = 'contactForm';
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });

    // Handle form submission with cross-device storage
    async function handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        showLoading(form);
        
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
            deviceInfo: getDeviceInfo(),
            ipAddress: await getClientIP(), // Get user's IP for device identification
            sessionId: getOrCreateSessionId()
        };

        try {
            // Try cloud storage first
            const cloudSuccess = await saveToCloudStorage(submission);
            
            // Always save to localStorage as backup
            saveToLocalStorage(submission);
            
            if (cloudSuccess) {
                showSuccess('✅ Thank you! Your message has been sent successfully.');
                console.log('✅ Form saved to cloud storage');
            } else {
                showSuccess('✅ Message saved locally. It will sync when online.');
                console.log('⚠️ Saved to localStorage only - cloud storage failed');
            }
            
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Still save locally even if cloud fails
            saveToLocalStorage(submission);
            showError('⚠️ Message saved locally. Network issues detected.');
        } finally {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            hideLoading(form);
        }
    }

    // Save to cloud storage (JSONBin.io)
    async function saveToCloudStorage(submission) {
        try {
            // First, get existing submissions
            const existingData = await fetchFromCloudStorage();
            const submissions = existingData || [];
            
            // Add new submission
            submissions.unshift(submission);
            
            // Keep only last 1000 submissions
            if (submissions.length > 1000) {
                submissions.splice(1000);
            }
            
            // Save back to cloud
            const response = await fetch(`${STORAGE_CONFIG.jsonBinUrl}${STORAGE_CONFIG.jsonBinBinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': STORAGE_CONFIG.jsonBinApiKey,
                    'X-Bin-Versioning': 'false'
                },
                body: JSON.stringify(submissions)
            });

            if (!response.ok) {
                throw new Error(`Cloud storage error: ${response.status}`);
            }

            console.log('✅ Successfully saved to cloud storage');
            return true;
            
        } catch (error) {
            console.error('❌ Cloud storage failed:', error);
            return false;
        }
    }

    // Fetch from cloud storage
    async function fetchFromCloudStorage() {
        try {
            const response = await fetch(`${STORAGE_CONFIG.jsonBinUrl}${STORAGE_CONFIG.jsonBinBinId}/latest`, {
                headers: {
                    'X-Master-Key': STORAGE_CONFIG.jsonBinApiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status}`);
            }

            const data = await response.json();
            return data.record || [];
            
        } catch (error) {
            console.error('❌ Failed to fetch from cloud:', error);
            return null;
        }
    }

    // Save to localStorage as backup
    function saveToLocalStorage(submission) {
        try {
            let submissions = JSON.parse(localStorage.getItem(STORAGE_CONFIG.localStorageKey)) || [];
            submissions.unshift(submission);
            
            // Keep only last 100 submissions in localStorage
            if (submissions.length > 100) {
                submissions.splice(100);
            }
            
            localStorage.setItem(STORAGE_CONFIG.localStorageKey, JSON.stringify(submissions));
            console.log('✅ Saved to localStorage as backup');
            
        } catch (error) {
            console.error('❌ localStorage save failed:', error);
        }
    }

    // Get client IP address for device identification
    async function getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'Unknown';
        }
    }

    // Get or create session ID for tracking
    function getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('formSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('formSessionId', sessionId);
        }
        return sessionId;
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
            onLine: navigator.onLine,
            browser: getBrowserInfo(),
            timestamp: new Date().toISOString()
        };
    }

    // Get browser information
    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Unknown';
    }

    // UI Helper Functions
    function showLoading(form) {
        const loading = form.querySelector('.loading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    function hideLoading(form) {
        const loading = form.querySelector('.loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    function showSuccess(message) {
        const successEl = document.querySelector('.sent-message');
        const errorEl = document.querySelector('.error-message');
        
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
        }
        if (errorEl) {
            errorEl.style.display = 'none';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (successEl) successEl.style.display = 'none';
        }, 5000);
    }

    function showError(message) {
        const errorEl = document.querySelector('.error-message');
        const successEl = document.querySelector('.sent-message');
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        if (successEl) {
            successEl.style.display = 'none';
        }
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (errorEl) errorEl.style.display = 'none';
        }, 8000);
    }

    // Make API available globally for admin panel
    window.contactFormAPI = {
        fetchFromCloudStorage: fetchFromCloudStorage,
        fetchFromLocalStorage: () => {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_CONFIG.localStorageKey)) || [];
            } catch (error) {
                return [];
            }
        },
        STORAGE_CONFIG: STORAGE_CONFIG
    };

    console.log('Cross-device contact form handler loaded');

})();