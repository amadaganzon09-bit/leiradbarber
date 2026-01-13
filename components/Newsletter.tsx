"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./ui/MagneticButton";
import { useToast } from "./ui/Toast";
import { clsx } from "clsx";
import DarkVeil from "./ui/DarkVeil";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const { showToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setStatus("error");
            showToast("Please enter your email address.", "error");
            // Reset error status after animation finishes
            setTimeout(() => setStatus("idle"), 500);
            return;
        }

        // Simple basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus("error");
            showToast("Please enter a valid email address.", "error");
            setTimeout(() => setStatus("idle"), 500);
            return;
        }

        // Simulate API call
        // Here we'd usually have an setIsProcessing(true)
        setTimeout(() => {
            setStatus("success");
            showToast("Welcome to the inner circle! Check your inbox.", "success");
            setEmail("");
        }, 1000);
    };

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 opacity-40">
                <DarkVeil
                    hueShift={280}
                    speed={0.2}
                    noiseIntensity={0.05}
                    scanlineIntensity={0.1}
                    scanlineFrequency={2.0}
                    warpAmount={0.3}
                />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter"
                    >
                        Join the Inner Circle.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="text-lg text-white/50 mb-12 font-light"
                    >
                        Unlock exclusive offers, expert grooming tips, and priority booking access delivered straight to your inbox.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: false, margin: "-100px" }}
                        onSubmit={handleSubmit}
                        className="relative max-w-md mx-auto"
                        noValidate
                    >
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success-msg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white/10 text-white px-6 py-4 rounded-full border border-white/20 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium">Welcome to the club.</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="input-field"
                                    initial={{ opacity: 0 }}
                                    animate={status === "error" ? {
                                        x: [0, -4, 4, -4, 4, 0],
                                        opacity: 1
                                    } : { opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative"
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === "error") setStatus("idle");
                                        }}
                                        className={clsx(
                                            "w-full bg-white/5 border rounded-full py-4 pl-6 pr-40 text-white placeholder:text-white/30 focus:outline-none transition-all duration-300",
                                            status === "error" ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-white/30"
                                        )}
                                    />
                                    <div className="absolute right-2 top-2 bottom-2">
                                        <MagneticButton className="h-full px-6 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors">
                                            Subscribe
                                        </MagneticButton>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
