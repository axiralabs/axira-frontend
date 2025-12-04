import { Outlet, NavLink } from 'react-router-dom';
import { cn } from '@axira/shared/utils';
import { AxiraLogo } from '../AxiraLogo';
import { useChatContext } from '../../features/chat/context';
import { getPulseSummary } from '../../features/guardian';

export function TopNavLayout() {
  const { openChat } = useChatContext();
  const pulseSummary = getPulseSummary();

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Header - minimal, clean */}
      <header className="flex h-14 items-center justify-between bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 px-6">
        {/* Left: Logo + Brand - clickable home */}
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <AxiraLogo size="sm" />
          <span className="text-xl font-semibold text-white">AXIRA</span>
        </NavLink>

        {/* Center: Navigation - simplified */}
        <nav className="flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'text-base font-medium transition-colors',
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              )
            }
          >
            Home
          </NavLink>
          <button
            onClick={() => openChat()}
            className="text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Chat
          </button>
          <NavLink
            to="/work"
            className={({ isActive }) =>
              cn(
                'text-base font-medium transition-colors',
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              )
            }
          >
            Work
          </NavLink>
          <NavLink
            to="/pulse"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 text-base font-medium transition-colors',
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              )
            }
          >
            Pulse
            {pulseSummary.urgent > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                {pulseSummary.urgent}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/studio"
            className={({ isActive }) =>
              cn(
                'text-base font-medium transition-colors',
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              )
            }
          >
            Studio
          </NavLink>
        </nav>

        {/* Right: User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            MC
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
