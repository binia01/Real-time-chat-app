import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Room {
  id: string;
  name: string;
}

export const RoomList: React.FC<{ selectedRoom: string; onSelectRoom: (room: string) => void }> = ({ selectedRoom, onSelectRoom }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  const fetchRooms = () => {
    const token = localStorage.getItem('jwt');
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/chat/rooms`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const token = localStorage.getItem('jwt');
    axios.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/chat/rooms`,
      { name: newRoomName },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        setRooms(prev => [...prev, res.data]);
        setNewRoomName('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="w-1/4 bg-white p-4 border-r flex flex-col">
      <h2 className="font-bold mb-4">Rooms</h2>

      <div className="flex mb-4 flex-col">
        <input
          className="flex-1 p-2 border rounded-l"
          placeholder="New room name"
          value={newRoomName}
          onChange={e => setNewRoomName(e.target.value)}
        />
        <button
          onClick={handleCreateRoom}
          className="bg-green-500 text-white p-2 rounded-r"
        >
          Create
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map(room => (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`p-2 mb-2 cursor-pointer rounded ${selectedRoom === room.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
};
