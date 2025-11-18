// ===== BASE SCENE CLASS - TEMPLATE FOR ALL SCENES =====

import * as THREE from 'three';
import { disposeObject } from '../utils/helpers';

export default class BaseScene {
    constructor(app) {
        this.app = app;
        this.sceneObjects = new THREE.Group();
        this.name = 'BaseScene';

        // Scene-specific properties
        this.isActive = false;
        this.animatables = [];
    }

    /**
     * Initialize scene content
     * Override this method in child classes
     */
    init() {
        console.log(`Initializing scene: ${this.name}`);
    }

    /**
     * Called when entering the scene
     */
    enter() {
        if (this.isActive) return;

        console.log(`Entering scene: ${this.name}`);

        // Add scene objects to main scene
        this.app.scene.add(this.sceneObjects);

        // Initialize if not already done
        if (this.sceneObjects.children.length === 0) {
            this.init();
        }

        this.isActive = true;
        this.onEnter();
    }

    /**
     * Called when exiting the scene
     */
    exit() {
        if (!this.isActive) return;

        console.log(`Exiting scene: ${this.name}`);

        // Remove scene objects from main scene
        this.app.scene.remove(this.sceneObjects);

        this.isActive = false;
        this.onExit();
    }

    /**
     * Override in child classes for custom enter logic
     */
    onEnter() {
        // Override in child classes
    }

    /**
     * Override in child classes for custom exit logic
     */
    onExit() {
        // Override in child classes
    }

    /**
     * Update scene
     * @param {number} deltaTime - Time since last frame
     * @param {number} elapsedTime - Total elapsed time
     */
    update(deltaTime, elapsedTime) {
        if (!this.isActive) return;

        // Update animatable objects
        this.animatables.forEach(obj => {
            if (obj.update) {
                obj.update(deltaTime, elapsedTime);
            }
        });
    }

    /**
     * Add an object to the scene
     * @param {THREE.Object3D} object - Object to add
     */
    add(object) {
        this.sceneObjects.add(object);
    }

    /**
     * Remove an object from the scene
     * @param {THREE.Object3D} object - Object to remove
     */
    remove(object) {
        this.sceneObjects.remove(object);
    }

    /**
     * Add an animatable object
     * @param {Object} object - Object with update method
     */
    addAnimatable(object) {
        if (!this.animatables.includes(object)) {
            this.animatables.push(object);
        }
    }

    /**
     * Clean up scene resources
     */
    dispose() {
        console.log(`Disposing scene: ${this.name}`);

        // Dispose all scene objects
        disposeObject(this.sceneObjects);

        // Clear arrays
        this.animatables = [];

        this.isActive = false;
    }
}
