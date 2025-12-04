/**
 * RoleBasedHome - Renders the appropriate home page based on user role
 *
 * This component determines which home page to show based on the user's role.
 * In production, the role would come from authentication context.
 * For demo purposes, we include a persona switcher to toggle between roles.
 */

import { useState, createContext, useContext, type ReactNode } from 'react';
import { BranchManagerHomePage } from './BranchManagerHomePage';
import { QAReviewerHomePage } from './QAReviewerHomePage';
import type { UserRole } from '../guardian/types/branchManager';

// ============================================
// USER ROLE CONTEXT
// ============================================

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userId: string;
}

const UserRoleContext = createContext<UserRoleContextType | null>(null);

export function useUserRole() {
  const ctx = useContext(UserRoleContext);
  if (!ctx) throw new Error('useUserRole must be used within UserRoleProvider');
  return ctx;
}

// Demo users for quick switching (simplified to 2 personas)
const DEMO_USERS: Record<UserRole, { name: string; id: string }> = {
  BRANCH_BANKER: { name: 'Maya Chen', id: 'maya-chen-001' },
  BRANCH_MANAGER: { name: 'Alex Chen', id: 'alex-chen-001' },
  QA_REVIEWER: { name: 'Maya Chen', id: 'maya-chen-001' }, // Maya is QA Reviewer
  OPS_LEAD: { name: 'Alex Chen', id: 'alex-chen-001' },
  IT_ADMIN: { name: 'Alex Chen', id: 'alex-chen-001' },
};

// ============================================
// ROLE-BASED HOME PROVIDER
// ============================================

interface RoleBasedHomeProviderProps {
  children: ReactNode;
  defaultRole?: UserRole;
}

export function RoleBasedHomeProvider({ children, defaultRole = 'BRANCH_MANAGER' }: RoleBasedHomeProviderProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const user = DEMO_USERS[role];

  return (
    <UserRoleContext.Provider value={{ role, setRole, userName: user.name, userId: user.id }}>
      {children}
    </UserRoleContext.Provider>
  );
}

// ============================================
// ROLE-BASED HOME PAGE
// ============================================

export function RoleBasedHome() {
  const { role } = useUserRole();

  switch (role) {
    case 'BRANCH_MANAGER':
      return <BranchManagerHomePage />;

    case 'QA_REVIEWER':
      return <QAReviewerHomePage />;

    // All other roles default to QA Reviewer view
    default:
      return <QAReviewerHomePage />;
  }
}

// ============================================
// DEMO PERSONA SWITCHER
// ============================================

export function PersonaSwitcher() {
  const { role, setRole, userName } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);

  // Only 2 personas: Branch Manager (Alex) and QA Reviewer (Maya)
  const roles: { role: UserRole; label: string; description: string }[] = [
    { role: 'BRANCH_MANAGER', label: 'Branch Manager', description: 'Alex Chen - Oversees branch operations' },
    { role: 'QA_REVIEWER', label: 'QA Reviewer', description: 'Maya Chen - Reviews compliance & quality' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium shadow-lg hover:bg-purple-500 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {userName}
        <span className="text-purple-200 text-xs">({role.replace('_', ' ').toLowerCase()})</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-72 rounded-xl bg-gray-900 border border-gray-700 shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Demo Persona</p>
              <p className="text-sm text-gray-300 mt-1">Switch between user roles to see different views</p>
            </div>
            <div className="p-2">
              {roles.map(({ role: r, label, description }) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors ${
                    role === r
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    role === r ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {DEMO_USERS[r].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                  {role === r && (
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// COMBINED HOME PAGE WITH PERSONA SWITCHER
// ============================================

export function HomePageWithPersonaSwitcher() {
  return (
    <RoleBasedHomeProvider defaultRole="BRANCH_MANAGER">
      <RoleBasedHome />
      <PersonaSwitcher />
    </RoleBasedHomeProvider>
  );
}

export default HomePageWithPersonaSwitcher;
