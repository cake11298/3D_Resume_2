// ===== NETWORK SCENE - CONTACT & SOCIAL MEDIA =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, random } from '../utils/helpers';

export default class NetworkScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'NetworkScene';
    }

    init() {
        super.init();

        // Create network grid background
        this.createNetworkGrid();

        // Create central hub
        this.createCentralHub();

        // Create social media nodes
        this.createSocialNodes();

        // Create connection lines
        this.createConnectionLines();

        // Create data packets
        this.createDataPackets();

        // Create email terminal
        this.createEmailTerminal();

        // Create floating contact cards
        this.createContactCards();
    }

    createNetworkGrid() {
        // Floor grid
        const gridSize = 50;
        const divisions = 50;

        const gridHelper = new THREE.GridHelper(gridSize, divisions, 0xFF00FF, 0x00FFFF);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.add(gridHelper);

        // Vertical grids on the sides
        const verticalGrid1 = new THREE.GridHelper(30, 30, 0xFF00FF, 0x00FFFF);
        verticalGrid1.rotation.z = Math.PI / 2;
        verticalGrid1.position.x = -15;
        verticalGrid1.position.y = 5;
        verticalGrid1.material.opacity = 0.2;
        verticalGrid1.material.transparent = true;
        this.add(verticalGrid1);

        const verticalGrid2 = verticalGrid1.clone();
        verticalGrid2.position.x = 15;
        this.add(verticalGrid2);
    }

    createCentralHub() {
        // Main central node representing "Me"
        const hubGroup = new THREE.Group();

        // Core sphere
        const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
        const coreMaterial = createNeonMaterial(0xFF00FF, 2);
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        hubGroup.add(core);

        // Outer wireframe
        const wireframeGeometry = new THREE.IcosahedronGeometry(2, 1);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        hubGroup.add(wireframe);

        // Energy rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(2 + i * 0.5, 0.05, 16, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0xFF00FF : 0x00FFFF,
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2 + (i * Math.PI / 6);
            ring.rotation.y = i * Math.PI / 3;
            hubGroup.add(ring);
        }

        hubGroup.position.y = 3;
        this.add(hubGroup);
        this.centralHub = hubGroup;

        // Animate hub
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                core.rotation.y += deltaTime * 0.5;
                core.rotation.x += deltaTime * 0.3;
                wireframe.rotation.y -= deltaTime * 0.3;
                wireframe.rotation.x -= deltaTime * 0.2;

                // Pulse effect
                const pulse = 1 + Math.sin(elapsedTime * 2) * 0.1;
                core.scale.set(pulse, pulse, pulse);
            }
        });
    }

    createSocialNodes() {
        const socials = [
            {
                name: 'GitHub',
                icon: '📂',
                color: 0xFF00FF,
                position: [-5, 3, 3],
                url: 'github.com'
            },
            {
                name: 'LinkedIn',
                icon: '💼',
                color: 0x0077B5,
                position: [5, 3, 3],
                url: 'linkedin.com'
            },
            {
                name: 'Email',
                icon: '📧',
                color: 0x00FFFF,
                position: [0, 3, -5],
                url: 'email@example.com'
            },
            {
                name: 'Twitter',
                icon: '🐦',
                color: 0x1DA1F2,
                position: [-5, 3, -3],
                url: 'twitter.com'
            },
            {
                name: 'Portfolio',
                icon: '🌐',
                color: 0xFFFF00,
                position: [5, 3, -3],
                url: 'portfolio.com'
            },
            {
                name: 'Discord',
                icon: '💬',
                color: 0x5865F2,
                position: [0, 6, 0],
                url: 'discord.gg'
            }
        ];

        this.socialNodes = [];

        socials.forEach((social, index) => {
            const nodeGroup = new THREE.Group();

            // Node sphere
            const nodeGeometry = new THREE.SphereGeometry(0.6, 16, 16);
            const nodeMaterial = createNeonMaterial(social.color, 1.5);
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeGroup.add(node);

            // Outer glow ring
            const glowGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: social.color,
                transparent: true,
                opacity: 0.6
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            nodeGroup.add(glow);

            // Label plate
            const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
            const labelMaterial = new THREE.MeshBasicMaterial({
                color: social.color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const label = new THREE.Mesh(labelGeometry, labelMaterial);
            label.position.y = 1.2;
            nodeGroup.add(label);

            nodeGroup.position.set(...social.position);
            this.add(nodeGroup);

            this.socialNodes.push({
                mesh: nodeGroup,
                node: node,
                glow: glow,
                label: label,
                social: social,
                offset: index
            });
        });

        // Animate nodes
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.socialNodes.forEach((item) => {
                    const offset = item.offset * Math.PI / 3;

                    // Rotate glow
                    item.glow.rotation.x = elapsedTime + offset;
                    item.glow.rotation.y = elapsedTime * 0.5 + offset;

                    // Pulse node
                    const pulse = 1 + Math.sin(elapsedTime * 2 + offset) * 0.1;
                    item.node.scale.set(pulse, pulse, pulse);

                    // Float
                    item.mesh.position.y += Math.sin(elapsedTime + offset) * 0.001;

                    // Billboard label to always face camera
                    if (this.app.camera) {
                        item.label.quaternion.copy(this.app.camera.quaternion);
                    }
                });
            }
        });
    }

    createConnectionLines() {
        this.connections = [];

        // Connect each social node to central hub
        this.socialNodes.forEach(item => {
            const points = [
                new THREE.Vector3(0, 3, 0), // Central hub position
                item.mesh.position.clone()
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: item.social.color,
                transparent: true,
                opacity: 0.5
            });

            const line = new THREE.Line(geometry, material);
            this.add(line);
            this.connections.push({ line, material, item });
        });

        // Animate connection lines
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.connections.forEach(conn => {
                    // Pulse opacity
                    conn.material.opacity = 0.3 + Math.sin(elapsedTime * 2) * 0.2;
                });
            }
        });
    }

    createDataPackets() {
        const packetCount = 20;
        this.dataPackets = [];

        for (let i = 0; i < packetCount; i++) {
            const geometry = new THREE.OctahedronGeometry(0.1);
            const material = createNeonMaterial(
                [0xFF00FF, 0x00FFFF, 0xFFFF00][Math.floor(random(0, 3))],
                2
            );

            const packet = new THREE.Mesh(geometry, material);

            // Random path along connection lines
            const targetNode = this.socialNodes[Math.floor(random(0, this.socialNodes.length))];
            packet.userData.start = new THREE.Vector3(0, 3, 0);
            packet.userData.end = targetNode.mesh.position.clone();
            packet.userData.progress = Math.random();
            packet.userData.speed = random(0.2, 0.5);

            this.add(packet);
            this.dataPackets.push(packet);
        }

        // Animate data packets
        this.addAnimatable({
            update: (deltaTime) => {
                this.dataPackets.forEach(packet => {
                    packet.userData.progress += deltaTime * packet.userData.speed;

                    if (packet.userData.progress >= 1) {
                        packet.userData.progress = 0;
                        // Switch direction
                        const temp = packet.userData.start.clone();
                        packet.userData.start = packet.userData.end.clone();
                        packet.userData.end = temp;
                    }

                    // Lerp position
                    packet.position.lerpVectors(
                        packet.userData.start,
                        packet.userData.end,
                        packet.userData.progress
                    );

                    // Rotate
                    packet.rotation.x += deltaTime * 3;
                    packet.rotation.y += deltaTime * 2;
                });
            }
        });
    }

    createEmailTerminal() {
        const terminalGroup = new THREE.Group();

        // Terminal screen
        const screenGeometry = new THREE.BoxGeometry(4, 3, 0.2);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            emissive: 0x00FF00,
            emissiveIntensity: 0.2
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.y = 2;
        terminalGroup.add(screen);

        // Screen content (green text effect)
        const textGeometry = new THREE.PlaneGeometry(3.5, 2.5);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FF00,
            transparent: true,
            opacity: 0.8
        });
        const textPlane = new THREE.Mesh(textGeometry, textMaterial);
        textPlane.position.z = 0.11;
        textPlane.position.y = 2;
        terminalGroup.add(textPlane);

        // Keyboard
        const keyboardGeometry = new THREE.BoxGeometry(4, 0.2, 1.5);
        const keyboardMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.y = 0.5;
        keyboard.position.z = 1;
        terminalGroup.add(keyboard);

        // Keys
        for (let i = 0; i < 20; i++) {
            const keyGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.15);
            const keyMaterial = new THREE.MeshStandardMaterial({
                color: 0x555555
            });
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.x = -1.5 + (i % 10) * 0.35;
            key.position.z = 0.5 + Math.floor(i / 10) * 0.35;
            key.position.y = 0.55;
            keyboard.add(key);
        }

        terminalGroup.position.set(0, 0, 8);
        this.add(terminalGroup);

        // Animate terminal
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                // Flickering cursor effect
                textMaterial.opacity = 0.6 + Math.sin(elapsedTime * 5) * 0.2;
            }
        });
    }

    createContactCards() {
        const contacts = [
            { type: 'Phone', info: '+123 456 7890', color: 0xFF00FF, position: [-6, 5, 0] },
            { type: 'Email', info: 'contact@example.com', color: 0x00FFFF, position: [6, 5, 0] },
            { type: 'Location', info: 'Taiwan', color: 0xFFFF00, position: [0, 7, -3] }
        ];

        this.contactCards = [];

        contacts.forEach(contact => {
            const cardGeometry = new THREE.PlaneGeometry(3, 1.5);
            const cardMaterial = new THREE.MeshPhysicalMaterial({
                color: contact.color,
                transparent: true,
                opacity: 0.7,
                emissive: contact.color,
                emissiveIntensity: 0.3,
                side: THREE.DoubleSide
            });

            const card = new THREE.Mesh(cardGeometry, cardMaterial);
            card.position.set(...contact.position);

            this.add(card);
            this.contactCards.push({ mesh: card, contact });
        });

        // Animate cards
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.contactCards.forEach((item, index) => {
                    item.mesh.rotation.y = Math.sin(elapsedTime + index) * 0.3;
                    item.mesh.position.y += Math.sin(elapsedTime * 2 + index) * 0.002;

                    // Billboard to camera
                    if (this.app.camera) {
                        const cameraRotation = new THREE.Euler().setFromQuaternion(this.app.camera.quaternion);
                        item.mesh.rotation.y = cameraRotation.y;
                    }
                });
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('📡 Connected to the Network - Reach out anytime!');
    }
}
