// ===== CYBERPUNK CITY SCENE - ABOUT ME =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, createNeonGrid, random } from '../utils/helpers';

export default class CyberpunkCityScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'CyberpunkCityScene';
    }

    init() {
        super.init();

        // Create city skyline
        this.createCitySkyline();

        // Create neon grid floor
        this.createFloor();

        // Create holographic business card
        this.createBusinessCard();

        // Create flying particles (rain effect)
        this.createRainEffect();
    }

    createFloor() {
        const grid = createNeonGrid(200, 200, 0xFF00FF, 0x00FFFF);
        grid.position.y = 0;
        this.add(grid);
    }

    createCitySkyline() {
        const buildings = new THREE.Group();

        // Create multiple buildings
        for (let i = 0; i < 30; i++) {
            const width = random(1, 3);
            const height = random(5, 25);
            const depth = random(1, 3);

            const geometry = new THREE.BoxGeometry(width, height, depth);

            // Alternate neon colors
            const colors = [0xFF00FF, 0x00FFFF, 0x9D00FF, 0xFFFF00];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const material = createNeonMaterial(color, 1);

            const building = new THREE.Mesh(geometry, material);

            // Position randomly
            building.position.x = random(-50, 50);
            building.position.y = height / 2;
            building.position.z = random(-50, -10);

            buildings.add(building);

            // Add window lights
            this.addWindowLights(building, width, height, depth);
        }

        this.add(buildings);
        this.buildings = buildings;

        // Animate building lights
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                buildings.children.forEach((building, index) => {
                    // Pulsing effect
                    const pulse = Math.sin(elapsedTime * 2 + index) * 0.5 + 0.5;
                    building.material.emissiveIntensity = 0.5 + pulse * 0.5;
                });
            }
        });
    }

    addWindowLights(building, width, height, depth) {
        const windowCount = Math.floor(height / 2) * 2;

        for (let i = 0; i < windowCount; i++) {
            if (Math.random() > 0.3) { // 70% chance of window
                const windowGeometry = new THREE.PlaneGeometry(0.1, 0.1);
                const windowMaterial = new THREE.MeshBasicMaterial({
                    color: Math.random() > 0.5 ? 0xFFFF00 : 0x00FFFF,
                    transparent: true,
                    opacity: 0.8
                });

                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.x = random(-width / 3, width / 3);
                window.position.y = random(-height / 2 + 1, height / 2 - 1);
                window.position.z = depth / 2 + 0.01;

                building.add(window);
            }
        }
    }

    createBusinessCard() {
        // Create a floating holographic business card
        const cardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
        const cardMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00FFFF,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7,
            transmission: 0.2,
            clearcoat: 1.0,
            emissive: 0x00FFFF,
            emissiveIntensity: 0.5
        });

        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        card.position.set(0, 3, 2);

        this.add(card);

        // Animate card
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                card.rotation.y = elapsedTime * 0.5;
                card.position.y = 3 + Math.sin(elapsedTime * 2) * 0.3;
            }
        });
    }

    createRainEffect() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = random(-50, 50);     // x
            positions[i * 3 + 1] = random(0, 50);   // y
            positions[i * 3 + 2] = random(-50, 10); // z
            velocities[i] = random(0.5, 2);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00FFFF,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });

        const rain = new THREE.Points(geometry, material);
        this.add(rain);

        // Animate rain
        this.addAnimatable({
            update: (deltaTime) => {
                const positions = rain.geometry.attributes.position.array;

                for (let i = 0; i < particleCount; i++) {
                    positions[i * 3 + 1] -= velocities[i] * deltaTime * 20;

                    // Reset if below ground
                    if (positions[i * 3 + 1] < 0) {
                        positions[i * 3 + 1] = 50;
                    }
                }

                rain.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🌃 Welcome to Cyberpunk City!');
    }
}
