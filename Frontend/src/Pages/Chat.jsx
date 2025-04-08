import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import Sidebar from '../Components/Sidebar';
import ChatBox from '../Components/ChatBox';

function Chat() {
    const navigate = useNavigate();
    const { socket, connectSocket } = useSocket();

    // Check if user is logged in
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }

        // Connect socket if not already connected
        if (!socket && userInfo._id) {
            connectSocket(userInfo._id);
        }
    }, [navigate, socket, connectSocket]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">Chat App</h1>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                    Logout
                </button>
            </div>
            <div className="flex-1 flex">
                <Sidebar />
                <ChatBox />
            </div>
        </div>
    );
}

export default Chat; 