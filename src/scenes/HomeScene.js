// ===== HOME SCENE - WELCOME SCENE =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, createNeonGrid, createParticles } from '../utils/helpers';

export default class HomeScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'HomeScene';
    }

    init() {
        super.init();

        // Create neon grid floor
        this.createFloor();

        // Create floating name display
        this.createNameDisplay();

        // Create particle background
        this.createParticleBackground();

        // Create floating orbs
        this.createFloatingOrbs();
    }

    createFloor() {
        const grid = createNeonGrid(100, 100, 0xFF00FF, 0x00FFFF);
        grid.position.y = -2;
        this.add(grid);
    }

    createNameDisplay() {
        // Create a large text mesh (using 3D geometry for now)
        // In production, you'd use TextGeometry with a font loader

        const geometry = new THREE.BoxGeometry(4, 1, 0.2);
        const material = createNeonMaterial(0xFF00FF, 3);

        const nameBox = new THREE.Mesh(geometry, material);
        nameBox.position.set(0, 2, 0);

        this.add(nameBox);

        // Add to animatables for rotation
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                nameBox.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3;
                nameBox.position.y = 2 + Math.sin(elapsedTime) * 0.2;
            }
        });

        this.nameBox = nameBox;
    }

    createParticleBackground() {
        const particles = createParticles(2000, 0xFF00FF, 0.05);
        particles.position.z = -10;
        this.add(particles);

        // Animate particles
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                particles.rotation.y = elapsedTime * 0.05;

                // Animate individual particles
                const positions = particles.geometry.attributes.position.array;
                for (let i = 1; i < positions.length; i += 3) {
                    positions[i] = Math.sin(elapsedTime + i) * 20;
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    createFloatingOrbs() {
        const orbCount = 5;
        const orbs = [];

        for (let i = 0; i < orbCount; i++) {
            const geometry = new THREE.SphereGeometry(0.3, 32, 32);
            const material = createNeonMaterial(
                i % 2 === 0 ? 0xFF00FF : 0x00FFFF,
                2
            );

            const orb = new THREE.Mesh(geometry, material);

            // Position orbs in a circle
            const angle = (i / orbCount) * Math.PI * 2;
            const radius = 3;
            orb.position.x = Math.cos(angle) * radius;
            orb.position.z = Math.sin(angle) * radius;
            orb.position.y = 1;

            this.add(orb);
            orbs.push({ mesh: orb, angle, radius, speed: 0.5 + Math.random() * 0.5 });
        }

        // Animate orbs
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                orbs.forEach((orb, index) => {
                    const newAngle = orb.angle + elapsedTime * orb.speed;
                    orb.mesh.position.x = Math.cos(newAngle) * orb.radius;
                    orb.mesh.position.z = Math.sin(newAngle) * orb.radius;
                    orb.mesh.position.y = 1 + Math.sin(elapsedTime * 2 + index) * 0.5;
                    orb.mesh.rotation.y += deltaTime * 2;
                });
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🏠 Welcome to Home Scene!');
    }

    onExit() {
        super.onExit();
        console.log('👋 Leaving Home Scene');
    }
}
