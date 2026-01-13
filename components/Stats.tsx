"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import DotGrid from "./ui/DotGrid";

const stats = [
    { label: "Happy Clients", value: 12500, suffix: "+" },
    { label: "Master Barbers", value: 12, suffix: "" },
    { label: "Years of Excellence", value: 15, suffix: "+" },
    { label: "Awards Won", value: 24, suffix: "" },
];

export default function Stats() {
    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40">
                <DotGrid
                    dotSize={6}
                    gap={24}
                    baseColor="rgba(82, 39, 255, 0.2)"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    returnDuration={1.5}
                />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none z-[1]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {stats.map((stat, index) => (
                        <StatItem key={index} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = stat.value;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, stat.value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
        >
            <div className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter tabular-nums">
                {count.toLocaleString()}{stat.suffix}
            </div>
            <div className="text-sm md:text-base text-white/40 uppercase tracking-[0.2em] font-medium">
                {stat.label}
            </div>
            <div className="w-8 h-[1px] bg-white/10 mt-6" />
        </motion.div>
    );
}
