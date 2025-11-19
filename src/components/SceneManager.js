// ===== SCENE MANAGER - HANDLES SCENE TRANSITIONS =====

import * as THREE from 'three';
import gsap from 'gsap';

// Import scenes
import HomeScene from '../scenes/HomeScene';
import CyberpunkCityScene from '../scenes/CyberpunkCityScene';
import RockStageScene from '../scenes/RockStageScene';
import ArcadeScene from '../scenes/ArcadeScene';
import TimelineScene from '../scenes/TimelineScene';
import GalaxyScene from '../scenes/GalaxyScene';
import CartoonScene from '../scenes/CartoonScene';
import NetworkScene from '../scenes/NetworkScene';

// Import resume content data
import { resumeContent } from '../data/resumeContent';

export default class SceneManager {
    constructor(app) {
        this.app = app;
        this.currentScene = null;
        this.scenes = new Map();
        this.isTransitioning = false;

        // Scene registry
        this.sceneClasses = {
            'home': HomeScene,
            'cyberpunk-city': CyberpunkCityScene,
            'rock-stage': RockStageScene,
            'arcade': ArcadeScene,
            'timeline': TimelineScene,
            'galaxy': GalaxyScene,
            'cartoon': CartoonScene,
            'network': NetworkScene
        };

        // Content segment state management
        this.currentSegmentIndex = 0;  // Current segment being displayed
        this.currentSegments = [];     // All segments for current scene
        this.isContentTransitioning = false;

        // Setup button listener for content navigation
        this.setupButtonListener();

        // Note: Don't initialize home scene here, wait for all managers to be ready
        // Will be initialized by Application after ContentDisplayManager is ready
    }

    /**
     * Switch to a different scene
     * @param {string} sceneName - Name of the scene to switch to
     */
    switchScene(sceneName) {
        if (this.isTransitioning) {
            console.warn('Scene transition already in progress');
            return;
        }

        console.log(`🔄 Switching to scene: ${sceneName}`);

        // Check if scene exists
        if (!this.sceneClasses[sceneName]) {
            console.error(`Scene "${sceneName}" not found`);
            return;
        }

        this.isTransitioning = true;

        // Show scene info
        this.showSceneInfo(sceneName);

        // Transition out current scene
        if (this.currentScene) {
            this.transitionOut(() => {
                this.loadScene(sceneName);
            });
        } else {
            this.loadScene(sceneName);
        }
    }

    /**
     * Load a scene
     * @param {string} sceneName - Name of the scene to load
     */
    loadScene(sceneName) {
        // Get or create scene
        let scene;

        if (this.scenes.has(sceneName)) {
            scene = this.scenes.get(sceneName);
        } else {
            const SceneClass = this.sceneClasses[sceneName];
            scene = new SceneClass(this.app);
            this.scenes.set(sceneName, scene);
        }

        // Unload current scene content from Three.js scene
        if (this.currentScene) {
            this.currentScene.exit();
        }

        // Load new scene
        this.currentScene = scene;
        this.currentScene.enter();

        // Track scene visit for achievements
        if (this.app.achievementSystem) {
            this.app.achievementSystem.trackSceneVisit(sceneName);
        }

        // Note: Content loading is now handled by showSceneInfo() in switchScene()
        // No need to call ContentDisplayManager - SceneManager handles all content display

        // Transition in
        this.transitionIn();
    }

    /**
     * Transition out effect
     * @param {Function} callback - Callback when transition complete
     */
    transitionOut(callback) {
        const camera = this.app.camera;

        // Camera zoom out effect
        gsap.to(camera.position, {
            z: camera.position.z + 5,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                if (callback) callback();
            }
        });

        // Fade out scene
        gsap.to(this.app.scene.fog, {
            density: 0.1,
            duration: 0.5
        });
    }

    /**
     * Transition in effect
     */
    transitionIn() {
        const camera = this.app.camera;

        // Reset fog
        this.app.scene.fog.density = 0.01;

        // Camera zoom in effect
        gsap.to(camera.position, {
            z: 5,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                this.isTransitioning = false;
                this.hideSceneInfo();
            }
        });
    }

    /**
     * Show scene information overlay
     * @param {string} sceneName - Name of the scene
     */
    showSceneInfo(sceneName) {
        const sceneData = this.getSceneData(sceneName);

        // Initialize segments for this scene
        this.currentSegments = sceneData.segments || [];
        this.currentSegmentIndex = 0;

        // Display first segment
        if (this.currentSegments.length > 0) {
            this.displaySegment(0);
        }

        // Show nuclear button
        const buttonContainer = document.getElementById('nuclear-button-container');
        if (buttonContainer) {
            buttonContainer.classList.add('show');
        }

        // Show navigation hint after a delay
        this.showInitialHint();
    }

    /**
     * Hide scene information overlay
     * Note: Removed automatic hiding - content now controlled by button press
     */
    hideSceneInfo() {
        // Auto-hide removed - content stays visible until user interacts
        // Button press now controls content display
    }

    /**
     * Get scene metadata with content segments
     * @param {string} sceneName - Name of the scene
     * @returns {Object} Scene data with segments array
     */
    getSceneData(sceneName) {
        const contentMap = {
            'home': resumeContent.home,
            'cyberpunk-city': resumeContent.about,
            'rock-stage': resumeContent.skills,
            'arcade': resumeContent.projects,
            'timeline': resumeContent.experience,
            'galaxy': resumeContent.education,
            'cartoon': resumeContent.hobbies,
            'network': resumeContent.contact
        };

        const content = contentMap[sceneName];
        if (!content) {
            return { segments: [] };
        }

        // Prepare segments based on scene type
        return this.prepareSegments(sceneName, content);
    }

    /**
     * Prepare content segments from scene data
     * @param {string} sceneName - Name of the scene
     * @param {Object} content - Scene content object
     * @returns {Object} Object with segments array
     */
    prepareSegments(sceneName, content) {
        const segments = [];

        if (sceneName === 'home') {
            segments.push({
                title: content.title,
                text: `${content.greeting}\n${content.description}`
            });
            segments.push({
                title: '',
                text: content.instruction
            });
        }
        else if (sceneName === 'cyberpunk-city') {
            segments.push({
                title: content.subtitle,
                text: content.intro
            });
            segments.push({
                title: '',
                text: content.background
            });
            segments.push({
                title: '',
                text: content.languages
            });
            segments.push({
                title: '',
                text: content.achievements
            });
            segments.push({
                title: '',
                text: content.current
            });
            segments.push({
                title: content.future.title,
                text: content.future.content
            });
        }
        else if (sceneName === 'rock-stage') {
            segments.push({
                title: content.subtitle,
                text: content.core.title
            });
            content.core.items.forEach(skill => {
                segments.push({
                    title: `${skill.icon} ${skill.name}`,
                    text: skill.description
                });
            });
            segments.push({
                title: content.domains.title,
                text: content.domains.items.join('\n\n')
            });
            segments.push({
                title: content.other.title,
                text: content.other.items.join('\n\n')
            });
        }
        else if (sceneName === 'arcade') {
            segments.push({
                title: content.subtitle,
                text: '互動的專案作品集'
            });
            content.items.forEach(project => {
                const tags = project.tags.join(' | ');
                segments.push({
                    title: `${project.icon} ${project.name}`,
                    text: `${project.type}\n\n${project.description}\n\n${tags}`
                });
            });
        }
        else if (sceneName === 'timeline') {
            segments.push({
                title: content.subtitle,
                text: '我的工作經歷時間軸'
            });
            content.items.forEach(exp => {
                const details = exp.details.length > 0 ? '\n\n• ' + exp.details.join('\n• ') : '';
                segments.push({
                    title: `${exp.icon} ${exp.company}`,
                    text: `${exp.role}\n${exp.period}\n\n${exp.description}${details}`
                });
            });
        }
        else if (sceneName === 'galaxy') {
            segments.push({
                title: content.subtitle,
                text: '教育背景與學習歷程'
            });
            content.items.forEach(edu => {
                const courses = edu.courses.join(' | ');
                segments.push({
                    title: `${edu.icon} ${edu.school}`,
                    text: `${edu.degree}\n${edu.period}\n\n${edu.description}\n\n${courses}`
                });
            });
        }
        else if (sceneName === 'cartoon') {
            segments.push({
                title: content.subtitle,
                text: '我的興趣與生活'
            });
            content.items.forEach(hobby => {
                segments.push({
                    title: `${hobby.icon} ${hobby.name}`,
                    text: hobby.description
                });
            });
        }
        else if (sceneName === 'network') {
            segments.push({
                title: content.subtitle,
                text: content.quote
            });
            segments.push({
                title: content.professional.title,
                text: content.professional.items.map(item =>
                    `${item.icon} ${item.label}: ${item.value}`
                ).join('\n\n')
            });
            segments.push({
                title: content.languages.title,
                text: content.languages.items.join(' | ')
            });
            segments.push({
                title: content.status.title,
                text: content.status.message
            });
        }

        return { segments };
    }

    /**
     * Update current scene
     * @param {number} deltaTime - Time since last frame
     * @param {number} elapsedTime - Total elapsed time
     */
    update(deltaTime, elapsedTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime, elapsedTime);
        }
    }

    /**
     * Setup nuclear button click listener
     */
    setupButtonListener() {
        const nuclearButton = document.getElementById('nuclear-button');
        if (nuclearButton) {
            nuclearButton.addEventListener('click', () => {
                console.log('🔴 Nuclear Button Clicked!');
                this.nextSegment();
            });
        }
    }

    /**
     * Display a specific segment
     * @param {number} index - Segment index to display
     */
    displaySegment(index) {
        if (index < 0 || index >= this.currentSegments.length) return;
        if (this.isContentTransitioning) return;

        const segment = this.currentSegments[index];
        const sceneInfo = document.getElementById('scene-info');
        const sceneTitle = document.getElementById('scene-title');
        const sceneDescription = document.getElementById('scene-description');

        // Update content
        if (sceneTitle) {
            sceneTitle.textContent = segment.title || '';
            sceneTitle.style.display = segment.title ? 'block' : 'none';
        }
        if (sceneDescription) {
            sceneDescription.textContent = segment.text || '';
        }

        // Show scene info container
        if (sceneInfo) {
            sceneInfo.classList.add('show');
        }

        this.currentSegmentIndex = index;
    }

    /**
     * Show next segment (循環：內容1 → ... → 內容N → 內容1)
     */
    nextSegment() {
        if (this.currentSegments.length === 0) return;
        if (this.isContentTransitioning) return;

        // Calculate next index (loop back to 0 after last segment)
        let nextIndex = this.currentSegmentIndex + 1;
        if (nextIndex >= this.currentSegments.length) {
            nextIndex = 0; // Loop back to first segment
        }

        this.displaySegment(nextIndex);

        console.log(`📄 Showing segment ${nextIndex + 1}/${this.currentSegments.length}`);
    }

    /**
     * Show initial navigation hint
     */
    showInitialHint() {
        // Remove existing hint if present
        const existingHint = document.getElementById('navigation-hint');
        if (existingHint) {
            existingHint.remove();
        }

        // Create new hint
        const hint = document.createElement('div');
        hint.id = 'navigation-hint';
        hint.classList.add('navigation-hint');
        hint.innerHTML = `
            <p>💡 按下紅色按鈕查看更多內容</p>
            <p>想看其他主題？點擊左上角選單</p>
        `;
        document.body.appendChild(hint);

        // Show hint with fade-in
        setTimeout(() => {
            hint.classList.add('show');
        }, 100);

        // Hide hint after 3.6 seconds (60% of original 6s) with fade-out
        setTimeout(() => {
            hint.classList.add('fade-out');
            setTimeout(() => {
                hint.remove();
            }, 1000);
        }, 3600);
    }

    /**
     * Dispose all scenes
     */
    dispose() {
        this.scenes.forEach(scene => {
            if (scene.dispose) {
                scene.dispose();
            }
        });
        this.scenes.clear();
        this.currentScene = null;
    }
}
