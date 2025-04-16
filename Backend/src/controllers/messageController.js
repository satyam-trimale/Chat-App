const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel")
const User = require("../Models/userModel")
const { uploadOnCloudinary } = require("../utils/cloudinary.js")
const {getReceiverSocketId, io} = require("../utils/socket.js")


const getUsersForSidebar = asyncHandler(async (req,res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id : {$ne : loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getting users in sidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
        
    }
})

const getMessages = asyncHandler(async(req,res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getting messages",error.message);
        res.status(500).json({error: "Internal server error"})
    }
})
const sendMessage = asyncHandler(async(req,res) => {
    try {
        const { text } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage)

        
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });        
    }
})
module.exports = {getUsersForSidebar, getMessages, sendMessage}