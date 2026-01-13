"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import Image from "next/image";

export default function LoadingScreen() {
    const { progress, isLoading, setIsLoading } = useLoading();
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [visualProgress, setVisualProgress] = useState(0);
    const [displayValue, setDisplayValue] = useState(0);

    // Visual Progress Controller: Ensures smooth 0-100% flow
    useEffect(() => {
        const interval = setInterval(() => {
            setVisualProgress((prev) => {
                if (prev >= 100) return 100;

                // Baseline increment: 1 unit every 30ms (approx 3 seconds for 100%)
                const next = prev + 1;

                // Sync with real progress (if available from TrimmerScroll)
                return Math.max(next, progress);
            });
        }, 30);

        return () => clearInterval(interval);
    }, [progress]);

    // Sync Motion Value for smooth counter animation
    useEffect(() => {
        const controls = animate(count, visualProgress, {
            duration: 0.6,
            ease: "easeOut"
        });
        return controls.stop;
    }, [visualProgress, count]);

    // Update displayValue for the UI text
    useEffect(() => {
        return rounded.on("change", (v) => setDisplayValue(v));
    }, [rounded]);

    // Cleanup and exit splash screen once complete
    useEffect(() => {
        if (visualProgress === 100) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1200); // Premium pause at 100%
            return () => clearTimeout(timer);
        }
    }, [visualProgress, setIsLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
                >
                    {/* Minimalist Background Atmosphere */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000000_100%)] opacity-80" />
                    </div>

                    <div className="relative z-10 w-full h-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src="/images/gif/splash_screen.gif"
                                alt="Leirad Loading"
                                fill
                                className="object-cover scale-[1.3] md:scale-[1.15] origin-center translate-y-[-3%] md:translate-y-[-4%]"
                                priority
                                unoptimized
                            />
                        </motion.div>

                        {/* Subtle Progress Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="absolute bottom-16 md:bottom-12 left-0 right-0 z-20 flex flex-col items-center"
                        >
                            <span className="text-[9px] md:text-[12px] tabular-nums font-bold text-white tracking-[0.3em] md:tracking-[0.4em] uppercase drop-shadow-lg">
                                Loading Experience {displayValue}%
                            </span>
                        </motion.div>

                        {/* Luxury Vignette Overlay - Adaptive for mobile */}
                        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_50%,#000000_100%)] md:bg-[radial-gradient(circle,transparent_40%,#000000_100%)] opacity-70 md:opacity-60 pointer-events-none" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
