"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './LightPillar.css';

interface LightPillarProps {
    topColor?: string;
    bottomColor?: string;
    intensity?: number;
    rotationSpeed?: number;
    interactive?: boolean;
    className?: string;
    glowAmount?: number;
    pillarWidth?: number;
    pillarHeight?: number;
    noiseIntensity?: number;
    mixBlendMode?: "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity";
    pillarRotation?: number;
}

const LightPillar = ({
    topColor = '#5227FF',
    bottomColor = '#FF9FFC',
    intensity = 1.0,
    rotationSpeed = 0.3,
    interactive = false,
    className = '',
    glowAmount = 0.005,
    pillarWidth = 3.0,
    pillarHeight = 0.4,
    noiseIntensity = 0.5,
    mixBlendMode = 'screen',
    pillarRotation = 0
}: LightPillarProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(null);
    const rendererRef = useRef<THREE.WebGLRenderer>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const sceneRef = useRef<THREE.Scene>(null);
    const cameraRef = useRef<THREE.OrthographicCamera>(null);
    const geometryRef = useRef<THREE.PlaneGeometry>(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const timeRef = useRef(0);
    const [webGLSupported, setWebGLSupported] = useState(true);

    // Check WebGL support
    useEffect(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            setTimeout(() => setWebGLSupported(false), 0);
            console.warn('WebGL is not supported in this browser');
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current || !webGLSupported) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        cameraRef.current = camera;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance',
                precision: 'lowp',
                stencil: false,
                depth: false
            });
        } catch (error) {
            console.error('Failed to create WebGL renderer:', error);
            setTimeout(() => setWebGLSupported(false), 0);
            return;
        }

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Convert hex colors to RGB
        const parseColor = (hex: string) => {
            const color = new THREE.Color(hex);
            return new THREE.Vector3(color.r, color.g, color.b);
        };

        // Shader material
        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uPillarRotation;
      varying vec2 vUv;

      const float PI = 3.141592653589793;
      const float EPSILON = 0.01;
      const float E = 2.71828182845904523536;
      const float HALF = 0.5;

      mat2 rot(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      // Procedural noise function
      float noise(vec2 coord) {
        return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
      }

      // Apply layered wave deformation to position
      vec3 applyWaveDeformation(vec3 pos, float timeOffset) {
        float frequency = 1.0;
        float amplitude = 1.0;
        vec3 deformed = pos;
        
        for(float i = 0.0; i < 3.0; i++) {
          deformed.xz *= rot(0.4 + timeOffset * 0.05);
          float phase = timeOffset * (i + 1.0);
          vec3 oscillation = cos(deformed.zxy * frequency - phase);
          deformed += oscillation * amplitude;
          frequency *= 1.8;
          amplitude *= 0.5;
        }
        return deformed;
      }

      // Polynomial smooth blending
      float blendMax(float a, float b, float k) {
        float h = max(k - abs(a - b), 0.0);
        return max(a, b) + h * h * 0.25 / k;
      }

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0);
        uv.x *= uResolution.x / uResolution.y;
        
        float rotAngle = uPillarRotation * PI / 180.0;
        uv *= rot(rotAngle);

        vec3 origin = vec3(0.0, 0.0, -8.0);
        vec3 direction = normalize(vec3(uv, 1.5));

        float maxDepth = 30.0;
        float depth = 0.1;

        // Ensure rotation is ALWAYS influenced by time
        float timeRot = uTime * 0.4;
        float mouseRot = uInteractive ? uMouse.x * PI : 0.0;
        mat2 rotX = rot(timeRot + mouseRot);

        vec3 color = vec3(0.0);
        
        // Reduced iterations for performance (50 instead of 100)
        for(int i = 0; i < 50; i++) {
          vec3 pos = origin + direction * depth;
          pos.xz *= rotX;

          vec3 deformed = pos;
          deformed.y *= uPillarHeight;
          deformed = applyWaveDeformation(deformed + vec3(0.0, uTime * 0.5, 0.0), uTime);
          
          vec2 cosinePair = cos(deformed.xz);
          float fieldDistance = length(cosinePair) - 0.25;
          
          float radialBound = length(pos.xz) - uPillarWidth;
          fieldDistance = blendMax(radialBound, fieldDistance, 0.8);
          fieldDistance = abs(fieldDistance) * 0.2 + 0.02;

          vec3 gradient = mix(uBottomColor, uTopColor, smoothstep(12.0, -12.0, pos.y));
          color += gradient * (1.0 / (fieldDistance * 60.0));

          if(fieldDistance < EPSILON || depth > maxDepth) break;
          depth += fieldDistance * 1.5;
        }

        color = color * uGlowAmount * 20.0;
        color = 1.0 - exp(-color); // Exposure mapping for smoother highlights
        
        float rnd = noise(gl_FragCoord.xy + uTime);
        color -= rnd * 0.03 * uNoiseIntensity;
        
        gl_FragColor = vec4(color * uIntensity, 1.0);
      }
    `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: mouseRef.current },
                uTopColor: { value: parseColor(topColor) },
                uBottomColor: { value: parseColor(bottomColor) },
                uIntensity: { value: intensity },
                uInteractive: { value: interactive },
                uGlowAmount: { value: glowAmount },
                uPillarWidth: { value: pillarWidth },
                uPillarHeight: { value: pillarHeight },
                uNoiseIntensity: { value: noiseIntensity },
                uPillarRotation: { value: pillarRotation }
            },
            transparent: true,
            depthWrite: false,
            depthTest: false
        });
        materialRef.current = material;

        const geometry = new THREE.PlaneGeometry(2, 2);
        geometryRef.current = geometry;
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Mouse interaction - throttled for performance
        let mouseMoveTimeout: number | null = null;
        const handleMouseMove = (event: MouseEvent) => {
            if (!interactive) return;

            if (mouseMoveTimeout) return;

            mouseMoveTimeout = window.setTimeout(() => {
                mouseMoveTimeout = null;
            }, 16); // ~60fps throttle

            const rect = container.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            mouseRef.current.set(x, y);
        };

        if (interactive) {
            container.addEventListener('mousemove', handleMouseMove, { passive: true });
        }

        // Animation loop with fixed timestep
        let lastTime = performance.now();
        const targetFPS = 60;
        const frameTime = 1000 / targetFPS;

        const animate = (currentTime: number) => {
            if (!materialRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

            const deltaTime = currentTime - lastTime;

            if (deltaTime >= frameTime) {
                timeRef.current += 0.016 * rotationSpeed;
                materialRef.current.uniforms.uTime.value = timeRef.current;
                rendererRef.current.render(sceneRef.current, cameraRef.current);
                lastTime = currentTime - (deltaTime % frameTime);
            }

            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        // Handle resize with debouncing
        let resizeTimeout: number | null = null;
        const handleResize = () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            resizeTimeout = window.setTimeout(() => {
                if (!rendererRef.current || !materialRef.current || !containerRef.current) return;
                const newWidth = containerRef.current.clientWidth;
                const newHeight = containerRef.current.clientHeight;
                rendererRef.current.setSize(newWidth, newHeight);
                materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeout) clearTimeout(resizeTimeout);
            if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);

            if (interactive) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                if (container.contains(rendererRef.current.domElement)) {
                    container.removeChild(rendererRef.current.domElement);
                }
            }
            if (materialRef.current) {
                materialRef.current.dispose();
            }
            if (geometryRef.current) {
                geometryRef.current.dispose();
            }

            (rendererRef as React.MutableRefObject<THREE.WebGLRenderer | null>).current = null;
            (materialRef as React.MutableRefObject<THREE.ShaderMaterial | null>).current = null;
            (sceneRef as React.MutableRefObject<THREE.Scene | null>).current = null;
            (cameraRef as React.MutableRefObject<THREE.OrthographicCamera | null>).current = null;
            (geometryRef as React.MutableRefObject<THREE.PlaneGeometry | null>).current = null;
            (rafRef as React.MutableRefObject<number | null>).current = null;
        };
    }, [
        topColor,
        bottomColor,
        intensity,
        rotationSpeed,
        interactive,
        glowAmount,
        pillarWidth,
        pillarHeight,
        noiseIntensity,
        pillarRotation,
        webGLSupported
    ]);

    if (!webGLSupported) {
        return (
            <div className={`light-pillar-fallback ${className}`} style={{ mixBlendMode }}>
                WebGL not supported
            </div>
        );
    }

    return <div ref={containerRef} className={`light-pillar-container ${className}`} style={{ mixBlendMode }} />;
};

export default LightPillar;
