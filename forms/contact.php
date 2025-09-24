<?php
  /**
  * NOTICE: This PHP contact form is no longer used!
  * 
  * The website now uses a JavaScript-based contact form that works
  * with static site hosting (GitHub Pages, Netlify, Cloudflare, etc.)
  * 
  * The new contact form:
  * - Stores submissions locally in browser storage
  * - Can be configured to work with external services (Formspree, EmailJS, etc.)
  * - Has an admin panel for viewing submissions
  * - Can export data to CSV/Excel format
  * 
  * See the following files for the new implementation:
  * - assets/js/contact-form.js (main form handler)
  * - admin/contact-admin.html (admin panel)
  * - CONTACT_FORM_SETUP.md (setup instructions)
  * - test-form.html (test the contact form)
  */
  
  // Return a JSON response indicating the form has been migrated
  header('Content-Type: application/json');
  echo json_encode([
      'status' => 'deprecated',
      'message' => 'This PHP contact form has been replaced with a JavaScript solution. Please see CONTACT_FORM_SETUP.md for details.',
      'new_handler' => 'assets/js/contact-form.js'
  ]);
  exit;
?>
