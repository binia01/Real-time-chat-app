import React, { useRef, useEffect } from 'react';

interface MessageListProps {
  messages: any[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto mb-2">
      {messages.map(msg => (
        <div key={msg.id} className="mb-1">
          <strong>{msg.sender.username}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};
