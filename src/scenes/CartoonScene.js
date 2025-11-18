// ===== CARTOON SCENE - HOBBIES & INTERESTS =====

import * as THREE from 'three';
import BaseScene from './BaseScene';
import { random } from '../utils/helpers';

export default class CartoonScene extends BaseScene {
    constructor(app) {
        super(app);
        this.name = 'CartoonScene';
    }

    init() {
        super.init();

        // FIX: Add proper lighting for cartoon scene
        this.setupCartoonLighting();

        // Change scene background to bright color
        this.createColorfulBackground();

        // Create cartoon floor
        this.createCartoonFloor();

        // Create cocktail bar
        this.createCocktailBar();

        // Create gaming zone
        this.createGamingZone();

        // Create coding waterfall
        this.createCodingWaterfall();

        // Create character avatar
        this.createCharacterAvatar();

        // Create floating bubbles
        this.createBubbles();

        // Create rainbow
        this.createRainbow();
    }

    setupCartoonLighting() {
        // Strong ambient light for bright cartoon look
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
        this.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xFFFFEE, 1.5);
        sunLight.position.set(10, 20, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -30;
        sunLight.shadow.camera.right = 30;
        sunLight.shadow.camera.top = 30;
        sunLight.shadow.camera.bottom = -30;
        this.add(sunLight);

        // Fill light (opposite side, softer)
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.6);
        fillLight.position.set(-10, 10, -10);
        this.add(fillLight);

        // Colorful accent lights
        const accentColors = [
            { color: 0xFF69B4, pos: [-10, 5, 5] },   // Pink
            { color: 0x90EE90, pos: [10, 5, 5] },    // Green
            { color: 0xFFFF00, pos: [0, 5, -10] }    // Yellow
        ];

        accentColors.forEach(light => {
            const pointLight = new THREE.PointLight(light.color, 0.5, 20);
            pointLight.position.set(...light.pos);
            this.add(pointLight);
        });

        // Hemisphere light for natural sky-ground gradient
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x90EE90, 0.6);
        this.add(hemiLight);
    }

    createColorfulBackground() {
        // Gradient sky background
        const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x87CEEB) }, // Sky blue
                bottomColor: { value: new THREE.Color(0xFFFFFF) } // White
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.add(sky);
    }

    createCartoonFloor() {
        // Colorful checkered floor
        const floorSize = 40;
        const tileSize = 2;
        const tiles = floorSize / tileSize;

        const colors = [0xFF69B4, 0x87CEEB, 0x90EE90, 0xFFFF00, 0xFF6347];

        for (let x = 0; x < tiles; x++) {
            for (let z = 0; z < tiles; z++) {
                const geometry = new THREE.BoxGeometry(tileSize - 0.1, 0.2, tileSize - 0.1);
                const color = colors[Math.floor(random(0, colors.length))];
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.7,
                    metalness: 0.1
                });

                const tile = new THREE.Mesh(geometry, material);
                tile.position.x = (x - tiles / 2) * tileSize;
                tile.position.z = (z - tiles / 2) * tileSize;
                tile.position.y = 0;
                tile.castShadow = true;
                tile.receiveShadow = true;

                this.add(tile);
            }
        }
    }

    createCocktailBar() {
        const barGroup = new THREE.Group();

        // Bar counter
        const counterGeometry = new THREE.BoxGeometry(6, 1.5, 2);
        const counterMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Brown
            roughness: 0.6
        });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.y = 0.75;
        barGroup.add(counter);

        // Shaker
        const shakerBodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1, 16);
        const shakerMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.1
        });
        const shaker = new THREE.Mesh(shakerBodyGeometry, shakerMaterial);
        shaker.position.set(-1.5, 2, 0);
        barGroup.add(shaker);

        // Cocktail glasses
        for (let i = 0; i < 3; i++) {
            const glassGroup = new THREE.Group();

            // Glass cone
            const glassGeometry = new THREE.ConeGeometry(0.25, 0.6, 8);
            const glassMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.3,
                transmission: 0.9,
                roughness: 0.1
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.y = 0.3;
            glassGroup.add(glass);

            // Liquid
            const liquidGeometry = new THREE.ConeGeometry(0.2, 0.4, 8);
            const liquidColors = [0xFF69B4, 0x00CED1, 0xFFD700];
            const liquidMaterial = new THREE.MeshStandardMaterial({
                color: liquidColors[i],
                transparent: true,
                opacity: 0.7
            });
            const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
            liquid.position.y = 0.2;
            glassGroup.add(liquid);

            glassGroup.position.set(-2 + i * 1.5, 2, 0.5);
            barGroup.add(glassGroup);
        }

        // Bubble particles around bar
        const bubbleCount = 50;
        const bubbleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        this.barBubbles = [];

        for (let i = 0; i < bubbleCount; i++) {
            const bubbleMaterial = new THREE.MeshStandardMaterial({
                color: [0xFF69B4, 0x00CED1, 0xFFD700][Math.floor(random(0, 3))],
                transparent: true,
                opacity: 0.5
            });
            const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
            bubble.position.set(
                random(-3, 3),
                random(1, 2),
                random(-1, 1)
            );
            bubble.userData.velocity = random(0.2, 0.5);
            barGroup.add(bubble);
            this.barBubbles.push(bubble);
        }

        barGroup.position.set(-8, 0, 0);
        this.add(barGroup);

        // Animate bubbles
        this.addAnimatable({
            update: (deltaTime) => {
                this.barBubbles.forEach(bubble => {
                    bubble.position.y += bubble.userData.velocity * deltaTime;
                    bubble.position.x += Math.sin(bubble.position.y * 2) * deltaTime * 0.3;

                    if (bubble.position.y > 5) {
                        bubble.position.y = 1;
                        bubble.position.x = random(-3, 3);
                    }
                });
            }
        });
    }

    createGamingZone() {
        const gamingGroup = new THREE.Group();

        // Giant game controller
        const controllerBody = new THREE.BoxGeometry(4, 0.5, 2.5);
        const controllerMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B00FF,
            roughness: 0.4,
            metalness: 0.3
        });
        const controller = new THREE.Mesh(controllerBody, controllerMaterial);
        controller.position.y = 2;
        gamingGroup.add(controller);

        // D-pad
        const dpadGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
        const dpadMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000
        });
        const dpad = new THREE.Mesh(dpadGeometry, dpadMaterial);
        dpad.position.set(-1, 2.3, 0);
        gamingGroup.add(dpad);

        // Buttons (A, B, X, Y)
        const buttonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const buttonColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00];

        for (let i = 0; i < 4; i++) {
            const buttonMaterial = new THREE.MeshStandardMaterial({
                color: buttonColors[i],
                emissive: buttonColors[i],
                emissiveIntensity: 0.5
            });
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            const angle = (i / 4) * Math.PI * 2;
            button.position.set(
                1 + Math.cos(angle) * 0.5,
                2.3,
                Math.sin(angle) * 0.5
            );
            button.rotation.x = Math.PI / 2;
            gamingGroup.add(button);
        }

        // Joysticks
        const joystickGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const joystickMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });

        const leftJoystick = new THREE.Mesh(joystickGeometry, joystickMaterial);
        leftJoystick.position.set(-0.5, 2.3, 0.7);
        gamingGroup.add(leftJoystick);

        const rightJoystick = new THREE.Mesh(joystickGeometry, joystickMaterial);
        rightJoystick.position.set(0.5, 2.3, -0.7);
        gamingGroup.add(rightJoystick);

        gamingGroup.position.set(8, 0, 0);
        this.add(gamingGroup);

        // Animate controller
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                gamingGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
                gamingGroup.position.y = Math.sin(elapsedTime * 2) * 0.3;
            }
        });
    }

    createCodingWaterfall() {
        // Code characters falling like a waterfall
        const codeCharacters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]()<>;';
        const streamCount = 20;
        this.codeStreams = [];

        for (let i = 0; i < streamCount; i++) {
            const stream = {
                characters: [],
                position: new THREE.Vector3(
                    random(-15, 15),
                    random(5, 10),
                    -10
                ),
                speed: random(2, 5)
            };

            for (let j = 0; j < 10; j++) {
                const geometry = new THREE.PlaneGeometry(0.3, 0.3);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x00FF00,
                    transparent: true,
                    opacity: 1 - (j * 0.1)
                });

                const char = new THREE.Mesh(geometry, material);
                char.position.copy(stream.position);
                char.position.y -= j * 0.5;

                this.add(char);
                stream.characters.push(char);
            }

            this.codeStreams.push(stream);
        }

        // Animate code waterfall
        this.addAnimatable({
            update: (deltaTime) => {
                this.codeStreams.forEach(stream => {
                    stream.characters.forEach((char, index) => {
                        char.position.y -= stream.speed * deltaTime;

                        // Reset if too low
                        if (char.position.y < 0) {
                            char.position.y = 10 + index * 0.5;
                        }
                    });
                });
            }
        });
    }

    createCharacterAvatar() {
        // Cute Q-version character
        const characterGroup = new THREE.Group();

        // Head
        const headGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFDBAC // Skin tone
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3;
        characterGroup.add(head);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 3.2, 0.6);
        characterGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 3.2, 0.6);
        characterGroup.add(rightEye);

        // Smile
        const smileGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
        const smileMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF6B6B
        });
        const smile = new THREE.Mesh(smileGeometry, smileMaterial);
        smile.position.set(0, 2.7, 0.6);
        smile.rotation.z = Math.PI;
        characterGroup.add(smile);

        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x4169E1 // Blue shirt
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        characterGroup.add(body);

        // Arms
        const armGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 8, 16);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x4169E1
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.6, 1.7, 0);
        leftArm.rotation.z = Math.PI / 4;
        characterGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.6, 1.7, 0);
        rightArm.rotation.z = -Math.PI / 4;
        characterGroup.add(rightArm);

        characterGroup.position.set(0, 0, 3);
        this.add(characterGroup);

        // Animate character
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                // Bobbing animation
                characterGroup.position.y = Math.sin(elapsedTime * 2) * 0.2;

                // Waving arms
                leftArm.rotation.z = Math.PI / 4 + Math.sin(elapsedTime * 3) * 0.3;
                rightArm.rotation.z = -Math.PI / 4 - Math.sin(elapsedTime * 3) * 0.3;

                // Rotating head slightly
                head.rotation.y = Math.sin(elapsedTime) * 0.2;
            }
        });
    }

    createBubbles() {
        const bubbleCount = 30;
        this.bubbles = [];

        for (let i = 0; i < bubbleCount; i++) {
            const size = random(0.2, 0.6);
            const geometry = new THREE.SphereGeometry(size, 16, 16);
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.3,
                transmission: 0.9,
                roughness: 0.1,
                metalness: 0.1
            });

            const bubble = new THREE.Mesh(geometry, material);
            bubble.position.set(
                random(-20, 20),
                random(0, 10),
                random(-20, 20)
            );
            bubble.userData.velocity = random(0.5, 1.5);
            bubble.userData.wobble = random(0, Math.PI * 2);

            this.add(bubble);
            this.bubbles.push(bubble);
        }

        // Animate bubbles
        this.addAnimatable({
            update: (deltaTime, elapsedTime) => {
                this.bubbles.forEach(bubble => {
                    bubble.position.y += bubble.userData.velocity * deltaTime;
                    bubble.userData.wobble += deltaTime * 2;
                    bubble.position.x += Math.sin(bubble.userData.wobble) * deltaTime * 0.5;
                    bubble.position.z += Math.cos(bubble.userData.wobble) * deltaTime * 0.5;

                    if (bubble.position.y > 15) {
                        bubble.position.y = 0;
                        bubble.position.x = random(-20, 20);
                        bubble.position.z = random(-20, 20);
                    }

                    bubble.rotation.y += deltaTime;
                });
            }
        });
    }

    createRainbow() {
        const rainbowColors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x4B0082, 0x9400D3];
        const rainbowRadius = 15;

        rainbowColors.forEach((color, index) => {
            const curve = new THREE.EllipseCurve(
                0, 0,
                rainbowRadius - index * 0.5, rainbowRadius - index * 0.5,
                0, Math.PI,
                false,
                0
            );

            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(
                points.map(p => new THREE.Vector3(p.x, p.y + 5, -15))
            );

            const material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 5,
                transparent: true,
                opacity: 0.7
            });

            const rainbow = new THREE.Line(geometry, material);
            this.add(rainbow);
        });
    }

    onEnter() {
        super.onEnter();
        console.log('🎨 Welcome to the Cartoon World of Fun!');
    }
}
