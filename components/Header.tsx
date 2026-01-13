"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MagneticButton from "./ui/MagneticButton";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled
                ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5"
                : "bg-transparent"
                }`}
        >
            <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                    LEIRAD
                </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
                {["Home", "Services", "Gallery", "About"].map((item) => (
                    <Link
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <MagneticButton className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors">
                        Book Now
                    </MagneticButton>
                </Link>
            </div>
        </motion.header>
    );
}
