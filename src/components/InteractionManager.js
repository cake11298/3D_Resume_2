// ===== INTERACTION MANAGER - CLICK & HOVER SYSTEM =====

import * as THREE from 'three';
import gsap from 'gsap';

export default class InteractionManager {
    constructor(app) {
        this.app = app;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredObject = null;
        this.interactiveObjects = [];
        this.onClickCallbacks = new Map();
        this.onHoverCallbacks = new Map();

        // Highlight materials
        this.originalMaterials = new Map();
        this.highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFF00,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        const canvas = this.app.renderer.domElement;

        // Mouse move for hover detection
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Click for interactions
        canvas.addEventListener('click', this.onClick.bind(this));

        // Touch support
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    }

    onMouseMove(event) {
        const rect = this.app.renderer.domElement.getBoundingClientRect();

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.checkHover();
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            const rect = this.app.renderer.domElement.getBoundingClientRect();
            const touch = event.touches[0];

            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

            this.checkClick();
        }
    }

    onClick(event) {
        this.checkClick();
    }

    checkHover() {
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.app.camera);

        // Get intersections
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        // Reset previous hover
        if (this.hoveredObject && (!intersects.length || intersects[0].object !== this.hoveredObject)) {
            this.clearHover();
        }

        // Set new hover
        if (intersects.length > 0) {
            const object = intersects[0].object;

            if (object !== this.hoveredObject) {
                this.setHover(object);
            }
        }
    }

    checkClick() {
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.app.camera);

        // Get intersections
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.handleClick(object);
        }
    }

    setHover(object) {
        this.hoveredObject = object;

        // Change cursor
        document.body.style.cursor = 'pointer';

        // Apply highlight effect
        this.applyHighlight(object);

        // Call hover callback
        const callback = this.onHoverCallbacks.get(object);
        if (callback) {
            callback(object, true);
        }

        // Scale animation
        if (object.userData.originalScale) {
            gsap.to(object.scale, {
                x: object.userData.originalScale.x * 1.1,
                y: object.userData.originalScale.y * 1.1,
                z: object.userData.originalScale.z * 1.1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        }
    }

    clearHover() {
        if (!this.hoveredObject) return;

        // Reset cursor
        document.body.style.cursor = 'default';

        // Remove highlight
        this.removeHighlight(this.hoveredObject);

        // Call hover callback
        const callback = this.onHoverCallbacks.get(this.hoveredObject);
        if (callback) {
            callback(this.hoveredObject, false);
        }

        // Reset scale
        if (this.hoveredObject.userData.originalScale) {
            gsap.to(this.hoveredObject.scale, {
                x: this.hoveredObject.userData.originalScale.x,
                y: this.hoveredObject.userData.originalScale.y,
                z: this.hoveredObject.userData.originalScale.z,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        }

        this.hoveredObject = null;
    }

    handleClick(object) {
        console.log('Clicked:', object.userData.name || object.name);

        // Play click animation
        this.playClickAnimation(object);

        // Call click callback
        const callback = this.onClickCallbacks.get(object);
        if (callback) {
            callback(object);
        }

        // Play audio (if audio manager available)
        if (this.app.audioManager) {
            // this.app.audioManager.playSound('click');
        }
    }

    playClickAnimation(object) {
        // Quick scale pulse
        const originalScale = object.userData.originalScale || object.scale.clone();

        gsap.timeline()
            .to(object.scale, {
                x: originalScale.x * 0.9,
                y: originalScale.y * 0.9,
                z: originalScale.z * 0.9,
                duration: 0.1,
                ease: 'power2.out'
            })
            .to(object.scale, {
                x: originalScale.x * 1.15,
                y: originalScale.y * 1.15,
                z: originalScale.z * 1.15,
                duration: 0.2,
                ease: 'back.out(2)'
            })
            .to(object.scale, {
                x: originalScale.x,
                y: originalScale.y,
                z: originalScale.z,
                duration: 0.2,
                ease: 'power2.inOut'
            });
    }

    applyHighlight(object) {
        // Store original material
        if (!this.originalMaterials.has(object)) {
            this.originalMaterials.set(object, object.material);
        }

        // Apply glow effect
        if (object.material.emissive) {
            gsap.to(object.material.emissive, {
                r: 1,
                g: 1,
                b: 0,
                duration: 0.3
            });
            gsap.to(object.material, {
                emissiveIntensity: 1.5,
                duration: 0.3
            });
        }
    }

    removeHighlight(object) {
        // Restore original emissive
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial && object.material.emissive) {
            gsap.to(object.material.emissive, {
                r: originalMaterial.emissive.r,
                g: originalMaterial.emissive.g,
                b: originalMaterial.emissive.b,
                duration: 0.3
            });
            gsap.to(object.material, {
                emissiveIntensity: originalMaterial.emissiveIntensity || 0,
                duration: 0.3
            });
        }
    }

    /**
     * Register an object as interactive
     * @param {THREE.Object3D} object - The object to make interactive
     * @param {Object} options - Options for interaction
     */
    addInteractiveObject(object, options = {}) {
        if (!this.interactiveObjects.includes(object)) {
            this.interactiveObjects.push(object);

            // Store original scale for animations
            object.userData.originalScale = object.scale.clone();

            // Store name for identification
            if (options.name) {
                object.userData.name = options.name;
            }

            // Register callbacks
            if (options.onClick) {
                this.onClickCallbacks.set(object, options.onClick);
            }

            if (options.onHover) {
                this.onHoverCallbacks.set(object, options.onHover);
            }
        }
    }

    /**
     * Remove an object from interactive objects
     * @param {THREE.Object3D} object
     */
    removeInteractiveObject(object) {
        const index = this.interactiveObjects.indexOf(object);
        if (index > -1) {
            this.interactiveObjects.splice(index, 1);
            this.onClickCallbacks.delete(object);
            this.onHoverCallbacks.delete(object);
            this.originalMaterials.delete(object);
        }
    }

    /**
     * Clear all interactive objects
     */
    clearAll() {
        this.interactiveObjects = [];
        this.onClickCallbacks.clear();
        this.onHoverCallbacks.clear();
        this.originalMaterials.clear();
        this.clearHover();
    }

    /**
     * Show info panel
     * @param {Object} data - Data to display
     */
    showInfoPanel(data) {
        const panel = document.getElementById('info-panel');
        if (!panel) return;

        const title = panel.querySelector('.info-title');
        const content = panel.querySelector('.info-content');

        if (title) title.textContent = data.title || '';
        if (content) content.innerHTML = data.content || '';

        panel.classList.add('show');
    }

    /**
     * Hide info panel
     */
    hideInfoPanel() {
        const panel = document.getElementById('info-panel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    /**
     * Cleanup
     */
    dispose() {
        const canvas = this.app.renderer.domElement;
        canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.removeEventListener('click', this.onClick.bind(this));
        canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));

        this.clearAll();
    }
}
