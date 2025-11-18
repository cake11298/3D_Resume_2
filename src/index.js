// ===== GUSTAVE 3D INTERACTIVE RESUME - MAIN ENTRY POINT =====

import './styles/main.css';
import * as THREE from 'three';
import Application from './components/Application';
import { checkWebGLSupport } from './utils/helpers';

// Check WebGL support
if (!checkWebGLSupport()) {
    alert('Your browser does not support WebGL. Please use a modern browser like Chrome, Firefox, or Edge.');
    throw new Error('WebGL not supported');
}

// Loading manager
const loadingManager = new THREE.LoadingManager();
let loadingPercentage = 0;
let hasResources = false;

// Update loading progress
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    hasResources = true;
    loadingPercentage = (itemsLoaded / itemsTotal) * 100;
    updateLoadingScreen(loadingPercentage);
};

// Loading complete
loadingManager.onLoad = () => {
    console.log('✨ All resources loaded!');
    setTimeout(() => {
        hideLoadingScreen();
    }, 500);
};

// Loading error
loadingManager.onError = (url) => {
    console.error('❌ Error loading:', url);
};

// Simulate loading progress if no resources (for initial setup)
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            updateLoadingScreen(100);
            setTimeout(() => {
                if (!hasResources) {
                    hideLoadingScreen();
                }
            }, 300);
        } else {
            updateLoadingScreen(progress);
        }
    }, 150);
}

// Update loading screen UI
function updateLoadingScreen(percentage) {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingPercentageEl = document.querySelector('.loading-percentage');

    if (loadingBar) {
        loadingBar.style.width = `${percentage}%`;
    }
    if (loadingPercentageEl) {
        loadingPercentageEl.textContent = `${Math.round(percentage)}%`;
    }
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Gustave 3D Resume...');

    // Start loading simulation
    simulateLoading();

    // Create and start the application
    const app = new Application({
        container: document.getElementById('webgl-container'),
        loadingManager: loadingManager
    });

    // Start the application
    app.init();

    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
        app.dispose();
    });

    // Make app globally accessible for debugging
    if (process.env.NODE_ENV === 'development') {
        window.__APP__ = app;
    }
});
