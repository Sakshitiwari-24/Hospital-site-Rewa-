import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, ArrowRight, Eye, EyeOff, User, Mail, Lock, Zap } from "lucide-react";

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        setTimeout(() => {
            if (isForgotPassword) {
                if (!email.trim()) {
                    setError("Email is required");
                    setIsLoading(false);
                    return;
                }
                // Mock success for forgot password
                alert("If an account with this email exists, a reset link will be sent.");
                setIsForgotPassword(false);
                setIsLoading(false);
                return;
            }

            let result;
            if (isSignUp) {
                if (!name.trim()) {
                    setError("Name is required");
                    setIsLoading(false);
                    return;
                }
                result = signup(name.trim(), email.trim(), password);
            } else {
                result = login(email.trim(), password);
            }

            if (result.success) {
                navigate("/");
            } else {
                setError(result.error || "Something went wrong");
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background noise-bg flex items-center justify-center relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 cyber-grid opacity-50" />

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-primary/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 border border-primary bg-primary/10 flex items-center justify-center glow-primary">
                            <Terminal className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-mono font-bold text-xl text-foreground tracking-widest uppercase">
                            Assess<span className="text-primary">Craft</span>
                        </span>
                    </div>
                    <div className="inline-flex items-center gap-2 border border-primary/30 bg-accent px-4 py-1.5">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-mono text-[10px] tracking-widest text-accent-foreground uppercase">
                            {isForgotPassword ? "System Recovery" : isSignUp ? "Create Account" : "Authentication Required"}
                        </span>
                    </div>
                </div>

                {/* Card */}
                <div className="border border-border bg-card/80 backdrop-blur-xl">
                    {/* Header tabs */}
                    {!isForgotPassword && (
                        <div className="flex border-b border-border">
                            <button
                                onClick={() => { setIsSignUp(false); setError(""); }}
                                className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${!isSignUp
                                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setIsSignUp(true); setError(""); }}
                                className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${isSignUp
                                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {isForgotPassword && (
                        <div className="flex border-b border-border">
                            <div className="flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest text-center bg-primary/10 text-primary border-b-2 border-primary">
                                Reset Password
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-destructive/10 border border-destructive/30 px-4 py-3 font-mono text-xs text-destructive tracking-wider"
                                >
                                    {"> "}{error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {!isForgotPassword && isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                                        {">"} Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="w-full bg-surface border border-border pl-10 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                                {">"} Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="agent@assesscraft.io"
                                    className="w-full bg-surface border border-border pl-10 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isForgotPassword && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                                        {">"} Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            placeholder="••••••••"
                                            className="w-full bg-surface border border-border pl-10 pr-12 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {!isSignUp && (
                                        <div className="flex justify-end mt-2">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsForgotPassword(true)}
                                                className="font-mono text-[10px] text-primary hover:text-primary/80 tracking-wider transition-colors"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                    {isSignUp && (
                                        <p className="font-mono text-[10px] text-muted-foreground mt-1.5 tracking-wider">
                                            Min. 6 characters required
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 border-2 border-primary bg-primary/10 px-6 py-4 font-mono font-bold text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Zap className="h-4 w-4 animate-pulse" />
                                    {isForgotPassword ? "Sending..." : isSignUp ? "Creating Agent..." : "Authenticating..."}
                                </>
                            ) : (
                                <>
                                    {isForgotPassword ? "Send Reset Link" : isSignUp ? "Create Account" : "Authenticate"}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom info */}
                    <div className="border-t border-border px-8 py-4">
                        {isForgotPassword ? (
                            <button
                                type="button"
                                onClick={() => setIsForgotPassword(false)}
                                className="w-full font-mono text-[10px] text-primary hover:text-primary/80 text-center tracking-wider transition-colors"
                            >
                                {"< Back to Sign In"}
                            </button>
                        ) : (
                            <p className="font-mono text-[10px] text-muted-foreground text-center tracking-wider">
                                {isSignUp
                                    ? "Already have an account? Click Sign In above."
                                    : "New agent? Click Sign Up above to create an account."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-center font-mono text-[10px] text-muted-foreground/50 mt-6 tracking-wider">
                    ASSESSCRAFT v1.0 — Assessment Engine
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
