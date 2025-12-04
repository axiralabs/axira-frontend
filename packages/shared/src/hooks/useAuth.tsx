import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { UserContext, ResourceSet } from '../types';

interface AuthContextValue {
  user: UserContext | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'axira_auth_token';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = useCallback((): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const fetchUser = useCallback(async (token: string): Promise<UserContext> => {
    // In production, this would call the Trust Graph service
    // For now, return mock user data
    const mockUser: UserContext = {
      userId: 'maya-chen-001',
      orgId: 'lsnb-001',
      workspaceId: 'lsnb-main',
      displayName: 'Maya Chen',
      roles: ['banker', 'branch-user'],
      branch: {
        id: 'branch-001',
        name: 'Main Street Branch',
      },
      resourceSet: {
        allowedSubjectKinds: ['customer', 'account', 'loan'],
        allowedBranches: ['branch-001', 'branch-002'],
        allowedProductTypes: ['DDA', 'Savings', 'CD'],
        policyPacks: ['standard-banking'],
      },
    };
    return mockUser;
  }, []);

  const login = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      const userData = await fetchUser(token);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUser(token)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser, getToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
