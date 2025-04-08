import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { socket } = useSocket();

    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Configure axios defaults
    useEffect(() => {
        if (userInfo?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
        }
    }, [userInfo]);

    const fetchChats = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/messages/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                // Handle unauthorized error (token expired or invalid)
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/messages/${chatId}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
    };

    const sendMessage = async (content, chatId) => {
        try {
            const { data } = await axios.post(`http://localhost:5000/api/messages/send/${chatId}`, {
                text: content
            });
            setMessages(prevMessages => [...prevMessages, data]);
            if (socket) {
                socket.emit('newMessage', data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (newMessage) => {
                // Only update messages if we're in the correct chat
                setMessages(prevMessages => {
                    // Check if this message belongs to the current chat
                    if (selectedChat && 
                        (selectedChat._id === newMessage.senderId || 
                         selectedChat._id === newMessage.receiverId)) {
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages;
                });
            });

            // Cleanup
            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, selectedChat]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                messages,
                setMessages,
                users,
                setUsers,
                fetchChats,
                fetchMessages,
                sendMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}; 