// ===== TIMELINE SCENE - WORK EXPERIENCE TIME TUNNEL =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, createHolographicMaterial, random } from '../utils/helpers';

export default class TimelineScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'TimelineScene';
    }

    init() {
        super.init();

        // Create time tunnel
        this.createTimeTunnel();

        // Create timeline path
        this.createTimelinePath();

        // Create experience nodes
        this.createExperienceNodes();

        // Create achievement cards
        this.createAchievementCards();

        // Create time particles
        this.createTimeParticles();

        // Create warp effect
        this.createWarpEffect();
    }

    createTimeTunnel() {
        // Outer tunnel rings
        const ringCount = 30;
        this.tunnelRings = [];

        for (let i = 0; i < ringCount; i++) {
            const geometry = new THREE.TorusGeometry(5, 0.1, 16, 32);
            const material = createNeonMaterial(
                i % 2 === 0 ? 0xFF00FF : 0x00FFFF,
                1.5
            );

            const ring = new THREE.Mesh(geometry, material);
            ring.position.z = -i * 3;
            ring.rotation.x = Math.PI / 2;

            this.add(ring);
            this.tunnelRings.push(ring);
        }

        // Animate tunnel
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.tunnelRings.forEach((ring, index) => {
                    // Move rings forward
                    ring.position.z += deltaTime * 2;

                    // Reset position when too close
                    if (ring.position.z > 5) {
                        ring.position.z = -90;
                    }

                    // Pulsing effect
                    const pulse = Math.sin(elapsedTime * 2 + index * 0.5) * 0.3 + 1;
                    ring.scale.set(pulse, pulse, pulse);
                });
            }
        });
    }

    createTimelinePath() {
        // Central timeline spine
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(2, 1, -10),
            new THREE.Vector3(-2, -1, -30),
            new THREE.Vector3(1, 2, -50),
            new THREE.Vector3(0, 0, -70)
        ]);

        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xFFFF00,
            linewidth: 3
        });

        const line = new THREE.Line(geometry, material);
        this.add(line);

        // Add glowing points along the path
        const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0xFFFF00,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const glowingPoints = new THREE.Points(pointsGeometry, pointsMaterial);
        this.add(glowingPoints);

        // Animate glow
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                pointsMaterial.opacity = 0.5 + Math.sin(elapsedTime * 3) * 0.3;
            }
        });
    }

    createExperienceNodes() {
        const experiences = [
            {
                company: 'Current Job',
                year: '2024',
                position: [-1, 1, -10],
                color: 0xFF00FF
            },
            {
                company: 'Previous Job',
                year: '2023',
                position: [2, -1, -30],
                color: 0x00FFFF
            },
            {
                company: 'Internship',
                year: '2022',
                position: [-2, 1.5, -50],
                color: 0x9D00FF
            },
            {
                company: 'First Job',
                year: '2021',
                position: [1, -0.5, -70],
                color: 0xFFFF00
            }
        ];

        this.experienceNodes = [];

        experiences.forEach((exp, index) => {
            const group = new THREE.Group();

            // Main node sphere
            const geometry = new THREE.SphereGeometry(0.8, 32, 32);
            const material = createNeonMaterial(exp.color, 2);
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // Orbiting ring
            const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 32);
            const ringMaterial = createHolographicMaterial(exp.color);
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);

            // Company name plate (holographic)
            const plateGeometry = new THREE.PlaneGeometry(2, 0.5);
            const plateMaterial = new THREE.MeshBasicMaterial({
                color: exp.color,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const plate = new THREE.Mesh(plateGeometry, plateMaterial);
            plate.position.y = 1.5;
            group.add(plate);

            // Year indicator
            const yearGeometry = new THREE.PlaneGeometry(1, 0.3);
            const yearMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const yearPlate = new THREE.Mesh(yearGeometry, yearMaterial);
            yearPlate.position.y = -1.5;
            group.add(yearPlate);

            // Position the group
            group.position.set(...exp.position);

            this.add(group);
            this.experienceNodes.push({ mesh: group, ring, sphere, exp });
        });

        // Animate nodes
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.experienceNodes.forEach((node, index) => {
                    const offset = index * Math.PI / 2;

                    // Rotate ring
                    node.ring.rotation.z = elapsedTime + offset;

                    // Pulse sphere
                    const pulse = Math.sin(elapsedTime * 2 + offset) * 0.1 + 1;
                    node.sphere.scale.set(pulse, pulse, pulse);

                    // Float up and down
                    node.mesh.position.y += Math.sin(elapsedTime + offset) * 0.001;
                });
            }
        });
    }

    createAchievementCards() {
        const achievements = [
            { text: 'Award 1', position: [3, 2, -20], color: 0xFF00FF },
            { text: 'Award 2', position: [-3, -2, -40], color: 0x00FFFF },
            { text: 'Award 3', position: [2.5, 1, -60], color: 0xFFFF00 }
        ];

        this.achievementCards = [];

        achievements.forEach((achievement) => {
            const cardGeometry = new THREE.PlaneGeometry(1.5, 1);
            const cardMaterial = new THREE.MeshPhysicalMaterial({
                color: achievement.color,
                transparent: true,
                opacity: 0.7,
                emissive: achievement.color,
                emissiveIntensity: 0.5,
                side: THREE.DoubleSide
            });

            const card = new THREE.Mesh(cardGeometry, cardMaterial);
            card.position.set(...achievement.position);

            this.add(card);
            this.achievementCards.push(card);
        });

        // Animate cards
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.achievementCards.forEach((card, index) => {
                    card.rotation.y = elapsedTime * 0.5 + index;
                    card.position.y += Math.sin(elapsedTime * 2 + index) * 0.002;
                });
            }
        });
    }

    createTimeParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        const colorOptions = [
            new THREE.Color(0xFF00FF),
            new THREE.Color(0x00FFFF),
            new THREE.Color(0xFFFF00)
        ];

        for (let i = 0; i < particleCount; i++) {
            // Position in a cylindrical volume
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 4;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = random(-5, 5);
            positions[i * 3 + 2] = random(-80, 10);

            // Random color
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            velocities[i] = random(5, 15);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.add(particles);

        // Animate particles flowing through time
        this.addAnimatable({
            update: (deltaTime) => {
                const positions = particles.geometry.attributes.position.array;

                for (let i = 0; i < particleCount; i++) {
                    // Move forward in time
                    positions[i * 3 + 2] += velocities[i] * deltaTime;

                    // Reset if too close
                    if (positions[i * 3 + 2] > 10) {
                        positions[i * 3 + 2] = -80;
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * 4;
                        positions[i * 3] = Math.cos(angle) * radius;
                        positions[i * 3 + 1] = random(-5, 5);
                    }
                }

                particles.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    createWarpEffect() {
        // Grid warp effect on the sides
        const gridGeometry = new THREE.PlaneGeometry(20, 100, 20, 100);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF00FF,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });

        const leftGrid = new THREE.Mesh(gridGeometry, gridMaterial);
        leftGrid.rotation.y = Math.PI / 2;
        leftGrid.position.x = -5;
        leftGrid.position.z = -35;
        this.add(leftGrid);

        const rightGrid = leftGrid.clone();
        rightGrid.position.x = 5;
        this.add(rightGrid);

        // Animate warp
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                // Warp grid vertices
                const positions = leftGrid.geometry.attributes.position.array;
                const originalPositions = gridGeometry.attributes.position.array;

                for (let i = 0; i < positions.length; i += 3) {
                    const y = originalPositions[i + 1];
                    const warp = Math.sin(y * 0.1 + elapsedTime * 2) * 0.5;
                    positions[i] = originalPositions[i] + warp;
                }

                leftGrid.geometry.attributes.position.needsUpdate = true;

                // Mirror for right grid
                const rightPositions = rightGrid.geometry.attributes.position.array;
                for (let i = 0; i < rightPositions.length; i += 3) {
                    rightPositions[i] = -positions[i];
                    rightPositions[i + 1] = positions[i + 1];
                    rightPositions[i + 2] = positions[i + 2];
                }
                rightGrid.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('⏱️ Entering the Timeline - Journey through my career!');
    }
}
