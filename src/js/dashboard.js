// Dashboard JavaScript Handler
class DashboardManager {
    constructor() {
        this.userMenuButton = document.getElementById('userMenu');
        this.userDropdown = document.getElementById('userDropdown');
        this.logoutButton = document.getElementById('logoutBtn');
        this.userWelcome = document.getElementById('userWelcome');
        this.lastLogin = document.getElementById('lastLogin');
        
        this.init();
    }
    
    init() {
        // Check authentication
        if (!window.supabaseClient.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        // Set user info
        this.setUserInfo();
        
        // Bind event listeners
        this.bindEventListeners();
        
        // Initialize animations
        this.initializeAnimations();
        
        // Add tool card interactions
        this.setupToolCards();
        
        // Setup demo mode if enabled
        this.setupDemoMode();
    }
    
    bindEventListeners() {
        // User menu dropdown
        this.userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.userDropdown.contains(e.target) && !this.userMenuButton.contains(e.target)) {
                this.closeUserDropdown();
            }
        });
        
        // Logout handler
        this.logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeUserDropdown();
            }
        });
    }
    
    setUserInfo() {
        const session = window.supabaseClient.getSession();
        if (session && session.user) {
            const username = session.user.username || 'User';
            this.userWelcome.textContent = `Welcome back, ${username}!`;
            
            const loginTime = new Date(session.user.loginTime || session.timestamp);
            this.lastLogin.textContent = `Last login: ${this.formatDate(loginTime)}`;
        }
    }
    
    formatDate(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        
        return date.toLocaleDateString();
    }
    
    toggleUserDropdown() {
        this.userDropdown.classList.toggle('hidden');
    }
    
    closeUserDropdown() {
        this.userDropdown.classList.add('hidden');
    }
    
    async handleLogout() {
        // Add loading state
        this.logoutButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing out...';
        
        // Clear session
        window.supabaseClient.clearSession();
        
        // Add fade out effect
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        // Redirect after animation
        setTimeout(() => {
            this.redirectToLogin();
        }, 500);
    }
    
    redirectToLogin() {
        window.location.href = 'index.html';
    }
    
    initializeAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s ease-out';
            observer.observe(section);
        });
    }
    
    setupToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach((card, index) => {
            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add click ripple effect
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') return; // Don't interfere with button clicks
                
                const ripple = document.createElement('div');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                ripple.classList.add('ripple');
                
                card.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple CSS
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    
    setupDemoMode() {
        // Demo mode disabled in production
        // This method is kept for compatibility but no longer shows demo banners
        console.log('HR Tools Portal running in production mode');
    }
}

// Global tool launcher function
function openTool(url) {
    // Add analytics tracking (optional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tool_launch', {
            'tool_url': url,
            'timestamp': new Date().toISOString()
        });
    }
    
    // Show loading indicator
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Launching...';
    button.disabled = true;
    
    // Open in new tab
    setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Restore button
        button.innerHTML = originalText;
        button.disabled = false;
    }, 500);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${getNotificationStyles(type)}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${getNotificationIcon(type)} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-sm">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationStyles(type) {
    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-yellow-900',
        info: 'bg-blue-500 text-white'
    };
    return styles[type] || styles.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Feature flags for upcoming tools
const FEATURE_FLAGS = {
    personalCoach: false,
    certificateGenerator: false,
    socialMediaGenerator: false,
    wellnessAdvisor: false
};

// Demo mode functions removed for production
// These functions are no longer available in production mode

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
    
    // Add some welcome animations
    setTimeout(() => {
        showNotification('Welcome to HR Tools Portal!', 'success');
    }, 1000);
});

// Handle page visibility for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.querySelectorAll('.tool-card').forEach(card => {
            card.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab becomes visible
        document.querySelectorAll('.tool-card').forEach(card => {
            card.style.animationPlayState = 'running';
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Dashboard error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Add service worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Export for external use
window.DashboardManager = DashboardManager;