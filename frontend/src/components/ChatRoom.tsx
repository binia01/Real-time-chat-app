import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatRoomProps {
  room: string;
  userId: number;
}


export const ChatRoom: React.FC<ChatRoomProps> = ({ room }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    setMessages([]);
    const token = localStorage.getItem('jwt');
    if (!token) return;

    const s = io(`${import.meta.env.VITE_REACT_APP_API_URL}/chat`, { auth: { token } });

    s.on('connect', () => {
      s.emit('joinRoom', { room });
    });

    s.on('receiveMessage', msg => {
      if (msg.room === room || !msg.room) {
        setMessages(prev => [...prev, msg]);
      }
    });

    setSocket(s);

    return () => {
      s.emit('leaveRoom', { room });
      s.disconnect();
    };
  }, [room]);

  const sendMessage = (text: string) => {
    if (!socket) return;
    socket.emit('message', { room, text });
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
