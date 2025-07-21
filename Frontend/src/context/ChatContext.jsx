import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';
import { deriveSharedSecret, encryptMessage, decryptMessage } from '../utils/crypto';



const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [recipientPublicKey,setRecipientPublicKey] = useState(null);
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
    const decryptMessageContent = async (message) => {
        // Only decrypt if the message is an object (our encrypted format)
        if (typeof message.message !== 'object' || message.message === null) {
            return message; // Return as-is if not encrypted
        }
        
        try {
            const privateKey = localStorage.getItem(`privateKey_${userInfo._id}`);
            if (!privateKey) throw new Error("Private key is missing.");

            // Determine whose public key we need (the other person in the chat)
            const otherUserId = message.senderId === userInfo._id ? message.receiverId : message.senderId;
            
            // NOTE: This assumes the recipient's public key is already fetched and stored.
            // For batch decryption, this could be optimized further if needed.
            const { data: keyData } = await axios.get(`http://localhost:5000/api/user/key/${otherUserId}`);
            const otherPublicKey = keyData.publicKey;

            const sharedSecret = deriveSharedSecret(privateKey, otherPublicKey);
            const decryptedText = await decryptMessage(sharedSecret, message.message);
            
            // Return a new message object with the decrypted text
            return { ...message, message: decryptedText };

        } catch (error) {
            console.error("Decryption failed for a message:", error);
            // Return the message with an error text
            return { ...message, message: "⚠️ Decryption Failed" };
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/messages/${chatId}`);
            // --- 2. DECRYPT BATCH OF HISTORICAL MESSAGES ---
            const decryptedMessages = await Promise.all(
                data.map(msg => decryptMessageContent(msg))
            );            
            setMessages(decryptedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
    };

    const sendMessage = async (content, chatId) => {

        //Encryption at sender
        if(!chatId || !recipientPublicKey){
            console.error("sendMessage error: Recipient or their public key is missing.");
            return;
        }
        try {
            //localStorage.setItem(`privateKey_${data._id}`,newPrivateKey);
            //localStorage.setItem('userInfo', JSON.stringify(data));

            //Get private key from storage 
            const privateKey = localStorage.getItem(`privateKey_${userInfo._id}`);
            if (!privateKey) throw new Error("Private key not found. Please log in again.");

            const sharedSecret = deriveSharedSecret(privateKey,recipientPublicKey);

            const encryptedMessage = await encryptMessage(sharedSecret,content);
            

            const { data } = await axios.post(`http://localhost:5000/api/messages/send/${chatId}`, {
                message: encryptedMessage
            });
            // Manually override the encrypted message with the plaintext
            const messageForSender = {
                 ...data,
                message: content  // Replace encrypted text with plaintext for local UI
            };            
            setMessages(prevMessages => [...prevMessages, messageForSender]);
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

    const getPublicKey = async(user) => {
        if(!user) return;
        setSelectedChat(user);
        try {
            const { data:keyData } = await axios.get(`http://localhost:5000/api/user/key/${user._id}`)
            setRecipientPublicKey(keyData.publicKey);
        } catch (error) {
            console.error("Failed to fetch recipient's public key",error)
            setRecipientPublicKey(null)
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', async (newMessage) => { // Make this async
                // --- 3. DECRYPT INCOMING REAL-TIME MESSAGE ---
                const decryptedMessage = await decryptMessageContent(newMessage);

                if (selectedChat && 
                    (selectedChat._id === decryptedMessage.senderId || 
                     selectedChat._id === decryptedMessage.receiverId)) {
                    
                    setMessages(prevMessages => [...prevMessages, decryptedMessage]);
                }
            });

            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, selectedChat]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat: getPublicKey, //...it's actually calling getPublicKey!
                chats,
                setChats,
                messages,
                setMessages,
                users,
                setUsers,
                fetchChats,
                fetchMessages,
                sendMessage,
                getPublicKey
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}; 