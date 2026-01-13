"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    const socialLinks = [
        {
            icon: Facebook,
            href: "#",
            label: "Facebook",
            hoverColor: "#1877F2", // Facebook Brand Color
            bgHover: "rgba(24, 119, 242, 0.1)"
        },
        {
            icon: Instagram,
            href: "#",
            label: "Instagram",
            hoverColor: "#E4405F", // Instagram Brand Color
            bgHover: "rgba(228, 64, 95, 0.1)"
        },
        {
            icon: Twitter,
            href: "#",
            label: "X (Twitter)",
            hoverColor: "#1DA1F2", // Twitter Brand Color
            bgHover: "rgba(29, 161, 242, 0.1)"
        },
        {
            icon: Youtube,
            href: "#",
            label: "Youtube",
            hoverColor: "#FF0000", // Youtube Brand Color
            bgHover: "rgba(255, 0, 0, 0.1)"
        },
    ];

    return (
        <footer className="bg-[#050505] text-white/60 py-16 border-t border-white/5 font-light">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-white tracking-tighter mb-6 block">
                            LEIRAD
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed mb-8">
                            Precision grooming for the modern gentleman.
                            Elevating the art of barbering with style and substance.
                        </p>

                        {/* Social Icons with Brand Colors on Hover */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    initial={{ color: "rgba(255,255,255,0.4)" }}
                                    whileHover={{
                                        y: -5,
                                        color: social.hoverColor,
                                        backgroundColor: social.bgHover,
                                        borderColor: social.hoverColor + "40" // Adding 40 for 25% opacity
                                    }}
                                    className="p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon size={22} strokeWidth={1.5} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                            <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li>123 Grooming Blvd, Suite 101<br />New York, NY 10012</li>
                            <li>+1 (555) 123-4567</li>
                            <li>bookings@leirad.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
                    <p>© 2026 Leirad Grooming Co. All rights reserved.</p>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
