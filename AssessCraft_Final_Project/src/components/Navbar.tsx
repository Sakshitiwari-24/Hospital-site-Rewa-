import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, LogOut, User } from "lucide-react";

interface NavbarProps {
    showBack?: boolean;
    backTo?: string;
    title?: string;
}

const Navbar = ({ showBack, backTo = "/", title }: NavbarProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const NavLink = ({ to, label }: { to: string, label: string }) => {
        const isActive = location.pathname.startsWith(to);
        return (
            <Link
                to={to}
                className="relative group font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors px-3 py-2 hidden sm:block"
            >
                {label}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
        );
    };

    return (
        <header className="border-b border-border surface-glass sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <Link to={backTo} className="text-muted-foreground hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        </Link>
                    )}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 border border-primary bg-primary/10 flex items-center justify-center">
                            <Terminal className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-mono font-bold text-lg text-foreground tracking-widest uppercase">
                            Assess<span className="text-primary">Craft</span>
                        </span>
                    </Link>
                    {title && (
                        <>
                            <div className="h-5 w-px bg-border hidden sm:block" />
                            <span className="font-mono font-bold text-xs tracking-widest text-muted-foreground uppercase hidden sm:block">
                                {title}
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <nav className="flex items-center gap-2 mr-4">
                        <NavLink to="/dashboard" label="Dashboard" />
                        <NavLink to="/practice" label="Practice" />
                    </nav>

                    {user && (
                        <div className="flex items-center gap-2 border-l border-border pl-3">
                            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span className="font-mono text-[10px] tracking-wider uppercase">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 transition-all"
                                title="Logout"
                            >
                                <LogOut className="h-3 w-3" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
