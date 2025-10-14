import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firebaseAuthService, FirebaseUser } from '@/lib/firebase-auth';

interface AuthContextType {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role?: 'admin' | 'customer') => Promise<void>;
  createAdmin: (username: string, email: string, password: string, invitationCode: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<FirebaseUser>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await firebaseAuthService.signIn(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string, role: 'admin' | 'customer' = 'customer'): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await firebaseAuthService.createUser(email, password, username, role);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async (username: string, email: string, password: string, invitationCode: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await firebaseAuthService.createAdminUser(email, password, username, invitationCode);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseAuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await firebaseAuthService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<FirebaseUser>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await firebaseAuthService.updateUserProfile(user.uid, updates);
      setUser({ ...user, ...updates });
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await firebaseAuthService.signInWithGoogle();
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    createAdmin,
    logout,
    resetPassword,
    updateProfile,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
