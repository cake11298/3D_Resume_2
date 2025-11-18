// ===== POST PROCESSING MANAGER - VISUAL EFFECTS =====

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

export default class PostProcessingManager {
    constructor(app) {
        this.app = app;
        this.composer = null;
        this.bloomPass = null;
        this.chromaticAberrationPass = null;
        this.enabled = true;

        this.setupPostProcessing();
    }

    setupPostProcessing() {
        const { renderer, scene, camera } = this.app;

        // Create composer
        this.composer = new EffectComposer(renderer);

        // Render pass
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        // Bloom pass
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );
        this.composer.addPass(this.bloomPass);

        // Chromatic aberration shader
        const chromaticAberrationShader = {
            uniforms: {
                'tDiffuse': { value: null },
                'amount': { value: 0.002 },
                'time': { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float amount;
                uniform float time;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    vec2 direction = uv - vec2(0.5);
                    float dist = length(direction) * amount;

                    vec2 offset = direction * dist;

                    float r = texture2D(tDiffuse, uv + offset).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - offset).b;

                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            `
        };

        this.chromaticAberrationPass = new ShaderPass(chromaticAberrationShader);
        this.composer.addPass(this.chromaticAberrationPass);

        // Vignette shader
        const vignetteShader = {
            uniforms: {
                'tDiffuse': { value: null },
                'darkness': { value: 1.5 },
                'offset': { value: 0.95 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float darkness;
                uniform float offset;
                varying vec2 vUv;

                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
                    float vignette = 1.0 - dot(uv, uv);
                    color.rgb *= clamp(pow(vignette, darkness), 0.0, 1.0);
                    gl_FragColor = color;
                }
            `
        };

        const vignettePass = new ShaderPass(vignetteShader);
        this.composer.addPass(vignettePass);

        // Glitch shader (for cyberpunk scenes)
        const glitchShader = {
            uniforms: {
                'tDiffuse': { value: null },
                'time': { value: 0 },
                'distortion': { value: 0 },
                'distortion2': { value: 0 },
                'speed': { value: 0.3 },
                'rollSpeed': { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform float distortion;
                uniform float distortion2;
                uniform float speed;
                uniform float rollSpeed;
                varying vec2 vUv;

                vec3 mod289(vec3 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }

                vec2 mod289(vec2 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }

                vec3 permute(vec3 x) {
                    return mod289(((x * 34.0) + 1.0) * x);
                }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
                    m = m * m;
                    m = m * m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    vec2 uv = vUv;

                    float t = time * speed;

                    // Glitch effect
                    if (distortion > 0.0) {
                        float noise = snoise(vec2(uv.y * 10.0, t));
                        if (noise > 0.8) {
                            uv.x += (noise - 0.8) * distortion;
                        }
                    }

                    // RGB split
                    if (distortion2 > 0.0) {
                        float splitAmount = distortion2 * 0.01;
                        float r = texture2D(tDiffuse, uv + vec2(splitAmount, 0.0)).r;
                        float g = texture2D(tDiffuse, uv).g;
                        float b = texture2D(tDiffuse, uv - vec2(splitAmount, 0.0)).b;
                        gl_FragColor = vec4(r, g, b, 1.0);
                    } else {
                        gl_FragColor = texture2D(tDiffuse, uv);
                    }
                }
            `
        };

        this.glitchPass = new ShaderPass(glitchShader);
        this.composer.addPass(this.glitchPass);

        console.log('✨ Post-processing effects initialized');
    }

    /**
     * Update post-processing effects
     * @param {number} deltaTime - Time since last frame
     * @param {number} elapsedTime - Total elapsed time
     */
    update(deltaTime, elapsedTime) {
        if (!this.enabled) return;

        // Update shader uniforms
        if (this.chromaticAberrationPass) {
            this.chromaticAberrationPass.uniforms.time.value = elapsedTime;
        }

        if (this.glitchPass) {
            this.glitchPass.uniforms.time.value = elapsedTime;

            // Random glitch effect
            if (Math.random() > 0.98) {
                this.glitchPass.uniforms.distortion.value = Math.random() * 0.1;
                this.glitchPass.uniforms.distortion2.value = Math.random() * 2;

                setTimeout(() => {
                    this.glitchPass.uniforms.distortion.value = 0;
                    this.glitchPass.uniforms.distortion2.value = 0;
                }, 50);
            }
        }
    }

    /**
     * Render the scene with post-processing
     */
    render() {
        if (this.enabled && this.composer) {
            this.composer.render();
        } else {
            this.app.renderer.render(this.app.scene, this.app.camera);
        }
    }

    /**
     * Handle window resize
     */
    onResize() {
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }

        if (this.bloomPass) {
            this.bloomPass.resolution.set(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * Enable/disable post-processing
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Set bloom strength
     * @param {number} strength - Bloom strength (0-3)
     */
    setBloomStrength(strength) {
        if (this.bloomPass) {
            this.bloomPass.strength = strength;
        }
    }

    /**
     * Set chromatic aberration amount
     * @param {number} amount - Aberration amount (0-0.01)
     */
    setChromaticAberration(amount) {
        if (this.chromaticAberrationPass) {
            this.chromaticAberrationPass.uniforms.amount.value = amount;
        }
    }

    /**
     * Cleanup
     */
    dispose() {
        if (this.composer) {
            this.composer.dispose();
        }
    }
}
