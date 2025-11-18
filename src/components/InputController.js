// ===== INPUT CONTROLLER - HANDLES KEYBOARD AND MOUSE INPUT =====

export default class InputController {
    constructor(app) {
        this.app = app;

        // Key states
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false,
            shift: false,
            escape: false
        };

        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            normalizedX: 0,
            normalizedY: 0,
            isDown: false
        };

        // Touch state
        this.touch = {
            isActive: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        // Mouse events
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Touch events
        window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Prevent context menu
        window.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        });
    }

    onKeyDown(event) {
        const key = event.key.toLowerCase();

        switch (key) {
            case 'w':
            case 'arrowup':
                this.keys.w = true;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.a = true;
                break;
            case 's':
            case 'arrowdown':
                this.keys.s = true;
                break;
            case 'd':
            case 'arrowright':
                this.keys.d = true;
                break;
            case ' ':
                this.keys.space = true;
                event.preventDefault();
                break;
            case 'shift':
                this.keys.shift = true;
                break;
            case 'escape':
                this.keys.escape = true;
                this.toggleMenu();
                break;
        }
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();

        switch (key) {
            case 'w':
            case 'arrowup':
                this.keys.w = false;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.a = false;
                break;
            case 's':
            case 'arrowdown':
                this.keys.s = false;
                break;
            case 'd':
            case 'arrowright':
                this.keys.d = false;
                break;
            case ' ':
                this.keys.space = false;
                break;
            case 'shift':
                this.keys.shift = false;
                break;
            case 'escape':
                this.keys.escape = false;
                break;
        }
    }

    onMouseMove(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;

        // Normalized coordinates (-1 to 1)
        this.mouse.normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseDown(event) {
        this.mouse.isDown = true;
    }

    onMouseUp(event) {
        this.mouse.isDown = false;
    }

    onTouchStart(event) {
        if (event.target.tagName === 'CANVAS') {
            event.preventDefault();

            const touch = event.touches[0];
            this.touch.isActive = true;
            this.touch.startX = touch.clientX;
            this.touch.startY = touch.clientY;
            this.touch.currentX = touch.clientX;
            this.touch.currentY = touch.clientY;
        }
    }

    onTouchMove(event) {
        if (event.target.tagName === 'CANVAS') {
            event.preventDefault();

            const touch = event.touches[0];
            this.touch.currentX = touch.clientX;
            this.touch.currentY = touch.clientY;

            // Update mouse position for compatibility
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.mouse.normalizedX = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.normalizedY = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
    }

    onTouchEnd(event) {
        this.touch.isActive = false;
    }

    toggleMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');

        if (menuToggle && mainNav) {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('nav-hidden');
        }
    }

    update(deltaTime) {
        // Update logic based on input state
        // This can be extended by scenes to handle movement, etc.
    }

    dispose() {
        // Remove event listeners
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        window.removeEventListener('keyup', this.onKeyUp.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('mousedown', this.onMouseDown.bind(this));
        window.removeEventListener('mouseup', this.onMouseUp.bind(this));
        window.removeEventListener('touchstart', this.onTouchStart.bind(this));
        window.removeEventListener('touchmove', this.onTouchMove.bind(this));
        window.removeEventListener('touchend', this.onTouchEnd.bind(this));
    }
}
