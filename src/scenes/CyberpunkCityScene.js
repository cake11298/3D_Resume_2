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

        // NEW: Add more dynamic elements
        this.createFlyingDrones();
        this.createHolographicBillboards();
        this.createNeonSigns();
        this.createDataStreams();
        this.createFloatingPlatforms();
        this.createLaserGrid();
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

    createFlyingDrones() {
        // Flying surveillance drones
        const droneCount = 5;
        this.drones = [];

        for (let i = 0; i < droneCount; i++) {
            const droneGroup = new THREE.Group();

            // Drone body
            const bodyGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const bodyMaterial = createNeonMaterial(0x00FFFF, 1);
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            droneGroup.add(body);

            // Propellers
            for (let j = 0; j < 4; j++) {
                const propGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.1);
                const propMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
                const prop = new THREE.Mesh(propGeometry, propMaterial);

                const angle = (j / 4) * Math.PI * 2;
                prop.position.x = Math.cos(angle) * 0.5;
                prop.position.z = Math.sin(angle) * 0.5;
                prop.rotation.y = angle;
                droneGroup.add(prop);
            }

            // Light underneath
            const light = new THREE.PointLight(0x00FFFF, 1, 5);
            light.position.y = -0.3;
            droneGroup.add(light);

            droneGroup.position.set(
                random(-30, 30),
                random(5, 15),
                random(-30, 0)
            );

            droneGroup.userData.path = i;
            droneGroup.userData.speed = random(2, 4);

            this.add(droneGroup);
            this.drones.push(droneGroup);
        }

        // Animate drones
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.drones.forEach((drone, index) => {
                    const t = elapsedTime * 0.3 + index * 2;
                    drone.position.x = Math.cos(t) * 20;
                    drone.position.z = Math.sin(t) * 20 - 10;
                    drone.position.y = 8 + Math.sin(t * 3) * 2;

                    // Rotate propellers
                    drone.children.forEach((child, i) => {
                        if (i > 0 && i < 5) {
                            child.rotation.z += deltaTime * 30;
                        }
                    });
                });
            }
        });
    }

    createHolographicBillboards() {
        // Floating holographic advertisement screens
        const billboardCount = 4;

        for (let i = 0; i < billboardCount; i++) {
            const billboardGroup = new THREE.Group();

            // Screen
            const screenGeometry = new THREE.PlaneGeometry(4, 2.5);
            const screenMaterial = new THREE.MeshBasicMaterial({
                color: [0xFF00FF, 0x00FFFF, 0xFFFF00, 0xFF0099][i],
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            billboardGroup.add(screen);

            // Frame
            const frameGeometry = new THREE.BoxGeometry(4.2, 2.7, 0.1);
            const frameMaterial = createNeonMaterial(0xFFFFFF, 0.5);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.z = -0.05;
            billboardGroup.add(frame);

            billboardGroup.position.set(
                random(-40, 40),
                random(8, 18),
                random(-40, -15)
            );
            billboardGroup.rotation.y = Math.PI;

            this.add(billboardGroup);

            // Animate billboard
            this.addAnimatable({
                update: (deltaTime, elapsedTime) => {
                    // Pulsing glow
                    screenMaterial.opacity = 0.5 + Math.sin(elapsedTime * 2 + i) * 0.2;

                    // Gentle floating
                    billboardGroup.position.y += Math.sin(elapsedTime + i) * 0.01;
                }
            });
        }
    }

    createNeonSigns() {
        // Neon signs on buildings
        const signs = [
            { text: 'GUSTAVE', color: 0xFF00FF, pos: [-20, 15, -20] },
            { text: 'CYBER', color: 0x00FFFF, pos: [20, 12, -25] },
            { text: 'DEV', color: 0xFFFF00, pos: [-15, 18, -30] },
            { text: 'CODE', color: 0xFF0099, pos: [25, 14, -18] }
        ];

        signs.forEach(signData => {
            const signGroup = new THREE.Group();

            // Create tubes for neon effect
            for (let i = 0; i < 3; i++) {
                const tubeGeometry = new THREE.BoxGeometry(3, 1, 0.2);
                const tubeMaterial = new THREE.MeshBasicMaterial({
                    color: signData.color,
                    transparent: true,
                    opacity: 0.8
                });
                const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                tube.position.z = i * 0.1;
                signGroup.add(tube);
            }

            // Add point light
            const light = new THREE.PointLight(signData.color, 2, 10);
            signGroup.add(light);

            signGroup.position.set(...signData.pos);
            this.add(signGroup);

            // Animate flicker
            this.addAnimatable({
                update: (deltaTime, elapsedTime) => {
                    if (Math.random() > 0.95) {
                        light.intensity = random(1, 3);
                    }
                }
            });
        });
    }

    createDataStreams() {
        // Digital data streams flowing upwards
        const streamCount = 15;
        this.dataStreams = [];

        for (let i = 0; i < streamCount; i++) {
            const particleCount = 20;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            const baseColor = new THREE.Color([0xFF00FF, 0x00FFFF, 0xFFFF00][i % 3]);

            for (let j = 0; j < particleCount; j++) {
                positions[j * 3] = random(-40, 40);
                positions[j * 3 + 1] = random(0, 30);
                positions[j * 3 + 2] = random(-40, -5);

                colors[j * 3] = baseColor.r;
                colors[j * 3 + 1] = baseColor.g;
                colors[j * 3 + 2] = baseColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const stream = new THREE.Points(geometry, material);
            this.add(stream);
            this.dataStreams.push({ mesh: stream, speed: random(5, 15) });
        }

        // Animate data streams
        this.addAnimatable({
            update: (deltaTime) => {
                this.dataStreams.forEach(stream => {
                    const positions = stream.mesh.geometry.attributes.position.array;

                    for (let i = 0; i < positions.length / 3; i++) {
                        positions[i * 3 + 1] += stream.speed * deltaTime;

                        if (positions[i * 3 + 1] > 30) {
                            positions[i * 3 + 1] = 0;
                            positions[i * 3] = random(-40, 40);
                            positions[i * 3 + 2] = random(-40, -5);
                        }
                    }

                    stream.mesh.geometry.attributes.position.needsUpdate = true;
                });
            }
        });
    }

    createFloatingPlatforms() {
        // Floating platforms with neon edges
        const platformCount = 6;

        for (let i = 0; i < platformCount; i++) {
            const platformGroup = new THREE.Group();

            // Platform surface
            const surfaceGeometry = new THREE.BoxGeometry(3, 0.3, 3);
            const surfaceMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a2e,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x1a1a2e,
                emissiveIntensity: 0.2
            });
            const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
            platformGroup.add(surface);

            // Neon edges
            const edgeGeometry = new THREE.EdgesGeometry(surfaceGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: [0xFF00FF, 0x00FFFF][i % 2]
            });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            platformGroup.add(edges);

            // Glowing core
            const coreGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const coreMaterial = createNeonMaterial([0xFF00FF, 0x00FFFF][i % 2], 2);
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            core.position.y = -0.5;
            platformGroup.add(core);

            platformGroup.position.set(
                random(-25, 25),
                random(2, 8),
                random(-15, 5)
            );

            this.add(platformGroup);

            // Animate platform
            this.addAnimatable({
                update: (deltaTime, elapsedTime) => {
                    platformGroup.position.y += Math.sin(elapsedTime * 2 + i) * 0.02;
                    platformGroup.rotation.y += deltaTime * 0.3;
                }
            });
        }
    }

    createLaserGrid() {
        // Vertical laser beams creating a grid effect
        const laserCount = 10;

        for (let i = 0; i < laserCount; i++) {
            const x = (i - laserCount / 2) * 8;

            // Laser beam
            const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 30, 8);
            const beamMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0xFF00FF : 0x00FFFF,
                transparent: true,
                opacity: 0.3
            });
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.position.set(x, 15, -25);
            this.add(beam);

            // Animate beam
            this.addAnimatable({
                update: (deltaTime, elapsedTime) => {
                    beamMaterial.opacity = 0.2 + Math.sin(elapsedTime * 3 + i) * 0.1;
                }
            });
        }
    }

    onEnter() {
        super.onEnter();
        console.log('🌃 Welcome to Cyberpunk City!');
    }
}
