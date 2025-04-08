import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';

function ChatBox() {
    const { selectedChat, messages, sendMessage, fetchMessages } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat._id);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedChat) {
            await sendMessage(newMessage, selectedChat._id);
            setNewMessage('');
        }
    };

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b">
                <div className="flex items-center">
                    <img
                        src={selectedChat.pic || 'https://via.placeholder.com/40'}
                        alt={selectedChat.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                        <p className="font-medium">{selectedChat.name}</p>
                        <p className="text-sm text-gray-500">{selectedChat.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`mb-4 flex ${
                            message.senderId === selectedChat._id ? 'justify-start' : 'justify-end'
                        }`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg ${
                                message.senderId === selectedChat._id
                                    ? 'bg-gray-100'
                                    : 'bg-blue-500 text-white'
                            }`}
                        >
                            {message.text}
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="message"
                                    className="mt-2 rounded-lg max-w-full"
                                />
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-l-lg p-2 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatBox; 