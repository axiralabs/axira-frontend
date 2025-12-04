import { NavLink } from 'react-router-dom';
import { Bot, Workflow, Wrench, ShieldCheck } from 'lucide-react';
import { cn } from '@axira/shared/utils';

const navItems = [
  { to: '/agents', icon: Bot, label: 'Agent Designer' },
  { to: '/workflow-builder', icon: Workflow, label: 'Workflow Builder' },
  { to: '/skills', icon: Wrench, label: 'Skill Catalog' },
  { to: '/governance', icon: ShieldCheck, label: 'Governance' },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-xl font-semibold text-primary">Axira Studio</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
