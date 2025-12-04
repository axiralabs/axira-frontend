import { cn } from '@axira/shared/utils';
import { useChatContext } from '../context';
import { AxiraLogo } from '../../../components/AxiraLogo';

export function ChatBubble() {
  const { isOpen, toggleChat } = useChatContext();

  return (
    <button
      onClick={toggleChat}
      className={cn(
        'fixed bottom-6 right-6 z-30',
        'w-14 h-14 rounded-full',
        'bg-white shadow-lg border border-gray-200',
        'flex items-center justify-center',
        'hover:shadow-xl hover:scale-105',
        'transition-all duration-200 ease-out',
        isOpen && 'opacity-0 pointer-events-none'
      )}
      aria-label={isOpen ? 'Close Axira chat' : 'Open Axira chat'}
    >
      <AxiraLogo size="md" className="w-8 h-8" />
    </button>
  );
}
