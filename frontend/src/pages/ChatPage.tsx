import { useState } from 'react';
import { ChatRoom } from '../components/ChatRoom';
import { RoomList } from '../components/RoomList';

export const ChatPage = () => {
  const userId = Number(localStorage.getItem('userId'));
  const [selectedRoom, setSelectedRoom] = useState('general');

  return (
    <div className="flex h-screen bg-gray-100">
      <RoomList selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} />
      <ChatRoom room={selectedRoom} userId={userId} />
    </div>
  );
};
