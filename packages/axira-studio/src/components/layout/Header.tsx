import { useAuth } from '@axira/shared/hooks';
import { Button } from '@axira/shared/components';
import { User, LogOut, ExternalLink } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const homeUrl = import.meta.env.VITE_HOME_URL || 'http://localhost:5173';

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium">Admin Console</h1>
      </div>
      <div className="flex items-center gap-4">
        <a
          href={homeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Open Axira Home
          <ExternalLink className="h-3 w-3" />
        </a>
        {user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user.displayName}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
