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
        
        // Add demo restrictions
        this.addDemoRestrictions();
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
        
        // Add floating watermark
        const watermark = document.createElement('div');
        watermark.id = 'demo-watermark';
        watermark.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 191, 166, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                cursor: pointer;
                transition: all 0.3s ease;
            " onclick="window.open('https://cymonzi.gumroad.com/l/aiiqzk', '_blank')">
                🎨 Demo by <strong>Zi Designs</strong> - Get Full Version
            </div>
        `;
        document.body.appendChild(watermark);
        
        // Animate watermark
        setTimeout(() => {
            const element = document.getElementById('demo-watermark');
            if (element) {
                element.style.transform = 'translateY(-10px)';
                element.style.opacity = '0.8';
            }
        }, 2000);
    }
    
    addDemoRestrictions() {
        // Add demo notification to contact form
        setTimeout(() => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm && this.demoMode) {
                const demoNotice = document.createElement('div');
                demoNotice.innerHTML = `
                    <div style="
                        background: linear-gradient(135deg, #A0E9FF 0%, #00BFA6 100%);
                        color: white;
                        padding: 12px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        text-align: center;
                        font-size: 14px;
                    ">
                        📧 <strong>Demo Version:</strong> Contact form disabled. 
                        <a href="https://cymonzi.gumroad.com/l/aiiqzk" target="_blank" style="color: white; text-decoration: underline;">
                            Get full version
                        </a> to enable all features.
                    </div>
                `;
                contactForm.parentNode.insertBefore(demoNotice, contactForm);
                
                // Disable form submission
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('Contact form is disabled in demo version. Purchase the full template to enable all features.');
                });
            }
        }, 1000);
    }
    
    removeDemoRestrictions() {
        // Remove watermark and restrictions for licensed users
        const watermark = document.getElementById('demo-watermark');
        if (watermark) watermark.remove();
        
        // Enable full functionality
        console.log('🚀 Full template features activated!');
    }
    
    setupProtection() {
        // Disable right-click context menu in demo mode
        if (this.demoMode) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showProtectionMessage();
            });
            
            // Disable F12, Ctrl+Shift+I, Ctrl+U
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    this.showProtectionMessage();
                }
            });
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
