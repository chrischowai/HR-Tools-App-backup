class MatrixAnimation {
    constructor() {
        this.container = document.getElementById('matrix-container');
        this.columns = [];
        this.animationId = null;
        this.isRunning = false;
        
        // Matrix characters - binary digits (0s and 1s) to match reference image
        this.characters = ['0', '1'];
        
        // Performance optimization variables
        this.performanceMode = false;
        this.lastFrameTime = 0;
        this.targetFrameInterval = 33; // ~30fps for performance
        this.animationSpeed = 1;
        
        this.init();
    }
    
    init() {
        this.setupColumns();
        this.start();
        this.setupInputListeners();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Performance optimization - pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.start();
            }
        });
    }
    
    setupInputListeners() {
        // Wait for DOM to be fully loaded
        const attachListeners = () => {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            const handleFocus = () => {
                this.performanceMode = true;
                this.animationSpeed = 0.15; // Slow down to 15% speed during input
            };
            
            const handleBlur = () => {
                this.performanceMode = false;
                this.animationSpeed = 1; // Resume normal speed
            };
            
            if (usernameInput) {
                usernameInput.addEventListener('focus', handleFocus);
                usernameInput.addEventListener('blur', handleBlur);
            }
            
            if (passwordInput) {
                passwordInput.addEventListener('focus', handleFocus);
                passwordInput.addEventListener('blur', handleBlur);
            }
        };
        
        // Try to attach immediately or wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachListeners);
        } else {
            attachListeners();
        }
    }
    
    setupColumns() {
        this.container.innerHTML = '';
        this.columns = [];
        
        const columnWidth = this.getColumnWidth();
        const numColumns = Math.ceil(window.innerWidth / columnWidth);
        
        for (let i = 0; i < numColumns; i++) {
            const column = this.createColumn(i * columnWidth);
            this.columns.push(column);
            this.container.appendChild(column.element);
        }
    }
    
    getColumnWidth() {
        // Responsive column width based on screen size - denser for binary matrix
        if (window.innerWidth <= 480) return 10;
        if (window.innerWidth <= 768) return 12;
        return 15;
    }
    
    createColumn(x) {
        const element = document.createElement('div');
        element.className = 'matrix-column';
        element.style.left = x + 'px';
        
        const column = {
            element: element,
            x: x,
            chars: [],
            speed: Math.random() * 3 + 1, // Random speed between 1-4
            delay: Math.random() * 2000, // Random delay up to 2 seconds
            lastUpdate: 0
        };
        
        this.populateColumn(column);
        return column;
    }
    
    populateColumn(column) {
        const maxChars = Math.ceil(window.innerHeight / 16) + 20; // More characters for better effect
        column.chars = [];
        
        // Create fewer characters initially (80% of original), they'll fall from top
        const initialChars = Math.floor(Math.random() * 16) + 8;
        
        for (let i = 0; i < initialChars; i++) {
            const char = document.createElement('span');
            char.className = 'matrix-char';
            char.textContent = this.getRandomChar();
            
            // Position characters vertically with some spacing using transform for GPU acceleration
            char.style.position = 'absolute';
            const initialY = i * 16 - Math.random() * window.innerHeight;
            char.setAttribute('data-y', initialY);
            char.style.transform = `translateY(${initialY}px)`;
            char.style.left = '0px';
            
            // Add brightness variation to match reference image
            const brightness = Math.random();
            if (brightness > 0.85) {
                char.classList.add('bright');
            } else if (brightness > 0.6) {
                // Normal brightness (no class)
            } else if (brightness > 0.3) {
                char.classList.add('dim');
            } else {
                char.classList.add('darker');
            }
            
            column.element.appendChild(char);
            column.chars.push(char);
        }
    }
    
    getRandomChar() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate(currentTime) {
        if (!this.isRunning) return;
        
        // Throttle to ~30fps for better performance
        if (currentTime - this.lastFrameTime < this.targetFrameInterval) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }
        
        this.lastFrameTime = currentTime;
        
        this.columns.forEach(column => {
            if (currentTime - column.lastUpdate > 100 / (column.speed * this.animationSpeed)) {
                this.updateColumn(column);
                column.lastUpdate = currentTime;
            }
        });
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    updateColumn(column) {
        // Move all characters down using transform for GPU acceleration
        column.chars.forEach((char, index) => {
            const currentY = parseFloat(char.getAttribute('data-y')) || 0;
            const newY = currentY + (column.speed * this.animationSpeed);
            
            char.setAttribute('data-y', newY);
            char.style.transform = `translateY(${newY}px)`;
            
            // If character is off screen, reset to top with new character
            if (newY > window.innerHeight + 20) {
                const resetY = -Math.random() * 100;
                char.setAttribute('data-y', resetY);
                char.style.transform = `translateY(${resetY}px)`;
                char.textContent = this.getRandomChar();
                
                // Reassign brightness
                char.className = 'matrix-char';
                const brightness = Math.random();
                if (brightness > 0.85) {
                    char.classList.add('bright');
                } else if (brightness > 0.6) {
                    // Normal brightness
                } else if (brightness > 0.3) {
                    char.classList.add('dim');
                } else {
                    char.classList.add('darker');
                }
            }
            
            // Randomly change some characters while falling (reduced frequency)
            if (Math.random() > 0.995) {
                char.textContent = this.getRandomChar();
            }
        });
    }
    
    shiftColumnDown(column) {
        // Remove last character and add new one at the top
        const lastChar = column.chars.pop();
        if (lastChar) {
            lastChar.remove();
        }
        
        const newChar = document.createElement('span');
        newChar.className = 'matrix-char';
        newChar.textContent = this.getRandomChar();
        
        // Add brightness variation to match reference image
        const brightness = Math.random();
        if (brightness > 0.85) {
            newChar.classList.add('bright');
        } else if (brightness > 0.6) {
            // Normal brightness (no class)
        } else if (brightness > 0.3) {
            newChar.classList.add('dim');
        } else {
            newChar.classList.add('darker');
        }
        
        column.element.insertBefore(newChar, column.element.firstChild);
        column.chars.unshift(newChar);
        
        // Animate the new character
        newChar.style.opacity = '0';
        newChar.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            newChar.style.opacity = '1';
            newChar.style.transform = 'translateY(0)';
            newChar.style.transition = 'all 0.3s ease';
        }, 10);
    }
    
    handleResize() {
        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.setupColumns();
        }, 250);
    }
    
    // Method to temporarily increase animation intensity (e.g., during login)
    intensify() {
        this.columns.forEach(column => {
            column.speed *= 2;
            column.chars.forEach(char => {
                char.style.animationDuration = '1s';
            });
        });
        
        setTimeout(() => {
            this.normalize();
        }, 3000);
    }
    
    normalize() {
        this.columns.forEach(column => {
            column.speed /= 2;
            column.chars.forEach(char => {
                char.style.animationDuration = '3s';
            });
        });
    }
    
    // Clean up method
    destroy() {
        this.pause();
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        this.container.innerHTML = '';
    }
}

// Initialize Matrix animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Matrix animation script loaded');
    
    // Check if container exists
    const container = document.getElementById('matrix-container');
    if (!container) {
        console.error('Matrix container not found!');
        return;
    }
    console.log('Matrix container found:', container);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log('Reduced motion preference:', prefersReducedMotion);
    
    if (!prefersReducedMotion) {
        try {
            window.matrixAnimation = new MatrixAnimation();
            console.log('Matrix animation initialized successfully');
        } catch (error) {
            console.error('Error initializing Matrix animation:', error);
            // Fallback - add a simple animated background
            container.style.background = 'linear-gradient(180deg, #001a33 0%, #003d66 30%, #00264d 70%, #000d1a 100%)';
            container.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #00d4ff; font-family: monospace; opacity: 0.2; font-size: 1.5rem; text-align: center;">MATRIX LOADING...<br/>0 1 0 1 0 1</div>';
        }
    } else {
        // Provide a static background for users who prefer reduced motion
        const container = document.getElementById('matrix-container');
        container.style.background = 'linear-gradient(180deg, #001a33 0%, #003d66 30%, #00264d 70%, #000d1a 100%)';
        container.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #00d4ff; font-family: monospace; opacity: 0.1; font-size: 2rem;">HR TOOLS PORTAL</div>';
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixAnimation;
}