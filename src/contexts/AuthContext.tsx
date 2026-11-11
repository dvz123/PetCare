import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'veterinario' | 'recepcionista' | 'esteticista' | 'administrador';
  crmv?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string, role: string, crmv?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  demoSignIn: (preset?: 'camila' | 'recepcao' | 'lucas') => void;
  forceSignIn: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'petcare_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check if there is an active local demo session saved
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default logged in as Dra. Camila Ramos for seamless immediate trial
    return {
      id: 'usr-camila-01',
      email: 'camila.ramos@petcare.com',
      name: 'Dra. Camila Ramos',
      role: 'veterinario',
      crmv: 'CRMV-SP 48.291',
      avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
    };
  });

  const [loading, setLoading] = useState(true);

  // Initialize and listen to Supabase auth events if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: meta.name || session.user.email?.split('@')[0] || 'Profissional',
            role: (meta.role as any) || 'veterinario',
            crmv: meta.crmv,
            avatarUrl: meta.avatar_url || '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
          };
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        }
        setLoading(false);
      });

      // 2. Listen to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: meta.name || session.user.email?.split('@')[0] || 'Profissional',
            role: (meta.role as any) || 'veterinario',
            crmv: meta.crmv,
            avatarUrl: meta.avatar_url || '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
          };
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  // Sign In function
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const meta = data.user.user_metadata || {};
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: meta.name || email.split('@')[0],
          role: (meta.role as any) || 'veterinario',
          crmv: meta.crmv,
          avatarUrl: meta.avatar_url || '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }
      return {};
    } else {
      // Local/Demo Auth behavior
      if (!email.trim() || !password.trim()) {
        return { error: 'Informe e-mail e senha para continuar.' };
      }

      const isCamila = email.toLowerCase().includes('camila') || email.toLowerCase().includes('admin');
      const profile: UserProfile = isCamila
        ? {
            id: 'usr-camila-01',
            email,
            name: 'Dra. Camila Ramos',
            role: 'veterinario',
            crmv: 'CRMV-SP 48.291',
            avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
          }
        : {
            id: `usr-${Date.now()}`,
            email,
            name: email.split('@')[0],
            role: 'recepcionista',
            avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
          };

      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      return {};
    }
  };

  // Sign Up function
  const signUp = async (
    name: string,
    email: string,
    password: string,
    role: string,
    crmv?: string
  ): Promise<{ error?: string }> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            crmv,
            avatar_url: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email,
          name,
          role: role as any,
          crmv,
          avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }
      return {};
    } else {
      const profile: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        name,
        role: role as any,
        crmv,
        avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
      };
      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      return {};
    }
  };

  // Sign Out function
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  // 1-Click Demo Profiles
  const demoSignIn = (preset: 'camila' | 'recepcao' | 'lucas' = 'camila') => {
    let profile: UserProfile;
    if (preset === 'camila') {
      profile = {
        id: 'usr-camila-01',
        email: 'camila.ramos@petcare.com',
        name: 'Dra. Camila Ramos',
        role: 'veterinario',
        crmv: 'CRMV-SP 48.291',
        avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
      };
    } else if (preset === 'recepcao') {
      profile = {
        id: 'usr-recepcao-02',
        email: 'recepcao@petcare.com',
        name: 'Juliana Costa',
        role: 'recepcionista',
        avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
      };
    } else {
      profile = {
        id: 'usr-lucas-03',
        email: 'lucas.estetica@petcare.com',
        name: 'Lucas Esteticista',
        role: 'esteticista',
        avatarUrl: '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
      };
    }

    setUser(profile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  };

  const forceSignIn = (customProfile: Partial<UserProfile>) => {
    const profile: UserProfile = {
      id: customProfile.id || `usr-${Date.now()}`,
      email: customProfile.email || 'davi@petcare.com',
      name: customProfile.name || 'Davi',
      role: (customProfile.role as any) || 'veterinario',
      crmv: customProfile.crmv,
      avatarUrl: customProfile.avatarUrl || '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg',
    };
    setUser(profile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        demoSignIn,
        forceSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
