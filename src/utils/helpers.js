// ===== UTILITY HELPER FUNCTIONS =====

import * as THREE from 'three';

/**
 * Check if WebGL is supported
 * @returns {boolean} True if WebGL is supported
 */
export function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl && gl instanceof WebGLRenderingContext;
    } catch (e) {
        return false;
    }
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Time (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Map a value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export function map(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

/**
 * Random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Create a neon material
 * @param {number} color - Color value
 * @param {number} intensity - Glow intensity
 * @returns {THREE.MeshStandardMaterial} Neon material
 */
export function createNeonMaterial(color, intensity = 2) {
    return new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: intensity,
        metalness: 0.8,
        roughness: 0.2
    });
}

/**
 * Create a holographic material
 * @param {number} color - Base color
 * @returns {THREE.MeshPhysicalMaterial} Holographic material
 */
export function createHolographicMaterial(color = 0x00ffff) {
    return new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        transmission: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
}

/**
 * Create a metallic material
 * @param {number} color - Base color
 * @returns {THREE.MeshStandardMaterial} Metallic material
 */
export function createMetallicMaterial(color = 0xc0c0c0) {
    return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 1.0,
        roughness: 0.3
    });
}

/**
 * Dispose of a Three.js object and its children
 * @param {THREE.Object3D} object - Object to dispose
 */
export function disposeObject(object) {
    if (!object) return;

    // Dispose geometry
    if (object.geometry) {
        object.geometry.dispose();
    }

    // Dispose material
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(material => disposeMaterial(material));
        } else {
            disposeMaterial(object.material);
        }
    }

    // Dispose children
    if (object.children) {
        object.children.forEach(child => disposeObject(child));
    }
}

/**
 * Dispose of a material and its textures
 * @param {THREE.Material} material - Material to dispose
 */
function disposeMaterial(material) {
    if (!material) return;

    // Dispose textures
    for (const key in material) {
        if (material[key] && material[key].isTexture) {
            material[key].dispose();
        }
    }

    material.dispose();
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create a grid helper with neon style
 * @param {number} size - Grid size
 * @param {number} divisions - Number of divisions
 * @param {number} color1 - First color
 * @param {number} color2 - Second color
 * @returns {THREE.GridHelper} Grid helper
 */
export function createNeonGrid(size = 100, divisions = 100, color1 = 0xFF00FF, color2 = 0x00FFFF) {
    const grid = new THREE.GridHelper(size, divisions, color1, color2);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    return grid;
}

/**
 * Create particles
 * @param {number} count - Number of particles
 * @param {number} color - Particle color
 * @param {number} size - Particle size
 * @returns {THREE.Points} Particle system
 */
export function createParticles(count = 1000, color = 0xffffff, size = 0.1) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
}

/**
 * Easing functions
 */
export const easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};
