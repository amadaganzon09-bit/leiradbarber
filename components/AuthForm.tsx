"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import MagneticButton from "./ui/MagneticButton";
import { useToast } from "./ui/Toast";
import { clsx } from "clsx";

interface AuthFormProps {
    type: "login" | "register" | "forgot-password";
}

const fieldVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0]
        }
    }),
    error: {
        x: [0, -4, 4, -4, 4, 0],
        opacity: 1,
        transition: { duration: 0.4 }
    }
};

export default function AuthForm({ type }: AuthFormProps) {
    const isLogin = type === "login";
    const isRegister = type === "register";
    const isForgotPassword = type === "forgot-password";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0); // 0-3
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const { showToast } = useToast();

    // Professional Password Strength Logic
    const getRequirements = (pass: string) => [
        { label: "8+ characters", met: pass.length >= 8 },
        { label: "Uppercase letter", met: /[A-Z]/.test(pass) },
        { label: "Number (0-9)", met: /[0-9]/.test(pass) },
        { label: "Special character", met: /[^A-Za-z0-9]/.test(pass) },
    ];

    const getStrength = (pass: string) => {
        if (pass.length === 0) return 0;
        const requirements = getRequirements(pass);
        const metCount = requirements.filter(r => r.met).length;

        if (metCount <= 1) return 1; // Weak
        if (metCount === 2) return 2; // Fair
        if (metCount === 3) return 3; // Good
        return 4; // Strong
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        setPasswordStrength(getStrength(val));
    };

    const strengthConfig = [
        { label: "Initial", color: "bg-white/10", glow: "shadow-none" },
        { label: "Weak", color: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]" },
        { label: "Fair", color: "bg-orange-500", glow: "shadow-[0_0_10px_rgba(249,115,22,0.5)]" },
        { label: "Good", color: "bg-blue-500", glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
        { label: "Strong", color: "bg-green-500", glow: "shadow-[0_0_10px_rgba(34,197,94,0.5)]" },
    ];

    const router = useRouter();
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Handle Registration Submission
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        showToast("Registration successful! An OTP has been sent to your email.", "success");
        setIsVerifyingOTP(true);
    };

    // Handle OTP Input Change
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1); // Only allow one char
        if (!/^\d*$/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to next input
        if (value !== "" && index < 5) {
            otpInputRefs[index + 1].current?.focus();
        }
    };

    // Handle OTP Backspace
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        }
    };

    // Unified Validation Logic
    const validateFields = (formData: FormData) => {
        const newErrors: Record<string, boolean> = {};
        let isValid = true;

        formData.forEach((value, key) => {
            if (!value && key !== "middleName") { // Middle name is optional
                newErrors[key] = true;
                isValid = false;
            }
        });

        setErrors(newErrors);
        if (!isValid) {
            showToast("Please fill out all required fields.", "error");
        }
        return isValid;
    };

    // Handle Authentication Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isProcessing) return;

        const formData = new FormData(e.currentTarget);
        if (!validateFields(formData)) return;

        setIsProcessing(true);
        if (isRegister) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            showToast("Registration successful! An OTP has been sent to your email.", "success");
            setIsVerifyingOTP(true);
        } else if (isLogin) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push("/");
        } else if (isForgotPassword) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            showToast("Reset link sent to your email.", "success");
            // Redirect to login after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        }
        setIsProcessing(false);
    };

    // Breadcrumbs Component
    const Breadcrumbs = () => (
        <div className="flex items-center justify-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            <span className={!isVerifyingOTP ? "text-white" : ""}>Register</span>
            <svg className="w-3 h-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
            <span className={isVerifyingOTP ? "text-white" : ""}>Verification</span>
        </div>
    );

    // Loading Spinner Component
    const LoadingSpinner = () => (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    // Handle OTP Verification
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");

        if (code.length === 6) {
            setIsProcessing(true);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsProcessing(false);
            showToast("Account verified successfully! Redirecting to login...", "success");

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } else {
            showToast("Please enter the complete 6-digit code.", "error");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={clsx(
                "w-full p-8 md:p-12 md:rounded-[2.5rem] bg-white/5 md:backdrop-blur-3xl md:border md:border-white/10 md:shadow-2xl relative overflow-hidden group min-h-screen md:min-h-fit flex flex-col justify-center transition-all duration-500",
                isRegister && !isVerifyingOTP ? "md:max-w-2xl" : "md:max-w-md"
            )}
        >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors duration-700" />

            <div className="relative z-10">
                {isRegister && <Breadcrumbs />}

                <AnimatePresence mode="wait">
                    {!isVerifyingOTP ? (
                        <motion.div
                            key="form-content"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="mb-10 text-center">
                                <div className="flex justify-start mb-8 -mt-2">
                                    <Link
                                        href={isForgotPassword ? "/login" : "/"}
                                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                                    >
                                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                            {isForgotPassword ? "Back to Login" : "Back to Home"}
                                        </span>
                                    </Link>
                                </div>
                                <Link href="/" className="text-3xl font-bold tracking-tighter text-white mb-4 block">
                                    LEIRAD
                                </Link>
                                <h1 className="text-xl font-medium text-white/90">
                                    {isLogin && "Welcome Back"}
                                    {isRegister && "Create Account"}
                                    {isForgotPassword && "Reset Password"}
                                </h1>
                                <p className="text-sm text-white/50 mt-2">
                                    {isLogin && "Please enter your details to sign in."}
                                    {isRegister && "Join the elite grooming community."}
                                    {isForgotPassword && "Enter your email to receive a reset link."}
                                </p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                                <div className={clsx(
                                    "gap-x-6 gap-y-6",
                                    isRegister ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
                                )}>
                                    {isRegister && (
                                        <>
                                            <motion.div
                                                custom={0}
                                                initial="hidden"
                                                animate={errors.firstName ? "error" : "visible"}
                                                variants={fieldVariants}
                                            >
                                                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                    First Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="John"
                                                    required
                                                    onFocus={() => setErrors(prev => ({ ...prev, firstName: false }))}
                                                    className={clsx(
                                                        "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none transition-all duration-300",
                                                        errors.firstName ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-white/30"
                                                    )}
                                                />
                                            </motion.div>
                                            <motion.div
                                                custom={1}
                                                initial="hidden"
                                                animate={errors.lastName ? "error" : "visible"}
                                                variants={fieldVariants}
                                            >
                                                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                    Last Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Doe"
                                                    required
                                                    onFocus={() => setErrors(prev => ({ ...prev, lastName: false }))}
                                                    className={clsx(
                                                        "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none transition-all duration-300",
                                                        errors.lastName ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-white/30"
                                                    )}
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                            >
                                                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                    Middle Name (Optional)
                                                </label>
                                                <input
                                                    name="middleName"
                                                    type="text"
                                                    placeholder="Quincy"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all duration-300"
                                                />
                                            </motion.div>
                                        </>
                                    )}

                                    <motion.div
                                        custom={isRegister ? 3 : 0}
                                        initial="hidden"
                                        animate={errors.email ? "error" : "visible"}
                                        variants={fieldVariants}
                                        className={clsx(!isRegister && "mb-6")}
                                    >
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            onFocus={() => setErrors(prev => ({ ...prev, email: false }))}
                                            className={clsx(
                                                "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none transition-all duration-300",
                                                errors.email ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-white/30"
                                            )}
                                        />
                                    </motion.div>

                                    {!isForgotPassword && (
                                        <>
                                            <motion.div
                                                custom={isRegister ? 4 : 1}
                                                initial="hidden"
                                                animate={errors.password ? "error" : "visible"}
                                                variants={fieldVariants}
                                                className={clsx(!isRegister && "mb-6")}
                                            >
                                                <div className="flex justify-between items-center mb-2 ml-1">
                                                    <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                                                        Password <span className="text-red-500">*</span>
                                                    </label>
                                                    {isLogin && (
                                                        <Link href="/forgot-password" className="text-[10px] text-white/50 hover:text-white transition-colors uppercase tracking-wider">
                                                            forgot password?
                                                        </Link>
                                                    )}
                                                </div>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    required
                                                    onFocus={() => setErrors(prev => ({ ...prev, password: false }))}
                                                    value={isRegister ? password : undefined}
                                                    onChange={isRegister ? (e) => handlePasswordChange(e.target.value) : undefined}
                                                    className={clsx(
                                                        "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none transition-all duration-500",
                                                        errors.password
                                                            ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                                            : (isRegister && password.length > 0
                                                                ? (passwordStrength === 1 ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" :
                                                                    passwordStrength === 2 ? "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]" :
                                                                        passwordStrength === 3 ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]" :
                                                                            "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]")
                                                                : "border-white/10 focus:border-white/30")
                                                    )}
                                                />
                                                {isRegister && password.length > 0 && (
                                                    <div className="mt-4 space-y-3">
                                                        <div className="flex items-center justify-between px-1">
                                                            <div className="flex gap-1.5 flex-1 max-w-[160px]">
                                                                {[1, 2, 3, 4].map((step) => (
                                                                    <div
                                                                        key={step}
                                                                        className={clsx(
                                                                            "h-1 rounded-full flex-1 transition-all duration-500",
                                                                            passwordStrength >= step
                                                                                ? strengthConfig[passwordStrength].color + " " + strengthConfig[passwordStrength].glow
                                                                                : "bg-white/10"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className={clsx(
                                                                "text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 ml-4 shrink-0",
                                                                passwordStrength === 1 ? "text-red-500" :
                                                                    passwordStrength === 2 ? "text-orange-500" :
                                                                        passwordStrength === 3 ? "text-blue-500" :
                                                                            "text-green-500"
                                                            )}>
                                                                {strengthConfig[passwordStrength].label}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                                                            {getRequirements(password).map((req, idx) => (
                                                                <div key={idx} className="flex items-center gap-2">
                                                                    <div className={clsx(
                                                                        "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300",
                                                                        req.met ? "bg-white/10 border-white/20" : "border-white/5"
                                                                    )}>
                                                                        {req.met && (
                                                                            <motion.svg
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                className="w-2 h-2 text-white"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                            >
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                                            </motion.svg>
                                                                        )}
                                                                    </div>
                                                                    <span className={clsx(
                                                                        "text-[9px] font-medium tracking-tight uppercase transition-colors duration-300",
                                                                        req.met ? "text-white/80" : "text-white/20"
                                                                    )}>
                                                                        {req.label}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>

                                            {isRegister && (
                                                <motion.div
                                                    custom={5}
                                                    initial="hidden"
                                                    animate={errors.confirmPassword ? "error" : "visible"}
                                                    variants={fieldVariants}
                                                >
                                                    <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                        Confirm Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        name="confirmPassword"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        required
                                                        onFocus={() => setErrors(prev => ({ ...prev, confirmPassword: false }))}
                                                        value={isRegister ? confirmPassword : undefined}
                                                        onChange={isRegister ? (e) => setConfirmPassword(e.target.value) : undefined}
                                                        className={clsx(
                                                            "w-full bg-white/5 border rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none transition-all duration-500",
                                                            errors.confirmPassword
                                                                ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                                                : (isRegister && confirmPassword.length > 0
                                                                    ? (confirmPassword === password
                                                                        ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                                                        : "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]")
                                                                    : "border-white/10 focus:border-white/30")
                                                        )}
                                                    />
                                                    {isRegister && confirmPassword.length > 0 && (
                                                        <div className="mt-2 flex items-center gap-2 ml-1">
                                                            <div className={clsx(
                                                                "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300",
                                                                confirmPassword === password ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                                                            )}>
                                                                {confirmPassword === password ? (
                                                                    <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className={clsx(
                                                                "text-[9px] font-bold uppercase tracking-widest transition-colors duration-300",
                                                                confirmPassword === password ? "text-green-500" : "text-red-500"
                                                            )}>
                                                                {confirmPassword === password ? "Passwords Match" : "Passwords Do Not Match"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: isForgotPassword ? 0.2 : (isLogin ? 0.3 : 0.5) }}
                                    className="pt-2"
                                >
                                    <MagneticButton
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-[56px] bg-white text-black text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <>
                                                {isLogin && "Sign In"}
                                                {isRegister && "Create Account"}
                                                {isForgotPassword && "Send Reset Link"}
                                            </>
                                        )}
                                    </MagneticButton>
                                </motion.div>
                            </form>

                            <div className="mt-8 text-center pt-8 border-t border-white/5">
                                <p className="text-sm text-white/50">
                                    {isLogin && (
                                        <>
                                            Don't have an account?{" "}
                                            <Link href="/register" className="text-white font-medium hover:underline underline-offset-4 decoration-white/30">
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                    {isRegister && (
                                        <>
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-white font-medium hover:underline underline-offset-4 decoration-white/30">
                                                Log In
                                            </Link>
                                        </>
                                    )}
                                    {isForgotPassword && (
                                        <>
                                            Remembered your password?{" "}
                                            <Link href="/login" className="text-white font-medium hover:underline underline-offset-4 decoration-white/30">
                                                Log In
                                            </Link>
                                        </>
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="text-center"
                        >
                            <div className="mb-10">
                                <Link href="/" className="text-3xl font-bold tracking-tighter text-white mb-4 block">
                                    LEIRAD
                                </Link>
                                <h1 className="text-xl font-medium text-white/90">Verify Email</h1>
                                <p className="text-sm text-white/50 mt-2">
                                    Please enter the 6-digit code sent to your email.
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-8">
                                <div className="flex justify-between gap-2 md:gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={otpInputRefs[index]}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-white/30 transition-all duration-300"
                                        />
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <MagneticButton
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-[56px] bg-white text-black text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <LoadingSpinner />
                                        ) : (
                                            "Verify Account"
                                        )}
                                    </MagneticButton>
                                    <button
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() => showToast("New OTP has been sent.", "info")}
                                        className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-[0.1em] disabled:opacity-30"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </form>

                            <button
                                onClick={() => setIsVerifyingOTP(false)}
                                disabled={isProcessing}
                                className="mt-8 text-xs text-white/30 hover:text-white transition-colors disabled:opacity-30"
                            >
                                ← Back to Registration
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
