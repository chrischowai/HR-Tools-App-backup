// Login Form Handler
class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('loginBtn');
        this.loadingState = document.getElementById('loadingState');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        
        this.init();
    }
    
    init() {
        // Check if already logged in
        if (window.supabaseClient.isAuthenticated()) {
            this.redirectToDashboard();
            return;
        }
        
        // Bind event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Add enter key handler for better UX
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit(e);
            }
        });
        
        // Add focus effects
        this.usernameInput.addEventListener('focus', this.addFocusEffect.bind(this));
        this.passwordInput.addEventListener('focus', this.addFocusEffect.bind(this));
        this.usernameInput.addEventListener('blur', this.removeFocusEffect.bind(this));
        this.passwordInput.addEventListener('blur', this.removeFocusEffect.bind(this));
        
        // Add typing effect to placeholder
        this.addTypingEffect();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }
        
        this.showLoading();
        this.intensifyMatrix();
        
        try {
            // Add small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await window.supabaseClient.validateLogin(username, password);
            
            if (result.success) {
                window.supabaseClient.setSession(result.user);
                this.showSuccess();
                
                // Add success animation
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
            } else {
                this.showError(result.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Authentication service unavailable. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    showLoading() {
        this.form.classList.add('hidden');
        this.loadingState.classList.remove('hidden');
        this.hideError();
    }
    
    hideLoading() {
        this.form.classList.remove('hidden');
        this.loadingState.classList.add('hidden');
    }
    
    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Add shake animation
        this.errorMessage.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.errorMessage.style.animation = '';
        }, 500);
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
    
    showSuccess() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'mt-4 p-3 bg-green-900/50 border border-green-500/50 rounded text-green-200 font-mono text-sm text-center';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            Authentication successful! Redirecting...
        `;
        
        this.form.appendChild(successDiv);
        
        // Add success glow effect
        successDiv.style.animation = 'glow 1s ease-in-out infinite alternate';
    }
    
    addFocusEffect(e) {
        e.target.parentElement.style.transform = 'scale(1.02)';
        e.target.parentElement.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
    }
    
    removeFocusEffect(e) {
        e.target.parentElement.style.transform = 'scale(1)';
        e.target.parentElement.style.boxShadow = '';
    }
    
    intensifyMatrix() {
        if (window.matrixAnimation) {
            window.matrixAnimation.intensify();
        }
    }
    
    addTypingEffect() {
        const originalPlaceholder = this.usernameInput.placeholder;
        let index = 0;
        let typing = true;
        
        const typeEffect = () => {
            if (typing) {
                this.usernameInput.placeholder = originalPlaceholder.slice(0, index + 1) + '_';
                index++;
                if (index >= originalPlaceholder.length) {
                    typing = false;
                    setTimeout(typeEffect, 2000);
                }
            } else {
                this.usernameInput.placeholder = originalPlaceholder.slice(0, index) + '_';
                index--;
                if (index < 0) {
                    typing = true;
                    index = 0;
                    setTimeout(typeEffect, 1000);
                }
            }
            
            if (document.activeElement !== this.usernameInput) {
                setTimeout(typeEffect, typing ? 100 : 50);
            } else {
                this.usernameInput.placeholder = originalPlaceholder;
            }
        };
        
        // Start typing effect after a delay
        setTimeout(() => {
            if (document.activeElement !== this.usernameInput) {
                typeEffect();
            }
        }, 2000);
    }
    
    redirectToDashboard() {
        // Fade out effect
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    }
}

// Add shake animation CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize login handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.loginHandler = new LoginHandler();
});

// Production mode - demo authentication disabled
const DEMO_MODE = false;

// Production authentication uses Supabase Edge function
if (DEMO_MODE) {
    console.warn('Demo mode is disabled in production');
}
