// ===== ACHIEVEMENT SYSTEM - GAMIFICATION =====

export default class AchievementSystem {
    constructor(app) {
        this.app = app;
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.visitedScenes = new Set();

        this.initAchievements();
        this.loadProgress();
    }

    initAchievements() {
        // Define all achievements
        const achievementList = [
            {
                id: 'first_visit',
                name: '初次造訪',
                description: '歡迎來到我的數位宇宙',
                icon: '🚀',
                requirement: 'visit_home'
            },
            {
                id: 'explorer',
                name: '探索者',
                description: '訪問了 4 個不同的場景',
                icon: '🗺️',
                requirement: 'visit_4_scenes'
            },
            {
                id: 'completionist',
                name: '完美主義者',
                description: '探索了所有 8 個場景',
                icon: '⭐',
                requirement: 'visit_all_scenes'
            },
            {
                id: 'click_master',
                name: '點擊大師',
                description: '與 20 個物件互動過',
                icon: '🖱️',
                requirement: 'click_20_objects'
            },
            {
                id: 'time_traveler',
                name: '時光旅人',
                description: '深入時光隧道查看工作經歷',
                icon: '⏰',
                requirement: 'visit_timeline'
            },
            {
                id: 'stargazer',
                name: '觀星者',
                description: '在星系中探索教育背景',
                icon: '🌌',
                requirement: 'visit_galaxy'
            },
            {
                id: 'party_animal',
                name: '派對動物',
                description: '在卡通樂園中玩耍',
                icon: '🎉',
                requirement: 'visit_cartoon'
            },
            {
                id: 'connector',
                name: '聯絡達人',
                description: '訪問了聯絡頁面',
                icon: '📡',
                requirement: 'visit_network'
            },
            {
                id: 'speed_demon',
                name: '速度惡魔',
                description: '在 2 分鐘內訪問所有場景',
                icon: '⚡',
                requirement: 'fast_explorer'
            },
            {
                id: 'night_owl',
                name: '夜貓子',
                description: '在深夜訪問（00:00 - 06:00）',
                icon: '🦉',
                requirement: 'night_visit'
            },
            {
                id: 'secret_finder',
                name: '秘密發現者',
                description: '找到了隱藏的彩蛋',
                icon: '🥚',
                requirement: 'find_easter_egg'
            },
            {
                id: 'patient_one',
                name: '耐心的人',
                description: '在網站停留超過 5 分鐘',
                icon: '⏳',
                requirement: 'stay_5_min'
            }
        ];

        achievementList.forEach(ach => {
            this.achievements.set(ach.id, ach);
        });

        // Track stats
        this.stats = {
            clickCount: 0,
            visitTime: Date.now(),
            sceneVisitOrder: []
        };

        // Check for night visitor
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 6) {
            this.unlock('night_owl');
        }
    }

    /**
     * Unlock an achievement
     * @param {string} id - Achievement ID
     */
    unlock(id) {
        if (this.unlockedAchievements.has(id)) {
            return; // Already unlocked
        }

        const achievement = this.achievements.get(id);
        if (!achievement) {
            console.warn(`Achievement not found: ${id}`);
            return;
        }

        this.unlockedAchievements.add(id);
        this.showNotification(achievement);
        this.saveProgress();

        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
    }

    /**
     * Show achievement notification
     * @param {Object} achievement
     */
    showNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">成就解鎖！</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);

        // Play sound
        if (this.app.audioManager) {
            // this.app.audioManager.playSound('achievement');
        }
    }

    /**
     * Track scene visit
     * @param {string} sceneName
     */
    trackSceneVisit(sceneName) {
        this.visitedScenes.add(sceneName);
        this.stats.sceneVisitOrder.push({ scene: sceneName, time: Date.now() });

        // Check achievements
        if (sceneName === 'home' && !this.unlockedAchievements.has('first_visit')) {
            this.unlock('first_visit');
        }

        if (sceneName === 'timeline') {
            this.unlock('time_traveler');
        }

        if (sceneName === 'galaxy') {
            this.unlock('stargazer');
        }

        if (sceneName === 'cartoon') {
            this.unlock('party_animal');
        }

        if (sceneName === 'network') {
            this.unlock('connector');
        }

        // Explorer achievements
        if (this.visitedScenes.size >= 4 && !this.unlockedAchievements.has('explorer')) {
            this.unlock('explorer');
        }

        if (this.visitedScenes.size >= 8 && !this.unlockedAchievements.has('completionist')) {
            this.unlock('completionist');
        }

        // Speed demon check
        if (this.visitedScenes.size === 8) {
            const timeDiff = Date.now() - this.stats.visitTime;
            if (timeDiff < 2 * 60 * 1000) { // 2 minutes
                this.unlock('speed_demon');
            }
        }
    }

    /**
     * Track object click
     */
    trackClick() {
        this.stats.clickCount++;

        if (this.stats.clickCount >= 20 && !this.unlockedAchievements.has('click_master')) {
            this.unlock('click_master');
        }
    }

    /**
     * Track time spent
     */
    checkTimeSpent() {
        const timeSpent = Date.now() - this.stats.visitTime;

        if (timeSpent >= 5 * 60 * 1000 && !this.unlockedAchievements.has('patient_one')) {
            this.unlock('patient_one');
        }
    }

    /**
     * Trigger easter egg
     */
    triggerEasterEgg() {
        this.unlock('secret_finder');
    }

    /**
     * Get progress percentage
     * @returns {number}
     */
    getProgress() {
        return Math.round((this.unlockedAchievements.size / this.achievements.size) * 100);
    }

    /**
     * Get all achievements data
     * @returns {Array}
     */
    getAllAchievements() {
        const list = [];

        this.achievements.forEach((ach, id) => {
            list.push({
                ...ach,
                unlocked: this.unlockedAchievements.has(id)
            });
        });

        return list;
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const data = {
                unlocked: Array.from(this.unlockedAchievements),
                visited: Array.from(this.visitedScenes),
                stats: this.stats
            };
            localStorage.setItem('gustave_achievements', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save achievement progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('gustave_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.unlockedAchievements = new Set(data.unlocked || []);
                this.visitedScenes = new Set(data.visited || []);
                if (data.stats) {
                    this.stats = { ...this.stats, ...data.stats };
                }
            }
        } catch (error) {
            console.error('Failed to load achievement progress:', error);
        }
    }

    /**
     * Reset all progress
     */
    reset() {
        this.unlockedAchievements.clear();
        this.visitedScenes.clear();
        this.stats = {
            clickCount: 0,
            visitTime: Date.now(),
            sceneVisitOrder: []
        };
        localStorage.removeItem('gustave_achievements');
    }

    /**
     * Update system (called every frame)
     */
    update() {
        // Check time-based achievements
        this.checkTimeSpent();
    }
}
