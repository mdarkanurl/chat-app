import { uploadImageToCloudinary } from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const filteredUser = await User.find({ _id: { $ne: userId } }).select('-password');

        res.status(200).json(filteredUser);
    } catch (error) {
        console.log(error)
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.userId;

        const messages = await Message.find({ 
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).select({ text: 1, image: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error retrieving messages' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const image = req.file;
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        let imageUrl;
        if(image) {
            const uploadRes = await uploadImageToCloudinary(image);
            imageUrl = uploadRes.url
        }

        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await message.save();

        res.status(201).json({ success: true, message: 'Message send' });
    } catch (error) {
        console.log(error)
    }
}