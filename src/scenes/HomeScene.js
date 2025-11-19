// ===== HOME SCENE - WELCOME SCENE (ENHANCED) =====

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

        // Create central floating geometry cluster
        this.createCentralCluster();

        // Create orbital spheres
        this.createOrbitalSpheres();

        // Create geometric installations
        this.createGeometricInstallations();

        // Create particle background
        this.createEnhancedParticles();

        // Create floating crystals
        this.createFloatingCrystals();
    }

    createFloor() {
        const grid = createNeonGrid(100, 100, 0xFF00FF, 0x00FFFF);
        grid.position.y = -2;
        this.add(grid);
    }

    /**
     * Central floating geometry cluster (replacing the box)
     */
    createCentralCluster() {
        const group = new THREE.Group();

        // Core: Rotating icosahedron (20面體)
        const coreGeo = new THREE.IcosahedronGeometry(1, 0);
        const coreMat = createNeonMaterial(0xFF00FF, 3);
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // Outer wireframe dodecahedron (12面體)
        const outerGeo = new THREE.DodecahedronGeometry(1.5, 0);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const outer = new THREE.Mesh(outerGeo, outerMat);
        group.add(outer);

        // Ring torus
        const ringGeo = new THREE.TorusGeometry(2, 0.1, 16, 100);
        const ringMat = createNeonMaterial(0xFFFF00, 2);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 4;
        group.add(ring);

        group.position.set(0, 2, 0);
        this.add(group);

        // Animation
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                // Core rotation
                core.rotation.x = elapsedTime * 0.5;
                core.rotation.y = elapsedTime * 0.7;

                // Outer counter-rotation
                outer.rotation.x = -elapsedTime * 0.3;
                outer.rotation.y = -elapsedTime * 0.5;

                // Ring rotation
                ring.rotation.z = elapsedTime * 0.8;

                // Floating effect
                group.position.y = 2 + Math.sin(elapsedTime) * 0.3;
            }
        });

        this.centralCluster = group;
    }

    /**
     * Orbital spheres with trails
     */
    createOrbitalSpheres() {
        const sphereCount = 8;
        const spheres = [];

        for (let i = 0; i < sphereCount; i++) {
            // Main sphere
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const color = i % 3 === 0 ? 0xFF00FF : i % 3 === 1 ? 0x00FFFF : 0xFFFF00;
            const material = createNeonMaterial(color, 2);
            const sphere = new THREE.Mesh(geometry, material);

            // Orbital ring indicator
            const ringGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.3
            });
            const ringIndicator = new THREE.Mesh(ringGeo, ringMat);
            ringIndicator.rotation.x = Math.PI / 2;
            sphere.add(ringIndicator);

            // Position in orbit
            const angle = (i / sphereCount) * Math.PI * 2;
            const radius = 4 + (i % 2) * 1;
            const height = Math.sin(angle * 2) * 2;

            this.add(sphere);
            spheres.push({
                mesh: sphere,
                angle,
                radius,
                height,
                speed: 0.3 + Math.random() * 0.4,
                ringIndicator
            });
        }

        // Animate orbital motion
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                spheres.forEach((sphere, index) => {
                    const newAngle = sphere.angle + elapsedTime * sphere.speed;
                    sphere.mesh.position.x = Math.cos(newAngle) * sphere.radius;
                    sphere.mesh.position.z = Math.sin(newAngle) * sphere.radius;
                    sphere.mesh.position.y = 1 + Math.sin(elapsedTime * 2 + index) * 0.8 + sphere.height * 0.3;

                    // Spin
                    sphere.mesh.rotation.y += deltaTime * 3;
                    sphere.ringIndicator.rotation.z += deltaTime * 2;
                });
            }
        });
    }

    /**
     * Geometric art installations around the scene
     */
    createGeometricInstallations() {
        const installations = [];

        // Pyramid installation
        const pyramid = this.createPyramid(-5, 0, -3);
        installations.push({ mesh: pyramid, rotSpeed: 0.5 });

        // Octahedron installation (8面體)
        const octaGeo = new THREE.OctahedronGeometry(0.8, 0);
        const octaMat = createNeonMaterial(0x00FFFF, 2);
        const octa = new THREE.Mesh(octaGeo, octaMat);
        octa.position.set(5, 1, -3);
        this.add(octa);
        installations.push({ mesh: octa, rotSpeed: 0.7 });

        // Tetrahedron (4面體)
        const tetraGeo = new THREE.TetrahedronGeometry(0.7, 0);
        const tetraMat = createNeonMaterial(0xFFFF00, 2);
        const tetra = new THREE.Mesh(tetraGeo, tetraMat);
        tetra.position.set(-5, 1.5, 2);
        this.add(tetra);
        installations.push({ mesh: tetra, rotSpeed: 1.0 });

        // Torus knot (環結)
        const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
        const knotMat = createNeonMaterial(0xFF00FF, 2);
        const knot = new THREE.Mesh(knotGeo, knotMat);
        knot.position.set(5, 1.2, 2);
        this.add(knot);
        installations.push({ mesh: knot, rotSpeed: 0.4 });

        // Cone spiral
        for (let i = 0; i < 5; i++) {
            const coneGeo = new THREE.ConeGeometry(0.3 - i * 0.05, 0.6, 8);
            const coneMat = createNeonMaterial(
                i % 2 === 0 ? 0xFF00FF : 0x00FFFF,
                1.5
            );
            const cone = new THREE.Mesh(coneGeo, coneMat);
            cone.position.set(
                -3 + i * 0.2,
                0.5 + i * 0.3,
                -5
            );
            cone.rotation.z = i * 0.3;
            this.add(cone);
            installations.push({ mesh: cone, rotSpeed: 0.5 + i * 0.1 });
        }

        // Animate installations
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                installations.forEach((installation, index) => {
                    installation.mesh.rotation.y += deltaTime * installation.rotSpeed;
                    installation.mesh.rotation.x += deltaTime * installation.rotSpeed * 0.5;

                    // Floating effect
                    const originalY = installation.mesh.position.y;
                    installation.mesh.position.y += Math.sin(elapsedTime * 2 + index) * 0.005;
                });
            }
        });
    }

    /**
     * Helper: Create pyramid
     */
    createPyramid(x, y, z) {
        const geometry = new THREE.ConeGeometry(1, 1.5, 4);
        const material = createNeonMaterial(0xFFFF00, 2);
        const pyramid = new THREE.Mesh(geometry, material);
        pyramid.position.set(x, y + 0.75, z);
        this.add(pyramid);
        return pyramid;
    }

    /**
     * Enhanced particle system with multiple layers
     */
    createEnhancedParticles() {
        // Background particles
        const bgParticles = createParticles(3000, 0xFF00FF, 0.03);
        bgParticles.position.z = -15;
        this.add(bgParticles);

        // Mid-ground particles
        const mgParticles = createParticles(1500, 0x00FFFF, 0.05);
        mgParticles.position.z = -8;
        this.add(mgParticles);

        // Foreground particles
        const fgParticles = createParticles(800, 0xFFFF00, 0.08);
        fgParticles.position.z = -3;
        this.add(fgParticles);

        // Animate all particle layers
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                // Background rotation
                bgParticles.rotation.y = elapsedTime * 0.03;

                // Mid-ground wave
                const mgPositions = mgParticles.geometry.attributes.position.array;
                for (let i = 1; i < mgPositions.length; i += 3) {
                    mgPositions[i] = Math.sin(elapsedTime + i * 0.1) * 15;
                }
                mgParticles.geometry.attributes.position.needsUpdate = true;

                // Foreground spiral
                fgParticles.rotation.y = -elapsedTime * 0.05;
                fgParticles.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;
            }
        });
    }

    /**
     * Floating crystal structures
     */
    createFloatingCrystals() {
        const crystals = [];
        const crystalCount = 12;

        for (let i = 0; i < crystalCount; i++) {
            // Create elongated octahedron (crystal shape)
            const geo = new THREE.OctahedronGeometry(0.3, 0);
            geo.scale(1, 2, 1); // Elongate

            const color = i % 3 === 0 ? 0xFF00FF : i % 3 === 1 ? 0x00FFFF : 0xFFFF00;
            const mat = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });

            const crystal = new THREE.Mesh(geo, mat);

            // Random position in a sphere
            const radius = 6 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            crystal.position.x = radius * Math.sin(phi) * Math.cos(theta);
            crystal.position.y = radius * Math.cos(phi);
            crystal.position.z = radius * Math.sin(phi) * Math.sin(theta);

            // Random rotation
            crystal.rotation.x = Math.random() * Math.PI;
            crystal.rotation.y = Math.random() * Math.PI;
            crystal.rotation.z = Math.random() * Math.PI;

            this.add(crystal);
            crystals.push({
                mesh: crystal,
                rotSpeed: 0.5 + Math.random() * 1.0,
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatOffset: Math.random() * Math.PI * 2
            });
        }

        // Animate crystals
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                crystals.forEach((crystal, index) => {
                    // Rotation
                    crystal.mesh.rotation.y += deltaTime * crystal.rotSpeed;
                    crystal.mesh.rotation.x += deltaTime * crystal.rotSpeed * 0.3;

                    // Floating effect
                    const originalY = crystal.mesh.position.y;
                    const floatAmount = Math.sin(elapsedTime * crystal.floatSpeed + crystal.floatOffset);
                    crystal.mesh.position.y = originalY + floatAmount * 0.1;

                    // Pulsing opacity
                    crystal.mesh.material.opacity = 0.6 + Math.sin(elapsedTime * 2 + index) * 0.2;
                });
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🏠 Welcome to Enhanced Home Scene!');
    }

    onExit() {
        super.onExit();
        console.log('👋 Leaving Home Scene');
    }
}
