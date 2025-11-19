// ===== NUCLEAR BUTTON - 3D INTERACTIVE BUTTON FOR CONTENT NAVIGATION =====

import * as THREE from 'three';

export default class NuclearButton {
    constructor(app) {
        this.app = app;
        this.group = new THREE.Group();
        this.isAnimating = false;
        this.isPressing = false;

        this.createButton();
        this.setupAnimation();
    }

    createButton() {
        // Base platform (圓形底座)
        const baseGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.15, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.8,
            roughness: 0.3
        });
        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.base.position.y = 0;
        this.base.castShadow = true;
        this.group.add(this.base);

        // Warning stripes (黃黑警示條紋)
        const stripeCount = 8;
        for (let i = 0; i < stripeCount; i++) {
            const angle = (Math.PI * 2 * i) / stripeCount;
            const stripeGeometry = new THREE.BoxGeometry(0.1, 0.16, 0.3);
            const stripeMaterial = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0xffff00 : 0x1a1a1a,
                metalness: 0.3,
                roughness: 0.7
            });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.x = Math.cos(angle) * 0.65;
            stripe.position.z = Math.sin(angle) * 0.65;
            stripe.position.y = 0.075;
            stripe.rotation.y = -angle;
            this.group.add(stripe);
        }

        // Button (紅色按鈕本體)
        const buttonGeometry = new THREE.CylinderGeometry(0.4, 0.45, 0.3, 32);
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.6,
            roughness: 0.2,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        this.button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        this.button.position.y = 0.25;
        this.button.castShadow = true;
        this.button.userData.interactive = true; // Mark as clickable
        this.button.userData.isNuclearButton = true;
        this.group.add(this.button);

        // Button top (按鈕頂部高光)
        const topGeometry = new THREE.CylinderGeometry(0.38, 0.4, 0.05, 32);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xff3333,
            emissiveIntensity: 0.5
        });
        this.buttonTop = new THREE.Mesh(topGeometry, topMaterial);
        this.buttonTop.position.y = 0.4;
        this.group.add(this.buttonTop);

        // Warning label (文字標籤)
        const labelCanvas = document.createElement('canvas');
        const context = labelCanvas.getContext('2d');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 256, 64);
        context.font = 'bold 24px Courier New';
        context.fillStyle = '#ffff00';
        context.textAlign = 'center';
        context.fillText('NEXT SEGMENT', 128, 40);

        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelGeometry = new THREE.PlaneGeometry(0.8, 0.2);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.label = new THREE.Mesh(labelGeometry, labelMaterial);
        this.label.position.y = -0.15;
        this.label.rotation.x = -Math.PI / 2;
        this.group.add(this.label);

        // Glow light (發光效果)
        this.glowLight = new THREE.PointLight(0xff0000, 2, 3);
        this.glowLight.position.y = 0.4;
        this.group.add(this.glowLight);

        // Position the entire button group
        this.group.position.set(2.5, 0.5, -2);
        this.group.scale.set(1.2, 1.2, 1.2);
    }

    setupAnimation() {
        this.pulsePhase = 0;
    }

    /**
     * Press animation
     */
    press() {
        if (this.isPressing) return;
        this.isPressing = true;

        // Press down animation
        const originalY = this.button.position.y;
        const originalTopY = this.buttonTop.position.y;

        this.button.position.y = originalY - 0.1;
        this.buttonTop.position.y = originalTopY - 0.1;

        // Flash effect
        this.button.material.emissiveIntensity = 1.0;
        this.glowLight.intensity = 5;

        // Reset after short delay
        setTimeout(() => {
            this.button.position.y = originalY;
            this.buttonTop.position.y = originalTopY;
            this.button.material.emissiveIntensity = 0.3;
            this.glowLight.intensity = 2;
            this.isPressing = false;
        }, 150);
    }

    /**
     * Update animation
     */
    update(deltaTime, elapsedTime) {
        // Pulsing glow effect
        this.pulsePhase += deltaTime * 2;
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        this.button.material.emissiveIntensity = 0.3 + pulse * 0.2;
        this.glowLight.intensity = 2 + pulse * 1;

        // Gentle rotation
        this.group.rotation.y += deltaTime * 0.2;
    }

    /**
     * Add to scene
     */
    addToScene(scene) {
        scene.add(this.group);
    }

    /**
     * Remove from scene
     */
    removeFromScene(scene) {
        scene.remove(this.group);
    }

    /**
     * Get the button mesh for raycasting
     */
    getInteractiveMesh() {
        return this.button;
    }

    dispose() {
        // Clean up geometries and materials
        this.group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
            }
        });
    }
}
