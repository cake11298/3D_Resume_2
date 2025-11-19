// ===== APPLICATION CORE - MAIN 3D ENGINE =====

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SceneManager from './SceneManager';
import InputController from './InputController';
import AudioManager from './AudioManager';
import PostProcessingManager from './PostProcessingManager';
import InteractionManager from './InteractionManager';
import AchievementSystem from './AchievementSystem';
import ContentDisplayManager from './ContentDisplayManager';

export default class Application {
    constructor(options = {}) {
        this.container = options.container;
        this.loadingManager = options.loadingManager;

        // Scene properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // Managers
        this.sceneManager = null;
        this.inputController = null;
        this.audioManager = null;
        this.postProcessing = null;
        this.interactionManager = null;
        this.achievementSystem = null;
        this.contentDisplayManager = null;

        // Animation
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        this.elapsedTime = 0;

        // Performance
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = performance.now();

        // Settings
        this.settings = {
            quality: 'medium',
            musicVolume: 0.5,
            sfxVolume: 0.7,
            language: 'zh'
        };

        // State
        this.isRunning = false;
        this.isDisposed = false;
    }

    init() {
        console.log('🎨 Initializing 3D Scene...');

        // Setup Three.js core components
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();

        // Setup managers
        this.sceneManager = new SceneManager(this);
        this.inputController = new InputController(this);
        this.audioManager = new AudioManager(this);
        // Disable post-processing (too intense, causes motion sickness)
        // this.postProcessing = new PostProcessingManager(this);
        this.postProcessing = null;
        this.interactionManager = new InteractionManager(this);
        this.achievementSystem = new AchievementSystem(this);
        this.contentDisplayManager = new ContentDisplayManager(this);

        // Setup UI
        this.setupUI();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Initialize home scene (after all managers are ready)
        this.sceneManager.switchScene('home');

        // Start animation loop
        this.start();

        console.log('✅ Application initialized successfully!');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.01);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 5);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.settings.quality !== 'low',
            alpha: false,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.getPixelRatio());
        this.renderer.shadowMap.enabled = this.settings.quality !== 'low';
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        this.container.appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        // Disable zoom (mouse wheel is used for content navigation)
        this.controls.enableZoom = false;
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);

        // Neon lights for cyberpunk effect
        const neonPink = new THREE.PointLight(0xFF00FF, 2, 10);
        neonPink.position.set(-5, 3, 0);
        this.scene.add(neonPink);

        const neonBlue = new THREE.PointLight(0x00FFFF, 2, 10);
        neonBlue.position.set(5, 3, 0);
        this.scene.add(neonBlue);

        // Store lights for animation
        this.lights = {
            ambient: ambientLight,
            directional: directionalLight,
            neonPink: neonPink,
            neonBlue: neonBlue
        };
    }

    setupUI() {
        // Menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('nav-hidden');
        });

        // Settings toggle
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsContent = document.getElementById('settings-content');

        settingsToggle.addEventListener('click', () => {
            settingsContent.classList.toggle('hidden');
        });

        // Quality setting
        const qualitySelect = document.getElementById('quality-select');
        qualitySelect.value = this.settings.quality;
        qualitySelect.addEventListener('change', (e) => {
            this.setQuality(e.target.value);
        });

        // Music volume
        const musicVolume = document.getElementById('music-volume');
        musicVolume.value = this.settings.musicVolume * 100;
        musicVolume.addEventListener('input', (e) => {
            this.settings.musicVolume = e.target.value / 100;
            this.audioManager?.setMusicVolume(this.settings.musicVolume);
        });

        // SFX volume
        const sfxVolume = document.getElementById('sfx-volume');
        sfxVolume.value = this.settings.sfxVolume * 100;
        sfxVolume.addEventListener('input', (e) => {
            this.settings.sfxVolume = e.target.value / 100;
            this.audioManager?.setSFXVolume(this.settings.sfxVolume);
        });

        // Language
        const languageSelect = document.getElementById('language-select');
        languageSelect.value = this.settings.language;
        languageSelect.addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            // TODO: Implement language switching
        });

        // Navigation items
        const navItems = document.querySelectorAll('.nav-items li');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sceneName = item.getAttribute('data-scene');
                this.sceneManager?.switchScene(sceneName);

                // Update active state
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Close menu on mobile
                if (window.innerWidth <= 768) {
                    mainNav.classList.add('nav-hidden');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }

    getPixelRatio() {
        const quality = this.settings.quality;
        const maxPixelRatio = window.devicePixelRatio;

        switch (quality) {
            case 'high':
                return Math.min(maxPixelRatio, 2);
            case 'medium':
                return Math.min(maxPixelRatio, 1.5);
            case 'low':
                return 1;
            default:
                return Math.min(maxPixelRatio, 1.5);
        }
    }

    setQuality(quality) {
        this.settings.quality = quality;
        this.renderer.setPixelRatio(this.getPixelRatio());
        this.renderer.shadowMap.enabled = quality !== 'low';

        console.log(`Quality set to: ${quality}`);
    }

    onWindowResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Update post-processing
        if (this.postProcessing) {
            this.postProcessing.onResize();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning || this.isDisposed) return;

        requestAnimationFrame(this.animate.bind(this));

        // Calculate delta time
        this.deltaTime = this.clock.getDelta();
        this.elapsedTime = this.clock.getElapsedTime();

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Update scene manager
        if (this.sceneManager) {
            this.sceneManager.update(this.deltaTime, this.elapsedTime);
        }

        // Animate lights
        this.animateLights();

        // Update input controller
        if (this.inputController) {
            this.inputController.update(this.deltaTime);
        }

        // Update post-processing
        if (this.postProcessing) {
            this.postProcessing.update(this.deltaTime, this.elapsedTime);
        }

        // Update achievement system
        if (this.achievementSystem) {
            this.achievementSystem.update();
        }

        // Render scene with post-processing
        if (this.postProcessing) {
            this.postProcessing.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }

        // Update performance stats
        this.updatePerformance();
    }

    animateLights() {
        if (!this.lights) return;

        // Pulsing neon lights
        const pulse = Math.sin(this.elapsedTime * 2) * 0.5 + 0.5;
        this.lights.neonPink.intensity = 1.5 + pulse;
        this.lights.neonBlue.intensity = 1.5 + (1 - pulse);
    }

    updatePerformance() {
        this.frameCount++;
        const currentTime = performance.now();

        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;

            // Update performance stats display (if enabled)
            const perfStats = document.getElementById('performance-stats');
            if (perfStats && !perfStats.classList.contains('hidden')) {
                perfStats.innerHTML = `
                    FPS: ${this.fps}<br>
                    Triangles: ${this.renderer.info.render.triangles.toLocaleString()}<br>
                    Calls: ${this.renderer.info.render.calls}<br>
                    Geometries: ${this.renderer.info.memory.geometries}<br>
                    Textures: ${this.renderer.info.memory.textures}
                `;
            }
        }
    }

    dispose() {
        if (this.isDisposed) return;

        console.log('🧹 Cleaning up application...');

        this.stop();

        // Dispose scene manager
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }

        // Dispose controls
        if (this.controls) {
            this.controls.dispose();
        }

        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
        }

        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize.bind(this));

        this.isDisposed = true;
        console.log('✅ Application disposed');
    }
}
