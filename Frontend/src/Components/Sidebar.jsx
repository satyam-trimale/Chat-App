import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';

function Sidebar() {
    const { users, selectedChat, setSelectedChat, fetchChats } = useChat();
    const { socket } = useSocket();

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('getOnlineUsers', (onlineUsers) => {
                // Update online status of users
                const updatedUsers = users.map(user => ({
                    ...user,
                    isOnline: onlineUsers.includes(user._id)
                }));
                // Update users state
                // Note: You'll need to add a setUsers function to your ChatContext
            });
        }
    }, [socket, users]);

    return (
        <div className="w-1/4 bg-gray-100 h-full overflow-y-auto">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                <div className="space-y-2">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className={`p-3 rounded-lg cursor-pointer flex items-center ${
                                selectedChat?._id === user._id
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-200'
                            }`}
                            onClick={() => setSelectedChat(user)}
                        >
                            <div className="relative">
                                <img
                                    src={user.pic || 'https://via.placeholder.com/40'}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                {user.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar; 