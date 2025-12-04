import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface TenantContextValue {
  orgId: string | null;
  workspaceId: string | null;
  setOrg: (orgId: string) => void;
  setWorkspace: (workspaceId: string) => void;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  initialOrgId?: string;
  initialWorkspaceId?: string;
}

export function TenantProvider({
  children,
  initialOrgId,
  initialWorkspaceId,
}: TenantProviderProps) {
  const [orgId, setOrgId] = useState<string | null>(initialOrgId ?? null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(initialWorkspaceId ?? null);

  const setOrg = useCallback((id: string) => {
    setOrgId(id);
    // Clear workspace when org changes
    setWorkspaceId(null);
  }, []);

  const setWorkspace = useCallback((id: string) => {
    setWorkspaceId(id);
  }, []);

  return (
    <TenantContext.Provider value={{ orgId, workspaceId, setOrg, setWorkspace }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
