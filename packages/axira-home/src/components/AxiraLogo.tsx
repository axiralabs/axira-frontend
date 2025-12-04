import { cn } from '@axira/shared/utils';

interface AxiraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AxiraLogo({ size = 'md', className }: AxiraLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="axira-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="25%" stopColor="#00E5A0" />
          <stop offset="50%" stopColor="#FFE600" />
          <stop offset="75%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#C77DFF" />
        </linearGradient>
      </defs>
      {/* Hexagon background */}
      <path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        fill="url(#axira-gradient)"
        rx="8"
      />
      {/* Arrow/A shape */}
      <path
        d="M50 22 L72 65 L62 65 L56 53 L44 53 L38 65 L28 65 L50 22 Z M50 35 L44 48 L56 48 L50 35 Z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  );
}

// Inline mini logo for use in search bar
export function AxiraLogoInline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-6 h-6', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="axira-gradient-inline" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="25%" stopColor="#00E5A0" />
          <stop offset="50%" stopColor="#FFE600" />
          <stop offset="75%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#C77DFF" />
        </linearGradient>
      </defs>
      <path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        fill="url(#axira-gradient-inline)"
      />
      <path
        d="M50 22 L72 65 L62 65 L56 53 L44 53 L38 65 L28 65 L50 22 Z M50 35 L44 48 L56 48 L50 35 Z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  );
}
