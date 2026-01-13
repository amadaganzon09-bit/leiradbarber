"use client";

import AuthForm from "@/components/AuthForm";
import LightPillar from "@/components/ui/LightPillar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center md:p-6 bg-[#050505] overflow-hidden">
            <div className="absolute inset-0 z-0 hidden md:block">
                <LightPillar
                    topColor="#5227FF"
                    bottomColor="#FF9FFC"
                    intensity={1.0}
                    rotationSpeed={0.3}
                    glowAmount={0.005}
                    pillarWidth={3.0}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={0}
                    interactive={false}
                    mixBlendMode="normal"
                />
            </div>


            <div className="relative z-10 w-full flex justify-center">
                <AuthForm type="login" />
            </div>
        </main>
    );
}
