"use client";

import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Resize handler
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Noise generation
        const noiseData: ImageData[] = [];
        const frames = 10;

        for (let i = 0; i < frames; i++) {
            const idata = ctx.createImageData(width, height);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;

            for (let j = 0; j < len; j++) {
                if (Math.random() < 0.05) { // 5% chance of white pixel
                    // Little varied opacity
                    const alpha = Math.random() * 50;
                    buffer32[j] = (alpha << 24) | (255 << 16) | (255 << 8) | 255; // White with low alpha
                }
            }
            noiseData.push(idata);
        }

        // Animation Loop
        let frame = 0;
        let loopId = 0;

        const loop = () => {
            // Clear
            ctx.clearRect(0, 0, width, height);

            // Draw noise
            ctx.putImageData(noiseData[frame], 0, 0);

            // Cycle frames
            frame = (frame + 1) % frames;

            // Slow down the animation slightly
            // setTimeout(() => {
            loopId = requestAnimationFrame(loop);
            // }, 50);
        };

        loop();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(loopId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-20 mix-blend-overlay"
        />
    );
}
