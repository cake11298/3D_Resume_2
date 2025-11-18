// ===== AUDIO MANAGER - HANDLES MUSIC AND SOUND EFFECTS =====

export default class AudioManager {
    constructor(app) {
        this.app = app;

        // Audio context
        this.context = null;
        this.sounds = new Map();
        this.music = new Map();

        // Volume settings
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.masterVolume = 1.0;

        // Currently playing
        this.currentMusic = null;

        // Initialize audio context on user interaction
        this.initialized = false;
        this.setupAudioContext();
    }

    setupAudioContext() {
        // Wait for user interaction to initialize audio
        const initAudio = () => {
            if (this.initialized) return;

            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
                console.log('🔊 Audio context initialized');

                // Remove event listeners
                document.removeEventListener('click', initAudio);
                document.removeEventListener('touchstart', initAudio);
                document.removeEventListener('keydown', initAudio);
            } catch (error) {
                console.error('Failed to initialize audio context:', error);
            }
        };

        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('touchstart', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
    }

    /**
     * Load a sound effect
     * @param {string} name - Name identifier for the sound
     * @param {string} url - URL to the audio file
     */
    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

            this.sounds.set(name, audioBuffer);
            console.log(`✅ Sound loaded: ${name}`);
        } catch (error) {
            console.error(`Failed to load sound: ${name}`, error);
        }
    }

    /**
     * Play a sound effect
     * @param {string} name - Name of the sound to play
     * @param {Object} options - Playback options
     */
    playSound(name, options = {}) {
        if (!this.initialized || !this.sounds.has(name)) {
            return;
        }

        const audioBuffer = this.sounds.get(name);
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Apply volume
        const volume = (options.volume || 1.0) * this.sfxVolume * this.masterVolume;
        gainNode.gain.value = volume;

        // Playback rate (pitch)
        if (options.rate) {
            source.playbackRate.value = options.rate;
        }

        // Loop
        if (options.loop) {
            source.loop = true;
        }

        source.start(0);

        return source;
    }

    /**
     * Play background music
     * @param {string} name - Name of the music track
     * @param {boolean} loop - Whether to loop the music
     */
    playMusic(name, loop = true) {
        if (!this.initialized) {
            console.warn('Audio not initialized yet');
            return;
        }

        // Stop current music
        this.stopMusic();

        // Create audio element for music (easier for long tracks)
        const audio = new Audio();
        audio.src = `/audio/${name}.mp3`;
        audio.loop = loop;
        audio.volume = this.musicVolume * this.masterVolume;

        audio.play().catch(error => {
            console.error('Failed to play music:', error);
        });

        this.currentMusic = audio;
        this.music.set(name, audio);
    }

    /**
     * Stop current music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    /**
     * Set music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));

        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }

    /**
     * Set SFX volume
     * @param {number} volume - Volume level (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0-1)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));

        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }

    /**
     * Cleanup
     */
    dispose() {
        this.stopMusic();

        if (this.context) {
            this.context.close();
        }

        this.sounds.clear();
        this.music.clear();
    }
}
