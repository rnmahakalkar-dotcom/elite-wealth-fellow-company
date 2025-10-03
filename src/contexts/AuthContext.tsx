import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProfileByUserId, Profile as RepoProfile } from '@/lib/profileRepo';

type Profile = RepoProfile;

type AuthUser = { user_id: string; email: string; role: string } | null;
type AuthSession = { token: string; user: AuthUser } | null;

interface AuthContextType {
  user: AuthUser;
  session: AuthSession;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  fetchWithAuth: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<AuthSession>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = 'https://elite-wealth-company-project.vercel.app';

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Request failed');
    }
    return response.json();
  };

  const fetchProfile = async (userId: string) => {
    try {
      const data = await fetchWithAuth(`/auth/profile`);
      if (data) {
        setProfile(data);
        setUser({ user_id: data.user_id, email: data.email, role: data.role });
        localStorage.setItem('authUser', JSON.stringify({ user_id: data.user_id, email: data.email, role: data.role }));
        localStorage.setItem('authProfile', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setProfile(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('authProfile');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    const storedProfile = localStorage.getItem('authProfile');

    if (token && storedUser && storedProfile) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedProfile = JSON.parse(storedProfile);
        setUser(parsedUser);
        setSession({ token, user: parsedUser });
        setProfile(parsedProfile);
        fetchProfile(parsedUser.user_id);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('authProfile');
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } else {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/otp-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error.message);
      }
      localStorage.setItem('authToken', result.token);
      setUser(result.user);
      setSession({ token: result.token, user: result.user });
      await fetchProfile(result.user.user_id);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout errors
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authProfile');
    return { error: null };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    verifyOtp,
    signOut,
    fetchWithAuth,
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