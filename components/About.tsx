"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
    return (
        <section id="about" className="py-24 md:py-40 bg-[#050505] text-white relative overflow-hidden">
            {/* Background Decorative Text - Redesigned for Editorial Look */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-[25vw] font-black text-white/[0.03] leading-none tracking-tighter"
                >
                    LEIRAD
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, margin: "-100px" }}
                >
                    <h2 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter leading-[0.9]">
                        More Than Just A <br />
                        <span className="text-white/30 italic font-serif">Haircut.</span>
                    </h2>
                    <div className="space-y-8 text-white/60 leading-relaxed font-light text-lg max-w-xl">
                        <p>
                            Established in 2026, Leirad Grooming was founded on the belief that a man's character is reflected in his attention to detail. We blend <span className="text-white">old-world barbering traditions</span> with modern styling techniques to create a look that is uniquely yours.
                        </p>
                        <p>
                            Our master barbers are artists, trained in the geometry of hair and the anatomy of the face. Whether it's a classic taper or a modern texturized crop, we execute every cut with <span className="text-white tracking-widest uppercase text-sm font-bold">surgical precision</span>.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="border-l border-white/10 pl-6"
                        >
                            <h4 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3 font-bold">Location</h4>
                            <p className="text-white/80 font-medium leading-relaxed">
                                123 Grooming Blvd, Suite 101<br />
                                New York, NY 10012
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="border-l border-white/10 pl-6"
                        >
                            <h4 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3 font-bold">Hours</h4>
                            <p className="text-white/80 font-medium leading-relaxed">
                                Mon - Sat: 10am - 8pm<br />
                                Sun: <span className="text-red-500/50">Closed</span>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative group mt-10 lg:mt-0 hidden lg:block"
                >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                        {/* Luxury Frame Overlay */}
                        <div className="absolute inset-0 z-10 border-[10px] border-black/20 pointer-events-none" />

                        <motion.div
                            initial={{ scale: 1.2 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <Image
                                src="/images/gallery/tools.png"
                                alt="Leirad Barbershop Tools"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </motion.div>

                        {/* Elegant Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent mix-blend-overlay pointer-events-none" />
                    </div>

                    {/* Decorative Element Behind Photo */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/[0.02] blur-3xl -z-10 rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}
