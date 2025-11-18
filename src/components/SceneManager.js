// ===== SCENE MANAGER - HANDLES SCENE TRANSITIONS =====

import * as THREE from 'three';
import gsap from 'gsap';

// Import scenes
import HomeScene from '../scenes/HomeScene';
import CyberpunkCityScene from '../scenes/CyberpunkCityScene';
import RockStageScene from '../scenes/RockStageScene';
import ArcadeScene from '../scenes/ArcadeScene';
import TimelineScene from '../scenes/TimelineScene';
import GalaxyScene from '../scenes/GalaxyScene';
import CartoonScene from '../scenes/CartoonScene';
import NetworkScene from '../scenes/NetworkScene';

export default class SceneManager {
    constructor(app) {
        this.app = app;
        this.currentScene = null;
        this.scenes = new Map();
        this.isTransitioning = false;

        // Scene registry
        this.sceneClasses = {
            'home': HomeScene,
            'cyberpunk-city': CyberpunkCityScene,
            'rock-stage': RockStageScene,
            'arcade': ArcadeScene,
            'timeline': TimelineScene,
            'galaxy': GalaxyScene,
            'cartoon': CartoonScene,
            'network': NetworkScene
        };

        // Initialize with home scene
        this.switchScene('home');
    }

    /**
     * Switch to a different scene
     * @param {string} sceneName - Name of the scene to switch to
     */
    switchScene(sceneName) {
        if (this.isTransitioning) {
            console.warn('Scene transition already in progress');
            return;
        }

        console.log(`🔄 Switching to scene: ${sceneName}`);

        // Check if scene exists
        if (!this.sceneClasses[sceneName]) {
            console.error(`Scene "${sceneName}" not found`);
            return;
        }

        this.isTransitioning = true;

        // Show scene info
        this.showSceneInfo(sceneName);

        // Transition out current scene
        if (this.currentScene) {
            this.transitionOut(() => {
                this.loadScene(sceneName);
            });
        } else {
            this.loadScene(sceneName);
        }
    }

    /**
     * Load a scene
     * @param {string} sceneName - Name of the scene to load
     */
    loadScene(sceneName) {
        // Get or create scene
        let scene;

        if (this.scenes.has(sceneName)) {
            scene = this.scenes.get(sceneName);
        } else {
            const SceneClass = this.sceneClasses[sceneName];
            scene = new SceneClass(this.app);
            this.scenes.set(sceneName, scene);
        }

        // Unload current scene content from Three.js scene
        if (this.currentScene) {
            this.currentScene.exit();
        }

        // Load new scene
        this.currentScene = scene;
        this.currentScene.enter();

        // Transition in
        this.transitionIn();
    }

    /**
     * Transition out effect
     * @param {Function} callback - Callback when transition complete
     */
    transitionOut(callback) {
        const camera = this.app.camera;

        // Camera zoom out effect
        gsap.to(camera.position, {
            z: camera.position.z + 5,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                if (callback) callback();
            }
        });

        // Fade out scene
        gsap.to(this.app.scene.fog, {
            density: 0.1,
            duration: 0.5
        });
    }

    /**
     * Transition in effect
     */
    transitionIn() {
        const camera = this.app.camera;

        // Reset fog
        this.app.scene.fog.density = 0.01;

        // Camera zoom in effect
        gsap.to(camera.position, {
            z: 5,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                this.isTransitioning = false;
                this.hideSceneInfo();
            }
        });
    }

    /**
     * Show scene information overlay
     * @param {string} sceneName - Name of the scene
     */
    showSceneInfo(sceneName) {
        const sceneInfo = document.getElementById('scene-info');
        const sceneTitle = document.getElementById('scene-title');
        const sceneDescription = document.getElementById('scene-description');

        const sceneData = this.getSceneData(sceneName);

        if (sceneTitle) sceneTitle.textContent = sceneData.title;
        if (sceneDescription) sceneDescription.textContent = sceneData.description;

        if (sceneInfo) {
            sceneInfo.classList.add('show');
        }
    }

    /**
     * Hide scene information overlay
     */
    hideSceneInfo() {
        setTimeout(() => {
            const sceneInfo = document.getElementById('scene-info');
            if (sceneInfo) {
                sceneInfo.classList.remove('show');
            }
        }, 2000);
    }

    /**
     * Get scene metadata
     * @param {string} sceneName - Name of the scene
     * @returns {Object} Scene data
     */
    getSceneData(sceneName) {
        const sceneDataMap = {
            'home': {
                title: 'Welcome',
                description: 'Enter the digital realm of Gustave'
            },
            'cyberpunk-city': {
                title: 'About Me',
                description: 'Explore my journey in the neon city'
            },
            'rock-stage': {
                title: 'Skills',
                description: 'Rock the stage with my technical abilities'
            },
            'arcade': {
                title: 'Projects',
                description: 'Play through my portfolio of work'
            },
            'timeline': {
                title: 'Experience',
                description: 'Travel through my career timeline'
            },
            'galaxy': {
                title: 'Education',
                description: 'Journey through the knowledge galaxy'
            },
            'cartoon': {
                title: 'Hobbies',
                description: 'Welcome to my colorful world'
            },
            'network': {
                title: 'Contact',
                description: 'Connect with me across the network'
            }
        };

        return sceneDataMap[sceneName] || { title: sceneName, description: '' };
    }

    /**
     * Update current scene
     * @param {number} deltaTime - Time since last frame
     * @param {number} elapsedTime - Total elapsed time
     */
    update(deltaTime, elapsedTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime, elapsedTime);
        }
    }

    /**
     * Dispose all scenes
     */
    dispose() {
        this.scenes.forEach(scene => {
            if (scene.dispose) {
                scene.dispose();
            }
        });
        this.scenes.clear();
        this.currentScene = null;
    }
}
