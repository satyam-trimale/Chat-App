const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel")
const Message = require("../Models/messageModel")
const User = require("../Models/userModel")
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});