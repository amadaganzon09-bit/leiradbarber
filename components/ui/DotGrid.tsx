'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';

// Fix for ResizeObserver typing in environments where it might be missing from base types
interface ResizeObserver {
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
}
import './DotGrid.css';

interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseColor?: string;
    activeColor?: string;
    proximity?: number;
    shockRadius?: number;
    shockStrength?: number;
    returnDuration?: number;
    className?: string;
    style?: React.CSSProperties;
}

interface Dot {
    cx: number;
    cy: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    targetSize: number;
    color: string;
}

function hexToRgb(hex: string) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
}

const DotGrid = ({
    dotSize = 6,
    gap = 24,
    baseColor = 'rgba(82, 39, 255, 0.2)',
    activeColor = '#5227FF',
    proximity = 120,
    shockRadius = 250,
    shockStrength = 10,
    className = '',
    style
}: DotGridProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const pointerRef = useRef({
        x: -2000,
        y: -2000,
        vx: 0,
        vy: 0
    });

    const baseRgb = useMemo(() => hexToRgb(baseColor.includes('rgba') ? '#5227FF' : baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        const cols = Math.floor((width + gap) / (dotSize + gap));
        const rows = Math.floor((height + gap) / (dotSize + gap));
        const cell = dotSize + gap;

        const startX = (width - (cols - 1) * cell) / 2;
        const startY = (height - (rows - 1) * cell) / 2;

        const dots: Dot[] = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cx = startX + j * cell;
                const cy = startY + i * cell;
                dots.push({
                    cx,
                    cy,
                    x: cx,
                    y: cy,
                    vx: 0,
                    vy: 0,
                    size: dotSize,
                    targetSize: dotSize,
                    color: baseColor
                });
            }
        }
        dotsRef.current = dots;
    }, [dotSize, gap, baseColor]);

    useEffect(() => {
        let rafId: number;
        const spring = 0.12;
        const friction = 0.8;
        const mouseForce = 0.22;

        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: px, y: py, vx: mvx, vy: mvy } = pointerRef.current;

            // Gradually decay pointer velocity so it doesn't get stuck
            pointerRef.current.vx *= 0.9;
            pointerRef.current.vy *= 0.9;

            for (const dot of dotsRef.current) {
                const dx = dot.x - px;
                const dy = dot.y - py;
                const distSq = dx * dx + dy * dy;
                const proxSq = proximity * proximity;

                if (distSq < proxSq) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / proximity) * mouseForce;
                    const angle = Math.atan2(dy, dx);

                    // Repulsion
                    dot.vx += Math.cos(angle) * force * 25;
                    dot.vy += Math.sin(angle) * force * 25;

                    // Liquid Vortex effect
                    const speed = Math.sqrt(mvx * mvx + mvy * mvy);
                    if (speed > 1) {
                        const tangAngle = angle + Math.PI / 2;
                        const vortex = force * speed * 0.1;
                        dot.vx += Math.cos(tangAngle) * vortex;
                        dot.vy += Math.sin(tangAngle) * vortex;
                    }

                    dot.targetSize = dotSize * (1 + force * 3);
                } else {
                    dot.targetSize = dotSize;
                }

                // Spring Physics
                const ax = (dot.cx - dot.x) * spring;
                const ay = (dot.cy - dot.y) * spring;

                dot.vx += ax;
                dot.vy += ay;
                dot.vx *= friction;
                dot.vy *= friction;

                dot.x += dot.vx;
                dot.y += dot.vy;

                // Size Lerp
                dot.size += (dot.targetSize - dot.size) * 0.15;

                // Visual Rendering
                const displacement = Math.sqrt(Math.pow(dot.x - dot.cx, 2) + Math.pow(dot.y - dot.cy, 2));
                const colorFactor = Math.min(1, displacement / 20);

                const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * colorFactor);
                const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * colorFactor);
                const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * colorFactor);
                const alpha = 0.3 + colorFactor * 0.7;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                if (colorFactor > 0.4) {
                    ctx.shadowBlur = 12 * colorFactor;
                    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                ctx.shadowBlur = 0; // Reset for next dot
            }

            rafId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafId);
    }, [proximity, dotSize, baseRgb, activeRgb]);

    useEffect(() => {
        buildGrid();
        let ro: ResizeObserver | null = null;
        if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
            ro = new (window as any).ResizeObserver(() => {
                buildGrid();
            });
            if (wrapperRef.current && ro) {
                ro.observe(wrapperRef.current);
            }
        } else {
            (window as any).addEventListener('resize', buildGrid);
        }
        return () => {
            if (ro) ro.disconnect();
            else (window as any).removeEventListener('resize', buildGrid);
        };
    }, [buildGrid]);

    useEffect(() => {
        let firstMove = true;
        const onMove = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();

            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;

            // Only update velocity if it's not the first move to avoid spikes from initialization
            if (!firstMove) {
                pointerRef.current.vx = newX - pointerRef.current.x;
                pointerRef.current.vy = newY - pointerRef.current.y;
            } else {
                pointerRef.current.vx = 0;
                pointerRef.current.vy = 0;
                firstMove = false;
            }

            pointerRef.current.x = newX;
            pointerRef.current.y = newY;
        };

        const onClick = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();

            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            // Only trigger click if it's actually within the canvas hits
            if (cx < 0 || cx > rect.width || cy < 0 || cy > rect.height) return;

            for (const dot of dotsRef.current) {
                const dx = dot.x - cx;
                const dy = dot.y - cy;
                const dSq = dx * dx + dy * dy;

                if (dSq < shockRadius * shockRadius) {
                    const dist = Math.sqrt(dSq);
                    const force = (1 - dist / shockRadius) * shockStrength;
                    const angle = Math.atan2(dy, dx);
                    dot.vx += Math.cos(angle) * force * 8;
                    dot.vy += Math.sin(angle) * force * 8;
                }
            }
        };

        const onLeave = () => {
            pointerRef.current.x = -2000;
            pointerRef.current.y = -2000;
            pointerRef.current.vx = 0;
            pointerRef.current.vy = 0;
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mousedown', onClick);
        window.addEventListener('mouseleave', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onClick);
            window.removeEventListener('mouseleave', onLeave);
        };
    }, [shockRadius, shockStrength]);

    return (
        <div className={`dot-grid ${className}`} style={{ ...style, cursor: 'default' }} ref={wrapperRef}>
            <div className="dot-grid__wrap overflow-hidden">
                <canvas ref={canvasRef} className="dot-grid__canvas" style={{ pointerEvents: 'none' }} />
            </div>
        </div>
    );
};

export default DotGrid;
