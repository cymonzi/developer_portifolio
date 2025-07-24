/*!
 * Developer Portfolio Template
 * Copyright (c) 2025 Zi Designs
 * Licensed under MIT License for PURCHASED copies only
 * 
 * IMPORTANT: This template is for DEMONSTRATION purposes.
 * Commercial use requires a valid license from:
 * https://cymonzi.gumroad.com/l/aiiqzk
 * 
 * Unauthorized use, modification, or distribution without
 * a valid license is strictly prohibited.
 * 
 * For support and licensing: https://instagram.com/zidesigns01
 */

// License Verification System
class LicenseManager {
    constructor() {
        this.demoMode = true;
        this.licenseKey = localStorage.getItem('templateLicense') || null;
        this.init();
    }
    
    init() {
        this.checkLicense();
        this.addWatermark();
        this.setupProtection();
    }
    
    checkLicense() {
        // In demo mode, show watermark and restrictions
        if (!this.licenseKey || this.licenseKey === 'DEMO') {
            this.enableDemoMode();
        } else {
            this.verifyLicense(this.licenseKey);
        }
    }
    
    enableDemoMode() {
        console.log('%c🎨 Zi Designs Portfolio Template - DEMO VERSION', 
            'color: #00BFA6; font-size: 16px; font-weight: bold;');
        console.log('%c💡 Like what you see? Get the full version at: https://cymonzi.gumroad.com/l/aiiqzk', 
            'color: #A0E9FF; font-size: 14px;');
        
        // Keep demo clean and professional
    }
    
    verifyLicense(key) {
        // Simple license verification (can be enhanced)
        const validPrefixes = ['ZI-', 'PRO-', 'FULL-'];
        const isValid = validPrefixes.some(prefix => key.startsWith(prefix));
        
        if (isValid && key.length >= 12) {
            this.demoMode = false;
            this.removeDemoRestrictions();
            console.log('%c✅ Licensed Version - Thank you for your purchase!', 
                'color: #00BFA6; font-size: 14px;');
        } else {
            this.enableDemoMode();
        }
    }
    
    addWatermark() {
        if (!this.demoMode) return;
        
        // Add very subtle floating watermark
        const watermark = document.createElement('div');
        watermark.id = 'demo-watermark';
        watermark.innerHTML = `
            <div style="
                position: fixed;
                bottom: 15px;
                left: 15px;
                background: rgba(0, 191, 166, 0.8);
                color: white;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 11px;
                z-index: 1000;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                transition: all 0.3s ease;
                opacity: 0.7;
            " onclick="window.open('https://cymonzi.gumroad.com/l/aiiqzk', '_blank')" 
               onmouseover="this.style.opacity='1'" 
               onmouseout="this.style.opacity='0.7'">
                🎨 by Zi Designs
            </div>
        `;
        document.body.appendChild(watermark);
        
        // Auto-fade after some time
        setTimeout(() => {
            const element = document.getElementById('demo-watermark');
            if (element) {
                element.style.opacity = '0.4';
            }
        }, 5000);
    }
    
    addDemoRestrictions() {
        // Add demo notification to contact form immediately
        const contactForm = document.getElementById('contact-form');
        if (contactForm && this.demoMode) {
            // Create demo notice
            const demoNotice = document.createElement('div');
            demoNotice.id = 'demo-form-notice';
            demoNotice.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #A0E9FF 0%, #00BFA6 100%);
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                ">
                    � <strong>Demo Version:</strong> Contact form disabled in demo. 
                    <a href="https://cymonzi.gumroad.com/l/aiiqzk" target="_blank" style="color: white; text-decoration: underline; font-weight: bold;">
                        Get full version
                    </a> to enable all features.
                </div>
            `;
            
            // Insert notice before the form
            contactForm.parentNode.insertBefore(demoNotice, contactForm);
            
            // Disable all form inputs
            const inputs = contactForm.querySelectorAll('input, textarea, button');
            inputs.forEach(input => {
                input.disabled = true;
                input.style.opacity = '0.6';
                input.style.cursor = 'not-allowed';
            });
            
            // Override form submission completely
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDemoFormMessage();
                return false;
            });
            
            // Add click handler to form to show demo message
            contactForm.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
                    e.preventDefault();
                    this.showDemoFormMessage();
                }
            });
        }
    }
    
    showDemoFormMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        message.innerHTML = `
            <h3 style="margin-top: 0; color: #00BFA6;">🔒 Demo Version</h3>
            <p style="margin: 15px 0;">Contact form is disabled in demo version.</p>
            <p style="margin: 15px 0;"><strong>Purchase the full template to unlock:</strong></p>
            <ul style="text-align: left; margin: 15px 0;">
                <li>✅ Working contact form</li>
                <li>✅ No watermarks</li>
                <li>✅ Full source code access</li>
                <li>✅ Commercial license</li>
            </ul>
            <div style="margin-top: 20px;">
                <a href="https://cymonzi.gumroad.com/l/aiiqzk" target="_blank" style="
                    background: linear-gradient(135deg, #A0E9FF 0%, #00BFA6 100%);
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    display: inline-block;
                    margin-right: 10px;
                    font-weight: bold;
                ">Get Full Version</a>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: transparent;
                    color: #ccc;
                    border: 1px solid #ccc;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Close</button>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 8000);
    }
    
    removeDemoRestrictions() {
        // Remove watermark and restrictions for licensed users
        const watermark = document.getElementById('demo-watermark');
        if (watermark) watermark.remove();
        
        // Enable full functionality
        console.log('🚀 Full template features activated!');
    }
    
    setupProtection() {
        // Minimal protection - keep demo looking professional
        if (this.demoMode) {
            // Only show console message
            console.log('%c🎨 Demo by Zi Designs - Full version: https://cymonzi.gumroad.com/l/aiiqzk', 
                'color: #00BFA6; font-size: 12px;');
        }
    }
    
    showProtectionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
        `;
        message.innerHTML = `
            <h3>🔒 Protected Content</h3>
            <p>This is a demo version by Zi Designs</p>
            <p><a href="https://cymonzi.gumroad.com/l/aiiqzk" target="_blank" style="color: #00BFA6;">Purchase the full template</a> to access source code</p>
            <button onclick="this.parentElement.remove()" style="
                background: #00BFA6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
            ">Close</button>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
}

// License activation function for customers
window.activateLicense = function(licenseKey) {
    localStorage.setItem('templateLicense', licenseKey);
    location.reload();
};

// Initialize license manager
document.addEventListener('DOMContentLoaded', () => {
    new LicenseManager();
});

// Anti-copying measures
(function() {
    // Encode important functions
    const originalConsoleLog = console.log;
    if (Math.random() > 0.5) { // Random obfuscation
        console.log = function(...args) {
            if (typeof args[0] === 'string' && args[0].includes('Zi Designs')) {
                originalConsoleLog.apply(console, args);
            }
        };
    }
})();
