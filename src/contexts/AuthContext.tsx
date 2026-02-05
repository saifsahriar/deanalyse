import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function initAuth() {
            // Enforce Real Supabase Auth
            if (!supabase) {
                console.error("Supabase client is missing. Authentication cannot function.");
                setIsLoading(false);
                return;
            }

            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (mounted) {
                setSession(initialSession);
                setUser(initialSession?.user ?? null);
                setIsLoading(false);
            }

            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((_event, currentSession) => {
                if (mounted) {
                    setSession(currentSession);
                    setUser(currentSession?.user ?? null);
                    setIsLoading(false);
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }

        initAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!supabase) throw new Error("Supabase is not configured");
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        if (!supabase) throw new Error("Supabase is not configured");
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        });
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isLoading,
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
