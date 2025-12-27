import React, { useEffect, useState } from 'react';
import { Send, Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ChatRoom, ChatMessage } from '../types';

const API_BASE = 'http://localhost:8080/api';

export const ChatPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) fetchRooms();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedRoom) fetchMessages(selectedRoom.id);
  }, [selectedRoom]);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchRooms = async () => {
    const res = await fetch(`${API_BASE}/chat/rooms`, { headers: authHeader() });
    const data = await res.json();
    setRooms(data);
    setSelectedRoom(data[0] ?? null);
    setLoading(false);
  };

  const fetchMessages = async (roomId: string) => {
    const res = await fetch(`${API_BASE}/chat/rooms/${roomId}/messages`, {
      headers: authHeader(),
    });
    setMessages(await res.json());
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    await fetch(`${API_BASE}/chat/rooms/${selectedRoom.id}/messages`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newMessage }),
    });

    setNewMessage('');
    fetchMessages(selectedRoom.id);
  };

  const createRoom = async () => {
    const res = await fetch(`${API_BASE}/chat/rooms`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `Chat ${Date.now()}` }),
    });

    const room = await res.json();
    setRooms(prev => [room, ...prev]);
    setSelectedRoom(room);
  };

  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <div className="text-white text-center p-8">Please login to chat</div>;
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <div className="w-80 bg-slate-800 p-4">
        <button onClick={createRoom} className="w-full bg-blue-600 text-white p-2 rounded mb-4">
          <Plus size={16} /> New Chat
        </button>

        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
        />

        {loading ? 'Loading...' : filteredRooms.map(r => (
          <div
            key={r.id}
            onClick={() => setSelectedRoom(r)}
            className={`p-3 cursor-pointer ${
              selectedRoom?.id === r.id ? 'bg-blue-600/20' : ''
            }`}
          >
            {r.name}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className="mb-2 text-white">
                  {m.content}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-slate-800 flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 p-2 bg-slate-700 text-white rounded"
              />
              <button className="bg-blue-600 p-2 rounded text-white">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
};
