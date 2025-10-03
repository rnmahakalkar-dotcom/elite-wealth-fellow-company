import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProfileByUserId, Profile as RepoProfile } from '@/lib/profileRepo';

type Profile = RepoProfile;

type AuthUser = { id: string; email?: string } | null;
type AuthSession = { user: AuthUser } | null;

// type AuthUser = { id: string; email?: string } | null;
// type AuthSession = { user: AuthUser } | null;

interface AuthContextType {
  user: AuthUser;
  session: AuthSession;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  demoLogin: (role: 'super_admin' | 'manager' | 'office_staff') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<AuthSession>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchProfile = async (userId: string) => {
    const { data } = await getProfileByUserId(userId);
    if (data) setProfile(data);
  };

  useEffect(() => {
    // Load demo auth if present
    const demoRaw = localStorage.getItem('demoAuth');
    if (demoRaw) {
      try {
        const demo = JSON.parse(demoRaw);
        if (demo && demo.user && demo.profile) {
          setUser(demo.user);
          setSession({ user: demo.user });
          setProfile(demo.profile);
          setLoading(false);
          return; // skip mock supabase listener in demo mode
        }
      } catch {}
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid auth state change deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email
    });
    
    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
      localStorage.removeItem('demoAuth');
    }
    return { error };
  };

  const demoLogin = (role: 'super_admin' | 'manager' | 'office_staff') => {
    const demoUser = { id: 'demo-user-id', email: `${role}@demo.local` };
    const demoProfile: Profile = {
      id: 'demo-profile-id',
      user_id: demoUser.id,
      email: demoUser.email!,
      first_name: role === 'super_admin' ? 'Super' : role === 'manager' ? 'Manager' : 'Office',
      last_name: role === 'super_admin' ? 'Admin' : role === 'manager' ? 'User' : 'Staff',
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setSession({ user: demoUser });
    setProfile(demoProfile);
    localStorage.setItem('demoAuth', JSON.stringify({ user: demoUser, profile: demoProfile }));
    setLoading(false);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    verifyOtp,
    signOut,
    demoLogin,
  };

  return (
    <AuthContext.Provider value={value}>
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