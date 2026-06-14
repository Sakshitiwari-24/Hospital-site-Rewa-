import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => { success: boolean; error?: string };
    signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "assesscraft_users";
const SESSION_KEY = "assesscraft_session";

interface StoredUser {
    name: string;
    email: string;
    passwordHash: string;
}

// Simple hash for demo purposes (not production-grade security)
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash.toString(36);
}

function getStoredUsers(): StoredUser[] {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveStoredUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const session = localStorage.getItem(SESSION_KEY);
            if (session) {
                setUser(JSON.parse(session));
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (email: string, password: string) => {
        const users = getStoredUsers();
        const found = users.find(
            (u) => u.email === email.toLowerCase() && u.passwordHash === simpleHash(password)
        );
        if (!found) {
            return { success: false, error: "Invalid email or password" };
        }
        const sessionUser = { email: found.email, name: found.name };
        setUser(sessionUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return { success: true };
    };

    const signup = (name: string, email: string, password: string) => {
        const users = getStoredUsers();
        if (users.some((u) => u.email === email.toLowerCase())) {
            return { success: false, error: "Email already registered" };
        }
        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters" };
        }
        const newUser: StoredUser = {
            name,
            email: email.toLowerCase(),
            passwordHash: simpleHash(password),
        };
        users.push(newUser);
        saveStoredUsers(users);
        const sessionUser = { email: newUser.email, name: newUser.name };
        setUser(sessionUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
