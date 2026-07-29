import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  user_type?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Try backend authentication first
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Check for success response format: { status: true, token, user_data, ... }
        if (response.ok && data.status === true && data.token) {
          setToken(data.token);
          setUser(data.user_data);
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('auth_user', JSON.stringify(data.user_data));
          return;
        } 
        
        // Handle error response format: { success: false, message: "...", data: {...} }
        // or direct error format: { message: "...", error: "..." }
        const errorMessage = data.message || data.data?.message || data.error?.message || data.error || 'Invalid email or password';
        throw new Error(errorMessage);
      } catch (backendError: any) {
        // Fallback to local auth if backend is not available (for development)
        if (backendError.message && !backendError.message.includes('fetch')) {
          throw backendError;
        }
        
        // Basic local authentication (fallback for development)
        const ADMIN_EMAIL = 'admin@refex.com';
        const ADMIN_PASSWORD = 'admin123';

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const mockUser: User = {
            id: '1',
            email: ADMIN_EMAIL,
            first_name: 'Admin',
            last_name: 'User',
            role: 'SuperAdmin',
            user_type: 'Admin',
          };
          const mockToken = 'mock_token_' + Date.now();

          setToken(mockToken);
          setUser(mockUser);
          localStorage.setItem('auth_token', mockToken);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
        } else {
          throw new Error('Invalid email or password');
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Try backend logout if available
      if (token && !token.startsWith('mock_token_')) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });
        } catch (error) {
          console.error('Backend logout error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
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

