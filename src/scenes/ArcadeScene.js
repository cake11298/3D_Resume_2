// ===== ARCADE SCENE - PROJECTS SHOWCASE =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, random } from '../utils/helpers';

export default class ArcadeScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'ArcadeScene';
    }

    init() {
        super.init();

        // Create arcade floor
        this.createFloor();

        // Create arcade machines
        this.createArcadeMachines();

        // Create neon signs
        this.createNeonSigns();

        // Create pixel particles
        this.createPixelParticles();
    }

    createFloor() {
        // Checkered floor pattern
        const floorGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.5,
            roughness: 0.7
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;

        this.add(floor);

        // Add neon grid overlay
        const gridGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF00FF,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });

        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = 0.01;

        this.add(grid);
    }

    createArcadeMachines() {
        const projects = [
            { name: 'Cocktail Game', color: 0xFF00FF, position: [-6, 0, 0] },
            { name: 'Log Parser', color: 0x00FFFF, position: [0, 0, 0] },
            { name: 'Web Project', color: 0xFFFF00, position: [6, 0, 0] }
        ];

        this.machines = [];

        projects.forEach(project => {
            const machine = this.createArcadeMachine(project);
            machine.position.set(...project.position);
            this.add(machine);
            this.machines.push({ mesh: machine, project });
        });

        // Animate machines
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.machines.forEach((item, index) => {
                    const screen = item.mesh.getObjectByName('screen');
                    if (screen) {
                        // Flickering screen effect
                        const flicker = Math.sin(elapsedTime * 10 + index) * 0.1 + 0.9;
                        screen.material.emissiveIntensity = flicker;
                    }
                });
            }
        });
    }

    createArcadeMachine(project) {
        const group = new THREE.Group();

        // Cabinet body
        const cabinetGeometry = new THREE.BoxGeometry(2, 3, 1);
        const cabinetMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.7,
            roughness: 0.3
        });

        const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
        cabinet.position.y = 1.5;
        cabinet.castShadow = true;
        group.add(cabinet);

        // Screen
        const screenGeometry = new THREE.BoxGeometry(1.6, 1.2, 0.1);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: project.color,
            emissive: project.color,
            emissiveIntensity: 1,
            metalness: 0.9,
            roughness: 0.1
        });

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.5, 0.51);
        screen.name = 'screen';
        cabinet.add(screen);

        // Screen glow
        const glowGeometry = new THREE.BoxGeometry(1.7, 1.3, 0.05);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: project.color,
            transparent: true,
            opacity: 0.3
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, 0.5, 0.52);
        cabinet.add(glow);

        // Control panel
        const panelGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.5);
        const panelMaterial = createNeonMaterial(0xFF00FF, 0.5);

        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(0, -0.5, 0.6);
        panel.rotation.x = -Math.PI / 6;
        cabinet.add(panel);

        // Buttons
        const buttonGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
        const buttonColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00];

        for (let i = 0; i < 4; i++) {
            const buttonMaterial = createNeonMaterial(buttonColors[i], 2);
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(-0.5 + i * 0.3, -0.48, 0.65);
            button.rotation.x = Math.PI / 2;
            cabinet.add(button);
        }

        // Joystick
        const stickGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
        const stickMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.9,
            roughness: 0.1
        });

        const stick = new THREE.Mesh(stickGeometry, stickMaterial);
        stick.position.set(-0.5, -0.35, 0.7);
        cabinet.add(stick);

        const ballGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const ball = new THREE.Mesh(ballGeometry, stickMaterial);
        ball.position.set(-0.5, -0.2, 0.7);
        cabinet.add(ball);

        return group;
    }

    createNeonSigns() {
        const signs = [
            { text: 'PROJECTS', color: 0xFF00FF, position: [0, 5, -5] },
            { text: 'INSERT COIN', color: 0x00FFFF, position: [-8, 4, 0] },
            { text: 'GAME OVER', color: 0xFFFF00, position: [8, 4, 0] }
        ];

        signs.forEach(sign => {
            const signGroup = new THREE.Group();

            // Sign board
            const boardGeometry = new THREE.BoxGeometry(4, 1, 0.2);
            const boardMaterial = createNeonMaterial(sign.color, 2);

            const board = new THREE.Mesh(boardGeometry, boardMaterial);
            signGroup.add(board);

            signGroup.position.set(...sign.position);
            this.add(signGroup);
        });

        // Animate signs
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.sceneObjects.children.forEach(obj => {
                    if (obj instanceof THREE.Group && obj.children[0]?.material?.emissiveIntensity) {
                        const pulse = Math.sin(elapsedTime * 2) * 0.5 + 1.5;
                        obj.children[0].material.emissiveIntensity = pulse;
                    }
                });
            }
        });
    }

    createPixelParticles() {
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const pixelColors = [
            new THREE.Color(0xFF00FF),
            new THREE.Color(0x00FFFF),
            new THREE.Color(0xFFFF00),
            new THREE.Color(0xFF0000)
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = random(-25, 25);
            positions[i * 3 + 1] = random(0, 10);
            positions[i * 3 + 2] = random(-25, 25);

            const color = pixelColors[Math.floor(Math.random() * pixelColors.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.add(particles);

        // Animate particles
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                particles.rotation.y = elapsedTime * 0.1;
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🎮 Welcome to the Arcade! Insert Coin to Continue...');
    }
}
