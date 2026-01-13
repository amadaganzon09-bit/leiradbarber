"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

const galleryImages = [
    "/images/services/1.png",
    "/images/services/2.png",
    "/images/services/3.png",
    "/images/services/4.png",
    "/images/services/1.png",
    "/images/services/2.png",
    "/images/services/3.png",
    "/images/services/4.png",
];

export default function Gallery() {
    const targetRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);

    useEffect(() => {
        const calculateRange = () => {
            if (scrollRef.current) {
                setScrollRange(scrollRef.current.scrollWidth);
            }
            setViewportWidth(window.innerWidth);
        };

        calculateRange();
        window.addEventListener("resize", calculateRange);
        return () => window.removeEventListener("resize", calculateRange);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // We calculate the exact translation needed to show the last image
    // It's basically -(TotalWidth - ViewportWidth)
    const xTranslation = -(scrollRange - viewportWidth + 64); // Added a small buffer for padding

    // We use a spring for smoother motion across all devices
    const xSpring = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, xTranslation < 0 ? xTranslation : 0]),
        { stiffness: 100, damping: 20, restDelta: 0.001 }
    );

    return (
        <section ref={targetRef} className="relative h-[500vh] bg-[#050505]">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
                <div className="container mx-auto px-4 mb-2 md:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left"
                    >
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-2 uppercase flex items-center gap-4">
                            Our <span className="text-[#D4AF37]">Work</span>
                            <div className="hidden md:block h-[2px] w-32 bg-white/10" />
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="text-white/40 uppercase tracking-widest text-[10px] md:text-xs">Scroll down to view portfolio</p>
                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-[#D4AF37]"
                            >
                                &rarr;
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* The Horizontal Container */}
                <motion.div
                    ref={scrollRef}
                    style={{ x: xSpring }}
                    className="flex gap-4 md:gap-8 px-4 md:px-[5%]"
                >
                    {galleryImages.map((src, index) => (
                        <GalleryItem key={index} src={src} index={index} />
                    ))}
                </motion.div>

                {/* Modern Progress Tracking */}
                <div className="absolute bottom-8 left-4 right-4 md:left-24 md:right-24 h-[1px] bg-white/5">
                    <motion.div
                        style={{ scaleX: scrollYProgress }}
                        className="h-full bg-[#D4AF37] origin-left shadow-[0_0_10px_#D4AF37]"
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-white/20 uppercase font-medium">Start</span>
                        <span className="text-[10px] text-white/20 uppercase font-medium">Discovery</span>
                        <span className="text-[10px] text-white/20 uppercase font-medium">End</span>
                    </div>
                </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </section>
    );
}

function GalleryItem({ src, index }: { src: string; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative h-[55vh] md:h-[60vh] min-h-[350px] w-[280px] sm:w-[350px] md:w-[550px] flex-shrink-0 group overflow-hidden rounded-lg border border-white/5"
        >
            <Image
                src={src}
                alt={`Work ${index + 1}`}
                fill
                priority={index < 3}
                className="object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />

            {/* Ambient Lighting on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-transparent transition-all duration-500" />

            {/* Information Reveal */}
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <div className="overflow-hidden">
                    <motion.div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[#D4AF37] font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 block">Premium Grooming</span>
                        <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4">
                            Signature<br />Style 0{index + 1}
                        </h3>
                        <div className="flex gap-2">
                            <div className="h-1 w-8 bg-[#D4AF37]" />
                            <div className="h-1 w-2 bg-white/20" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Index */}
            <div className="absolute top-6 left-6 flex items-baseline gap-1">
                <span className="text-[#D4AF37] text-xs font-bold">/</span>
                <span className="text-white/30 text-xl font-black group-hover:text-white transition-colors">0{index + 1}</span>
            </div>
        </motion.div>
    );
}
