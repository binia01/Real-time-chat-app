import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() === '') return;
    onSend(text);
    setText('');
  };

  return (
    <div className="flex">
      <input
        className="flex-1 p-2 border rounded-l"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r">Send</button>
    </div>
  );
};
