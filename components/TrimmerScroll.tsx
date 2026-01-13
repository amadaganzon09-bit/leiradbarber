"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useScroll, useTransform, useMotionValueEvent, motion, MotionValue } from "framer-motion";
import clsx from "clsx";
import TextReveal from "./ui/TextReveal";
import MagneticButton from "./ui/MagneticButton";
import { useLoading } from "@/context/LoadingContext";

const FRAME_COUNT = 40;
const SCROLL_HEIGHT = "400vh";

export default function TrimmerScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const { setProgress: setGlobalProgress, isLoading: isGlobalLoading } = useLoading();
    // keeping local loading state just for internal canvas logic if needed, but not for UI
    const [internalLoading, setInternalLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Scroll logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll (0-1) to frame index (0-39)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = images[index];

        if (!canvas || !ctx || !img) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 4);
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, rect.width, rect.height);

        const scale = Math.max(rect.width / img.width, rect.height / img.height) * 1.1;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (rect.width - w) / 2;
        const y = (rect.height - h) / 2;

        ctx.drawImage(img, x, y, w, h);
    }, [images]);

    // Preload Images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    const p = (i + 1).toString().padStart(3, "0");
                    const src = `/images/trimmer/ezgif-frame-${p}.png?v=2`;
                    img.src = src;

                    img.onload = () => {
                        loadedImages[i] = img;
                        loadedCount++;
                        setGlobalProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve();
                    };

                    img.onerror = () => {
                        console.error(`Failed to load frame ${i + 1} at ${src}`);
                        if (i > 0 && loadedImages[i - 1]) {
                            loadedImages[i] = loadedImages[i - 1];
                        }
                        loadedCount++;
                        setGlobalProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            for (let i = 0; i < FRAME_COUNT; i++) {
                if (!loadedImages[i] && i > 0) {
                    loadedImages[i] = loadedImages[i - 1];
                }
            }

            setImages(loadedImages);
            setInternalLoading(false);
        };

        loadImages();
    }, [setGlobalProgress]);

    // Update canvas on scroll
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const index = Math.round(latest);
        requestAnimationFrame(() => drawFrame(index));
        setScrollProgress(latest / (FRAME_COUNT - 1));
    });

    useEffect(() => {
        if (!internalLoading && images.length > 0) {
            drawFrame(0);
        }
    }, [internalLoading, images, drawFrame]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (!internalLoading && images.length > 0) {
                drawFrame(Math.round(frameIndex.get()));
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [internalLoading, images, frameIndex, drawFrame]);

    return (
        <div id="home" ref={containerRef} className="relative w-full bg-[#050505]" style={{ height: SCROLL_HEIGHT }}>
            {/* Sticky Canvas */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full max-w-[100vw] max-h-[100vh]" />

                {/* Overlays */}
                <OverlaySection opacity={useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0])}>
                    <TextReveal className="text-5xl md:text-8xl font-bold tracking-tighter text-white/90 mb-4 justify-center">Leirad Grooming.</TextReveal>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-white/60 tracking-wider font-light uppercase"
                    >
                        Where Style Meets Tradition.
                    </motion.p>
                </OverlaySection>

                <OverlaySection opacity={useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0])} className="items-start md:pl-32">
                    <TextReveal className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-2">Master Barbers.</TextReveal>
                    <p className="text-base text-white/50 max-w-md">Expert stylists dedicated to perfecting your look with precision and care.</p>
                </OverlaySection>

                <OverlaySection opacity={useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [0, 1, 1, 0])} className="items-end md:pr-32 text-right">
                    <TextReveal className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-2 justify-end">Premium Experience.</TextReveal>
                    <p className="text-base text-white/50 max-w-md ml-auto">Relax in our luxury lounge with complimentary beverages and hot towel treatments.</p>
                </OverlaySection>

                <OverlaySection opacity={useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1])}>
                    <TextReveal className="text-5xl md:text-7xl font-bold tracking-tighter text-white/90 mb-6 justify-center">Define Your Legacy.</TextReveal>
                    <Link href="/login">
                        <MagneticButton className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all">
                            Book Appointment
                        </MagneticButton>
                    </Link>
                </OverlaySection>

                {/* Optional Progress Indicator */}
                <motion.div style={{ scaleX: scrollYProgress }} className="fixed bottom-0 left-0 right-0 h-1 bg-white/20 origin-left z-50 pointer-events-none" />
            </div>
        </div>
    );
}

function OverlaySection({ children, opacity, className }: { children: React.ReactNode, opacity: MotionValue<number>, className?: string }) {
    return (
        <motion.div
            style={{ opacity }}
            className={clsx("absolute inset-0 flex flex-col justify-center px-6 pointer-events-none", className || "items-center text-center")}
        >
            <div className="pointer-events-auto">
                {children}
            </div>
        </motion.div>
    )
}
