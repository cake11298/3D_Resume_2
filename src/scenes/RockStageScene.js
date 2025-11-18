// ===== ROCK STAGE SCENE - SKILLS DISPLAY =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { createNeonMaterial, createMetallicMaterial, random } from '../utils/helpers';

export default class RockStageScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'RockStageScene';
    }

    init() {
        super.init();

        // Create stage platform
        this.createStagePlatform();

        // Create skill instruments
        this.createSkillInstruments();

        // Create stage lights
        this.createStageLights();

        // Create speakers/amplifiers
        this.createSpeakers();

        // Create particle effects (stage smoke)
        this.createStageSmoke();
    }

    createStagePlatform() {
        // Main stage
        const stageGeometry = new THREE.BoxGeometry(20, 0.5, 10);
        const stageMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.3
        });

        const stage = new THREE.Mesh(stageGeometry, stageMaterial);
        stage.position.y = 0;
        stage.receiveShadow = true;

        this.add(stage);

        // Stage edge lights
        const edgeGeometry = new THREE.BoxGeometry(20.2, 0.1, 0.1);
        const edgeMaterial = createNeonMaterial(0xFF00FF, 2);

        const frontEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        frontEdge.position.set(0, 0.3, 5);

        this.add(frontEdge);
    }

    createSkillInstruments() {
        const skills = [
            { name: 'Python', type: 'guitar', color: 0xFF00FF, position: [-6, 1.5, 0] },
            { name: 'React', type: 'drums', color: 0x00FFFF, position: [0, 1.5, -2] },
            { name: 'Unity', type: 'synth', color: 0x9D00FF, position: [6, 1.5, 0] },
            { name: 'Network', type: 'mixer', color: 0xFFFF00, position: [0, 1.5, 3] }
        ];

        this.instruments = [];

        skills.forEach(skill => {
            const instrument = this.createInstrument(skill);
            instrument.position.set(...skill.position);
            this.add(instrument);
            this.instruments.push({ mesh: instrument, skill });
        });

        // Animate instruments
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.instruments.forEach((item, index) => {
                    const instrument = item.mesh;
                    const offset = index * Math.PI / 2;

                    // Gentle floating animation
                    instrument.position.y = item.skill.position[1] + Math.sin(elapsedTime + offset) * 0.1;
                    instrument.rotation.y = Math.sin(elapsedTime * 0.5 + offset) * 0.2;
                });
            }
        });
    }

    createInstrument(skill) {
        const group = new THREE.Group();

        // Main body - simple geometric representation
        let geometry;
        switch (skill.type) {
            case 'guitar':
                geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
                break;
            case 'drums':
                geometry = new THREE.CylinderGeometry(0.8, 1, 0.5, 32);
                break;
            case 'synth':
                geometry = new THREE.BoxGeometry(2, 0.8, 1);
                break;
            case 'mixer':
                geometry = new THREE.BoxGeometry(1.5, 1.2, 0.8);
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }

        const material = createNeonMaterial(skill.color, 1.5);
        const mesh = new THREE.Mesh(geometry, material);

        // Rotate guitar
        if (skill.type === 'guitar') {
            mesh.rotation.z = Math.PI / 6;
        }

        group.add(mesh);

        // Add glow effect
        const glowGeometry = geometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: skill.color,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.scale.multiplyScalar(1.1);
        group.add(glow);

        return group;
    }

    createStageLights() {
        const lights = [];

        // Create spotlight array
        for (let i = 0; i < 5; i++) {
            const light = new THREE.SpotLight(
                i % 2 === 0 ? 0xFF00FF : 0x00FFFF,
                2,
                20,
                Math.PI / 6,
                0.5,
                1
            );

            light.position.set(-8 + i * 4, 8, 5);
            light.target.position.set(-8 + i * 4, 0, 0);

            this.add(light);
            this.add(light.target);
            lights.push(light);
        }

        // Animate spotlights
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                lights.forEach((light, index) => {
                    const offset = index * Math.PI / 2.5;
                    light.intensity = 1 + Math.sin(elapsedTime * 3 + offset) * 0.5;

                    // Move light target
                    light.target.position.x = -8 + index * 4 + Math.sin(elapsedTime + offset) * 2;
                });
            }
        });
    }

    createSpeakers() {
        const speakerGeometry = new THREE.BoxGeometry(1.5, 3, 1);
        const speakerMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.1
        });

        // Left speaker
        const leftSpeaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
        leftSpeaker.position.set(-10, 1.5, 4);
        this.add(leftSpeaker);

        // Right speaker
        const rightSpeaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
        rightSpeaker.position.set(10, 1.5, 4);
        this.add(rightSpeaker);

        // Add speaker cones
        const coneGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
        const coneMaterial = createNeonMaterial(0x00FFFF, 1);

        for (let speaker of [leftSpeaker, rightSpeaker]) {
            for (let i = 0; i < 3; i++) {
                const cone = new THREE.Mesh(coneGeometry, coneMaterial);
                cone.position.y = -1 + i;
                cone.position.z = 0.5;
                cone.rotation.x = Math.PI / 2;
                speaker.add(cone);
            }
        }
    }

    createStageSmoke() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = random(-10, 10);
            positions[i * 3 + 1] = random(0, 2);
            positions[i * 3 + 2] = random(-5, 5);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xFF00FF,
            size: 0.3,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const smoke = new THREE.Points(geometry, material);
        this.add(smoke);

        // Animate smoke
        this.addAnimatable({
            update: (deltaTime) => {
                const positions = smoke.geometry.attributes.position.array;

                for (let i = 0; i < particleCount; i++) {
                    // Rise up
                    positions[i * 3 + 1] += deltaTime * 0.5;

                    // Drift sideways
                    positions[i * 3] += Math.sin(positions[i * 3 + 1]) * deltaTime;

                    // Reset if too high
                    if (positions[i * 3 + 1] > 5) {
                        positions[i * 3 + 1] = 0;
                        positions[i * 3] = random(-10, 10);
                        positions[i * 3 + 2] = random(-5, 5);
                    }
                }

                smoke.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🎸 Rock on! Welcome to the Skills Stage!');
    }
}
