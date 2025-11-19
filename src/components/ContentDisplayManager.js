// ===== CONTENT DISPLAY MANAGER - 3D SUBTITLE STYLE CONTENT =====

import { resumeContent } from '../data/resumeContent';

export default class ContentDisplayManager {
    constructor(app) {
        this.app = app;

        // DOM Elements
        this.titleElement = document.getElementById('content-title');
        this.textElement = document.getElementById('content-text');
        this.hintElement = document.getElementById('content-hint');
        this.blackTransition = document.getElementById('black-transition');
        this.nuclearButton = document.getElementById('nuclear-button');
        this.nuclearButtonContainer = document.getElementById('nuclear-button-container');

        // Content state
        this.currentScene = null;
        this.currentSegments = [];
        this.currentSegmentIndex = -1;
        this.isTransitioning = false;

        // Button interaction cooldown
        this.buttonCooldown = false;
        this.buttonCooldownTime = 1200; // ms

        // Setup button click listener
        this.setupButtonListener();
    }

    /**
     * Setup nuclear button click listener
     */
    setupButtonListener() {
        if (this.nuclearButton) {
            this.nuclearButton.addEventListener('click', () => {
                console.log('🔴 Nuclear Button Clicked!');
                this.onButtonPress();
            });
        }
    }

    /**
     * Load content for a specific scene
     * @param {string} sceneName - Name of the scene
     */
    loadSceneContent(sceneName) {
        this.currentScene = sceneName;
        this.currentSegmentIndex = -1;

        // Get content for this scene
        const content = this.getContentForScene(sceneName);

        if (!content) {
            this.hideAll();
            return;
        }

        // Prepare segments
        this.currentSegments = this.prepareSegments(content);

        // Hide button initially
        if (this.nuclearButtonContainer) {
            this.nuclearButtonContainer.classList.remove('show');
        }

        // Wait for scene transition AND scene info to complete, then show first segment
        // SceneManager shows scene info, then hides it after 2 seconds in hideSceneInfo()
        // We need to wait at least 2.5 seconds to ensure scene info is fully hidden
        setTimeout(() => {
            if (this.currentSegments.length > 0) {
                this.showSegment(0);
                // Show button when content is ready
                if (this.nuclearButtonContainer) {
                    this.nuclearButtonContainer.classList.add('show');
                }
            }
        }, 2800); // Wait 2.8 seconds to ensure scene info is completely hidden
    }

    /**
     * Get content data for a scene
     * @param {string} sceneName
     * @returns {Object|null}
     */
    getContentForScene(sceneName) {
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

        return contentMap[sceneName] || null;
    }

    /**
     * Prepare content segments from scene data
     * @param {Object} content - Scene content object
     * @returns {Array} Array of segment objects
     */
    prepareSegments(content) {
        const segments = [];

        // Handle different content structures for each scene
        if (this.currentScene === 'home') {
            segments.push({
                title: content.title,
                text: `${content.greeting}\n${content.description}`
            });
            segments.push({
                title: '',
                text: content.instruction
            });
        }
        else if (this.currentScene === 'cyberpunk-city') {
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
        else if (this.currentScene === 'rock-stage') {
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
        else if (this.currentScene === 'arcade') {
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
        else if (this.currentScene === 'timeline') {
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
        else if (this.currentScene === 'galaxy') {
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
        else if (this.currentScene === 'cartoon') {
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
        else if (this.currentScene === 'network') {
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

        return segments;
    }

    /**
     * Show a specific segment with cinematic black transition
     * @param {number} index
     */
    showSegment(index) {
        if (index < 0 || index >= this.currentSegments.length) return;
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const segment = this.currentSegments[index];

        if (this.currentSegmentIndex >= 0) {
            // CINEMATIC TRANSITION: Fade to black → Change content → Fade from black

            // Step 1: Fade current content out
            this.fadeOut(() => {

                // Step 2: Black screen transition
                this.showBlackScreen(() => {

                    // Step 3: Update content while screen is black
                    this.updateContent(segment);

                    // Step 4: Hide black screen and fade in new content
                    this.hideBlackScreen(() => {
                        this.fadeIn();
                        this.currentSegmentIndex = index;
                        this.updateHint();
                    });
                });
            });
        } else {
            // First segment - no black transition, just fade in
            this.updateContent(segment);
            this.fadeIn();
            this.currentSegmentIndex = index;
            this.updateHint();
        }
    }

    /**
     * Show black screen (cinematic transition)
     * @param {Function} callback
     */
    showBlackScreen(callback) {
        this.blackTransition.classList.add('active');
        setTimeout(() => {
            if (callback) callback();
        }, 600); // Match CSS transition duration
    }

    /**
     * Hide black screen
     * @param {Function} callback
     */
    hideBlackScreen(callback) {
        setTimeout(() => {
            this.blackTransition.classList.remove('active');
            setTimeout(() => {
                if (callback) callback();
            }, 600); // Match CSS transition duration
        }, 100);
    }

    /**
     * Update content in DOM
     * @param {Object} segment
     */
    updateContent(segment) {
        const titleH1 = this.titleElement.querySelector('h1');
        const textP = this.textElement.querySelector('p');

        if (titleH1) titleH1.textContent = segment.title || '';
        if (textP) textP.textContent = segment.text || '';

        // Hide title if empty
        if (!segment.title) {
            this.titleElement.style.display = 'none';
        } else {
            this.titleElement.style.display = 'block';
        }
    }

    /**
     * Fade in content
     */
    fadeIn() {
        setTimeout(() => {
            // Remove fade-out from the elements themselves (they ARE .content-section)
            this.titleElement.classList.remove('fade-out');
            this.textElement.classList.remove('fade-out');

            // Add show class to make content visible
            this.titleElement.classList.add('show');
            this.textElement.classList.add('show');

            setTimeout(() => {
                this.isTransitioning = false;
            }, 800);
        }, 50);
    }

    /**
     * Fade out content
     * @param {Function} callback
     */
    fadeOut(callback) {
        this.titleElement.classList.add('fade-out');
        this.textElement.classList.add('fade-out');
        this.titleElement.classList.remove('show');
        this.textElement.classList.remove('show');

        setTimeout(() => {
            if (callback) callback();
        }, 400);
    }

    /**
     * Update hint visibility - always show hint for button navigation
     */
    updateHint() {
        if (this.currentSegments.length > 1) {
            this.hintElement.classList.add('show');

            // Update hint text based on position
            const hintText = this.hintElement.querySelector('p');
            if (hintText) {
                const current = this.currentSegmentIndex + 1;
                const total = this.currentSegments.length;
                hintText.textContent = `按紅色按鈕查看下一段 (${current}/${total}) 🔴`;
            }
        } else {
            this.hintElement.classList.remove('show');
        }
    }

    /**
     * Show next segment (循環：最後一段後回到第一段)
     */
    nextSegment() {
        if (this.currentSegments.length === 0) return;

        let nextIndex = this.currentSegmentIndex + 1;
        // Loop back to first segment if at the end
        if (nextIndex >= this.currentSegments.length) {
            nextIndex = 0;
        }
        this.showSegment(nextIndex);
    }

    /**
     * Show previous segment (循環：第一段前回到最後一段)
     */
    previousSegment() {
        if (this.currentSegments.length === 0) return;

        let prevIndex = this.currentSegmentIndex - 1;
        // Loop back to last segment if at the beginning
        if (prevIndex < 0) {
            prevIndex = this.currentSegments.length - 1;
        }
        this.showSegment(prevIndex);
    }

    /**
     * Handle nuclear button press - cycles through segments
     */
    onButtonPress() {
        if (this.buttonCooldown || this.isTransitioning) return;
        if (this.currentSegments.length === 0) return;

        // Trigger next segment
        this.nextSegment();

        // Set cooldown
        this.buttonCooldown = true;
        setTimeout(() => {
            this.buttonCooldown = false;
        }, this.buttonCooldownTime);
    }

    /**
     * Hide all content
     */
    hideAll() {
        this.titleElement.classList.remove('show');
        this.textElement.classList.remove('show');
        this.hintElement.classList.remove('show');
        if (this.nuclearButtonContainer) {
            this.nuclearButtonContainer.classList.remove('show');
        }
        this.currentSegments = [];
        this.currentSegmentIndex = -1;
    }

    /**
     * Clear content when scene changes
     */
    clear() {
        // Hide button immediately when clearing
        if (this.nuclearButtonContainer) {
            this.nuclearButtonContainer.classList.remove('show');
        }
        this.fadeOut(() => {
            this.hideAll();
        });
    }
}
