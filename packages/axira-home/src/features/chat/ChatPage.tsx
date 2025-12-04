import { useParams, useSearchParams } from 'react-router-dom';
import { ChatContainer } from './components';

export function ChatPage() {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get('subject') || undefined;

  return (
    <div className="h-full">
      <ChatContainer
        conversationId={conversationId}
        subjectKey={subjectKey}
        showSidebar={true}
        className="h-full"
      />
    </div>
  );
}
