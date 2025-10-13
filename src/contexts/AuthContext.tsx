import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
  loginTime: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo credentials (in production, this would be handled by a backend)
  const validCredentials = {
    admin: {
      username: 'admin',
      email: 'admin@reconautobots.com',
      password: 'admin123',
      role: 'admin' as const
    },
    users: [
      {
        username: 'demo',
        email: 'demo@reconautobots.com',
        password: 'demo123',
        role: 'user' as const
      }
    ]
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('authUser');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          // Invalid user data, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if it's admin login (any username/password combination)
    if (email === 'admin' || email.includes('admin')) {
      const userData = {
        username: 'admin',
        email: email,
        loginTime: new Date().toISOString(),
        role: 'admin' as const
      };

      // Store auth data
      localStorage.setItem('authToken', 'demo-auth-token');
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoading(false);
      return;
    }

    // Check user credentials
    const foundUser = validCredentials.users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = {
        username: foundUser.username,
        email: foundUser.email,
        loginTime: new Date().toISOString(),
        role: foundUser.role
      };

      // Store auth data
      localStorage.setItem('authToken', 'demo-auth-token');
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    throw new Error('Invalid email or password');
  };

  const signup = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = validCredentials.users.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('Email already exists');
    }

    // Create new user
    const userData = {
      username,
      email,
      loginTime: new Date().toISOString(),
      role: 'user' as const
    };

    // Store auth data
    localStorage.setItem('authToken', 'demo-auth-token');
    localStorage.setItem('authUser', JSON.stringify(userData));
    
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
