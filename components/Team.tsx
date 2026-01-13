"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

const team = [
    {
        name: "Leirad Noznag",
        role: "Founder & Master Barber",
        image: "/images/services/2.png",
        bio: "Master of the heritage cut. Leirad's vision defined the precision grooming standard that Leirad is known for today.",
    },
    {
        name: "Marcus Chen",
        role: "Senior Stylist",
        image: "/images/services/1.png",
        bio: "The engineer of the modern fade. Marcus combines geometric precision with artistic flair for every client.",
    },
    {
        name: "Julian Rossi",
        role: "Fade Expert",
        image: "/images/services/4.png",
        bio: "Italian-trained and internationally recognized. Julian brings a touch of classic European elegance to the chair.",
    },
    {
        name: "Elias Thorne",
        role: "Classic Cut Specialist",
        image: "/images/services/3.png",
        bio: "A traditionalist at heart. Elias focuses on the timeless silhouettes that have defined gentlemen for centuries.",
    },
];

export default function Team() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Spring for smooth, inertia-based scrolling
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={sectionRef} className="relative h-[500vh] bg-[#050505] overflow-clip">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Clean Background Text */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-[0.03] pointer-events-none select-none">
                    <motion.h2
                        style={{ x: useTransform(smoothProgress, [0, 1], ["10%", "-10%"]) }}
                        className="text-[25vw] font-black text-white italic whitespace-nowrap"
                    >
                        THE CRAFTSMEN
                    </motion.h2>
                </div>

                {/* Progress Tracking Bar - Minimalist */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/10 z-50">
                    <motion.div
                        style={{ scaleX: smoothProgress }}
                        className="h-full bg-[#D4AF37] origin-left"
                    />
                </div>

                {/* The Individual Slides */}
                <div className="relative w-full h-full">
                    {team.map((member, index) => (
                        <TeamSlide
                            key={index}
                            member={member}
                            index={index}
                            total={team.length}
                            progress={smoothProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamSlide({ member, index, total, progress }: { member: any, index: number, total: number, progress: any }) {
    // Precise scroll window for this member
    const start = index / total;
    const end = (index + 1) / total;

    // Visibility and Layering
    // We use a clean fade and scale-up reveal to avoid 'combining' overlaps
    const opacity = useTransform(progress, [start - 0.1, start, end - 0.05, end], [0, 1, 1, 0]);
    const scale = useTransform(progress, [start - 0.1, start, end], [0.95, 1, 1.05]);

    // Translation to keep them separate
    const x = useTransform(progress, [start - 0.1, start, end, end + 0.1], ["20%", "0%", "0%", "-20%"]);

    return (
        <motion.div
            style={{ opacity, scale, x, pointerEvents: index === 0 ? "auto" : "none" }}
            className="absolute inset-0 w-full h-full flex items-center justify-center z-10"
        >
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-24">

                {/* Member Image - Clean Reveal */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <div className="relative w-[85%] aspect-[3/4] md:w-[450px] overflow-hidden rounded-sm group">
                        <motion.div
                            style={{
                                scale: useTransform(progress, [start, end], [1.1, 1]),
                                filter: "grayscale(100%)"
                            }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Elegant Border Frame */}
                        <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none" />

                        {/* Index Indicator */}
                        <div className="absolute top-8 left-8 text-white/20 font-black text-6xl italic leading-none">
                            0{index + 1}
                        </div>
                    </div>
                </div>

                {/* Member Text - Clean & Isolated */}
                <div className="w-full md:w-1/2 text-left space-y-6">
                    <div className="space-y-2">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase block"
                        >
                            Elite Artist
                        </motion.span>
                        <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                            {member.name}
                        </h3>
                        <p className="text-[#D4AF37] text-sm md:text-lg font-medium italic opacity-80">
                            {member.role}
                        </p>
                    </div>

                    <div className="w-16 h-px bg-white/20" />

                    <p className="text-white/40 text-lg font-light leading-relaxed max-w-sm">
                        {member.bio}
                    </p>

                    <div className="pt-8 flex items-center gap-6">
                        <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Booking Essential</span>
                        <div className="h-[1px] w-12 bg-[#D4AF37]/50" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
