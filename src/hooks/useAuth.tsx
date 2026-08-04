import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string) => {
    console.log('🔐 checkAdminRole: Querying for user:', userId);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('🔐 checkAdminRole error:', error);
        return false;
      }
      console.log('🔐 checkAdminRole result:', data);
      return !!data;
    } catch (err) {
      console.error('🔐 checkAdminRole exception:', err);
      return false;
    }
  };

  useEffect(() => {
    console.log('🔐 useAuth: Initializing auth state listener...');
    
    // Safety fallback: Ensure isLoading never hangs indefinitely
    const safetyTimer = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) {
          console.warn('🔐 useAuth: Safety fallback timeout triggered (5s), setting isLoading false');
        }
        return false;
      });
    }, 5000);

    // 1. Synchronous auth state listener (NO async awaits inside to prevent Supabase auth lock deadlock)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔐 useAuth: Auth state change event:', event, currentSession?.user?.email || 'no user');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (!currentSession?.user) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // 2. Initial session restoration check
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error('🔐 useAuth: getSession error:', error);
        setIsLoading(false);
      } else {
        console.log('🔐 useAuth: Initial session RESTORED:', currentSession?.user?.email || 'no session');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (!currentSession?.user) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    }).catch((err) => {
      console.error('🔐 useAuth: getSession rejected:', err);
      setIsLoading(false);
    });

    return () => {
      console.log('🔐 useAuth: Cleaning up subscription and timers');
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  // 3. Decoupled admin role verification - executes outside of onAuthStateChange lock
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    console.log('🔐 useAuth: Verifying admin role for user:', user.id);
    checkAdminRole(user.id)
      .then((adminStatus) => {
        if (isMounted) {
          console.log('🔐 useAuth: Admin role restored status:', adminStatus);
          setIsAdmin(adminStatus);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('🔐 useAuth: Admin role verification error:', err);
        if (isMounted) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    console.log('🔐 signOut: Called');
    try {
      // Clear localStorage auth keys first to ensure client is logged out immediately
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }

      // Try to notify Supabase server, but don't let it block local sign out
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('🔐 supabase.auth.signOut request failed:', err);
      }
      
      // Force state reset
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      console.log('🔐 signOut: Cleared local state');

      // Force reload to completely clear memory/state
      window.location.href = '/';
    } catch (err) {
      console.error('🔐 signOut failed:', err);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
