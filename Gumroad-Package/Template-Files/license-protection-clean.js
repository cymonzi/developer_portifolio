/*!
 * Developer Portfolio Template - LICENSED VERSION
 * Copyright (c) 2025 Zi Designs
 * Licensed for commercial use
 * 
 * Thank you for your purchase!
 * For support: https://instagram.com/zidesigns01
 */

// Licensed Version - No restrictions
class LicenseManager {
    constructor() {
        this.licensed = true;
        this.init();
    }
    
    init() {
        console.log('%c🎉 Licensed Version - Thank you for your purchase!', 
            'color: #00BFA6; font-size: 16px; font-weight: bold;');
        console.log('%c💡 Need help? Contact @zidesigns01 on Instagram', 
            'color: #A0E9FF; font-size: 14px;');
        
        // Remove any demo restrictions
        this.enableFullFeatures();
    }
    
    enableFullFeatures() {
        // All features enabled for licensed users
        console.log('🚀 All template features activated!');
        
        // Enable contact form
        this.enableContactForm();
    }
    
    enableContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Show success message (customize with your backend)
                const formData = new FormData(contactForm);
                
                // Replace this with your actual form handling
                this.showSuccessMessage();
                
                // Optional: Send to your backend
                // this.submitToBackend(formData);
            });
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #A0E9FF 0%, #00BFA6 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        message.innerHTML = `
            <h3>✅ Message Sent!</h3>
            <p>Thank you for your message. I'll get back to you soon!</p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
            ">Close</button>
        `;
        document.body.appendChild(message);
        
        // Auto remove after 5 seconds
        setTimeout(() => message.remove(), 5000);
        
        // Reset form
        document.getElementById('contact-form').reset();
    }
    
    // Optional: Submit to your backend
    async submitToBackend(formData) {
        try {
            const response = await fetch('your-contact-endpoint.php', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                console.log('Form submitted successfully');
            }
        } catch (error) {
            console.log('Form submission error:', error);
        }
    }
}

// Initialize for licensed version
document.addEventListener('DOMContentLoaded', () => {
    new LicenseManager();
});
