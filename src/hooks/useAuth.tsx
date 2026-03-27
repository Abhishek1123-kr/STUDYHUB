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
    console.log('🔐 useAuth: Initializing auth...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
      console.log('🔐 useAuth: Auth state change:', event, session?.user?.email || 'no user');
      if (event === 'SIGNED_OUT') {
        console.log('🔐 SIGNED_OUT event received, state should update');
      }
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔐 useAuth: Checking admin role for user:', session.user.id);
          try {
            const adminStatus = await checkAdminRole(session.user.id);
            console.log('🔐 useAuth: Admin status:', adminStatus);
            setIsAdmin(adminStatus);
          } catch (err) {
            console.error('🔐 useAuth: Admin check failed:', err);
            setIsAdmin(false);
          }
        } else {
          console.log('🔐 useAuth: No user, setting isAdmin false');
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('🔐 useAuth: getSession error:', error);
      } else {
        console.log('🔐 useAuth: Initial session:', session?.user?.email || 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔐 useAuth: Checking initial admin role for:', session.user.id);
          try {
            const adminStatus = await checkAdminRole(session.user.id);
            console.log('🔐 useAuth: Initial admin status:', adminStatus);
            setIsAdmin(adminStatus);
          } catch (err) {
            console.error('🔐 useAuth: Initial admin check failed:', err);
            setIsAdmin(false);
          }
        }
      }
      setIsLoading(false);
    }).catch(err => {
      console.error('🔐 useAuth: getSession promise rejected:', err);
      setIsLoading(false);
    });

    return () => {
      console.log('🔐 useAuth: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

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
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('🔐 supabase.auth.signOut error:', signOutError);
      }

      // Note: removeSession not available in client - skip
      console.log('🔐 Skipped removeSession (client-side)');
      
      // Force state reset
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      console.log('🔐 signOut: Cleared local state');

      // Prod: Force reload after delay to ensure session fully cleared
      if (import.meta.env.PROD) {
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (err) {
      console.error('🔐 signOut failed:', err);
      // Fallback reload
      window.location.href = '/';
      throw err;
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
