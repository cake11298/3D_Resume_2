// ===== GALAXY SCENE - EDUCATION BACKGROUND =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, random } from '../utils/helpers';

export default class GalaxyScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'GalaxyScene';
    }

    init() {
        super.init();

        // Create starfield background
        this.createStarfield();

        // Create education planets
        this.createEducationPlanets();

        // Create orbital paths
        this.createOrbitalPaths();

        // Create course satellites
        this.createCourseSatellites();

        // Create nebula effect
        this.createNebula();

        // Create shooting stars
        this.createShootingStars();
    }

    createStarfield() {
        const starCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            // Random positions in a sphere
            const radius = random(50, 200);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Star colors (white to blue)
            const brightness = Math.random();
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = 1;

            sizes[i] = random(0.1, 0.3);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        this.add(stars);

        // Slowly rotate starfield
        this.addAnimatable({
            update: (deltaTime) => {
                stars.rotation.y += deltaTime * 0.01;
                stars.rotation.x += deltaTime * 0.005;
            }
        });
    }

    createEducationPlanets() {
        const educations = [
            {
                name: 'NTUST',
                type: 'University',
                year: '2018-2022',
                size: 2,
                color: 0xFF00FF,
                position: [0, 0, 0],
                hasRing: true
            },
            {
                name: 'Belgium Exchange',
                type: 'Exchange Program',
                year: '2021',
                size: 1.5,
                color: 0x00FFFF,
                position: [8, 2, -3],
                hasAurora: true
            },
            {
                name: 'High School',
                type: 'Secondary Education',
                year: '2015-2018',
                size: 1.2,
                color: 0xFFFF00,
                position: [-7, -2, 2],
                hasRing: false
            }
        ];

        this.planets = [];

        educations.forEach((edu, index) => {
            const group = new THREE.Group();

            // Planet sphere
            const geometry = new THREE.SphereGeometry(edu.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: edu.color,
                emissive: edu.color,
                emissiveIntensity: 0.3,
                metalness: 0.6,
                roughness: 0.4
            });

            const planet = new THREE.Mesh(geometry, material);
            group.add(planet);

            // Atmosphere glow
            const glowGeometry = new THREE.SphereGeometry(edu.size * 1.15, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: edu.color,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            group.add(glow);

            // Ring system for main planet
            if (edu.hasRing) {
                const ringGeometry = new THREE.RingGeometry(edu.size * 1.5, edu.size * 2, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: edu.color,
                    transparent: true,
                    opacity: 0.5,
                    side: THREE.DoubleSide
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2 + 0.3;
                group.add(ring);
            }

            // Aurora effect for exchange planet
            if (edu.hasAurora) {
                const auroraGeometry = new THREE.TorusGeometry(edu.size * 1.3, 0.1, 16, 32);
                const auroraMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00FF88,
                    transparent: true,
                    opacity: 0.6,
                    blending: THREE.AdditiveBlending
                });
                const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
                aurora.rotation.x = Math.PI / 2;
                group.add(aurora);

                // Animate aurora
                this.addAnimatable({
                    update: (deltaTime, elapsedTime) => {
                        aurora.rotation.z = elapsedTime * 0.5;
                        auroraMaterial.opacity = 0.4 + Math.sin(elapsedTime * 2) * 0.2;
                    }
                });
            }

            // Information label
            const labelGeometry = new THREE.PlaneGeometry(3, 0.8);
            const labelMaterial = new THREE.MeshBasicMaterial({
                color: edu.color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const label = new THREE.Mesh(labelGeometry, labelMaterial);
            label.position.y = edu.size + 1.5;
            group.add(label);

            group.position.set(...edu.position);
            this.add(group);

            this.planets.push({
                mesh: group,
                planet: planet,
                glow: glow,
                edu: edu
            });
        });

        // Animate planets
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.planets.forEach((item, index) => {
                    // Rotate planet
                    item.planet.rotation.y += deltaTime * (0.5 + index * 0.1);

                    // Pulse glow
                    const pulse = Math.sin(elapsedTime * 2 + index) * 0.1 + 0.2;
                    item.glow.material.opacity = pulse;

                    // Gentle floating
                    item.mesh.position.y += Math.sin(elapsedTime + index) * 0.002;
                });
            }
        });
    }

    createOrbitalPaths() {
        // Create orbital rings connecting planets
        const orbits = [
            { radius: 8, color: 0xFF00FF },
            { radius: 10, color: 0x00FFFF }
        ];

        orbits.forEach(orbit => {
            const geometry = new THREE.TorusGeometry(orbit.radius, 0.02, 16, 100);
            const material = new THREE.MeshBasicMaterial({
                color: orbit.color,
                transparent: true,
                opacity: 0.3
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2;
            this.add(ring);
        });
    }

    createCourseSatellites() {
        const courses = [
            { name: 'Computer Science', orbitRadius: 4, speed: 1, color: 0xFF00FF },
            { name: 'Mathematics', orbitRadius: 5, speed: 0.8, color: 0x00FFFF },
            { name: 'Physics', orbitRadius: 6, speed: 0.6, color: 0xFFFF00 }
        ];

        this.satellites = [];

        courses.forEach((course, index) => {
            const geometry = new THREE.TetrahedronGeometry(0.3);
            const material = createNeonMaterial(course.color, 2);
            const satellite = new THREE.Mesh(geometry, material);

            // Initial position on orbit
            const angle = (index / courses.length) * Math.PI * 2;
            satellite.userData.angle = angle;
            satellite.userData.orbitRadius = course.orbitRadius;
            satellite.userData.speed = course.speed;

            this.add(satellite);
            this.satellites.push(satellite);
        });

        // Animate satellites orbiting around main planet
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.satellites.forEach(satellite => {
                    satellite.userData.angle += deltaTime * satellite.userData.speed;
                    const angle = satellite.userData.angle;
                    const radius = satellite.userData.orbitRadius;

                    satellite.position.x = Math.cos(angle) * radius;
                    satellite.position.z = Math.sin(angle) * radius;
                    satellite.position.y = Math.sin(elapsedTime + angle) * 0.5;

                    satellite.rotation.y += deltaTime * 2;
                    satellite.rotation.x += deltaTime;
                });
            }
        });
    }

    createNebula() {
        // Colorful nebula clouds in the background
        const nebulaCount = 3;

        for (let i = 0; i < nebulaCount; i++) {
            const geometry = new THREE.SphereGeometry(random(10, 20), 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: [0xFF00FF, 0x00FFFF, 0x9D00FF][i],
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
            });

            const nebula = new THREE.Mesh(geometry, material);
            nebula.position.set(
                random(-30, 30),
                random(-20, 20),
                random(-40, -20)
            );

            this.add(nebula);

            // Slowly rotate nebula
            this.addAnimatable({
                update: (deltaTime) => {
                    nebula.rotation.y += deltaTime * 0.05;
                    nebula.rotation.x += deltaTime * 0.03;
                }
            });
        }
    }

    createShootingStars() {
        const shootingStarCount = 10;
        this.shootingStars = [];

        for (let i = 0; i < shootingStarCount; i++) {
            const geometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8
            });

            const star = new THREE.Mesh(geometry, material);
            star.visible = false;

            // Trail effect
            const trailGeometry = new THREE.CylinderGeometry(0.01, 0.01, 5, 8);
            const trailMaterial = new THREE.MeshBasicMaterial({
                color: 0x00FFFF,
                transparent: true,
                opacity: 0.4
            });
            const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            trail.position.y = -4;
            star.add(trail);

            this.add(star);
            this.shootingStars.push({
                mesh: star,
                velocity: new THREE.Vector3(
                    random(-5, 5),
                    random(-5, 5),
                    random(-5, 5)
                ),
                active: false,
                timer: random(0, 5)
            });
        }

        // Animate shooting stars
        this.addAnimatable({
            update: (deltaTime) => {
                this.shootingStars.forEach(star => {
                    if (star.active) {
                        star.mesh.position.add(
                            star.velocity.clone().multiplyScalar(deltaTime)
                        );

                        // Deactivate if too far
                        if (star.mesh.position.length() > 50) {
                            star.active = false;
                            star.mesh.visible = false;
                        }
                    } else {
                        star.timer -= deltaTime;
                        if (star.timer <= 0) {
                            // Launch new shooting star
                            star.active = true;
                            star.mesh.visible = true;
                            star.timer = random(3, 8);

                            // Random start position
                            star.mesh.position.set(
                                random(-30, 30),
                                random(-20, 20),
                                random(-30, -20)
                            );

                            // Point in direction of travel
                            const direction = star.velocity.clone().normalize();
                            star.mesh.quaternion.setFromUnitVectors(
                                new THREE.Vector3(0, 1, 0),
                                direction
                            );
                        }
                    }
                });
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🌌 Welcome to the Knowledge Galaxy!');
    }
}
