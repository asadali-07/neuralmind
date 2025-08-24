import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getAllChat = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id });
    res.status(200).json({ message: "Chats fetched successfully", chats });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createChat = async (req, res) => {
  const {title} =req.body;
  try{
    const chat=await Chat.create({title,userId:req.user._id});
    res.status(201).json({message:"Chat created successfully",chat});

  }catch(error){
    res.status(500).json(error);
  }
};

export const getChat = async (req, res) => {
  try {

    const chat = await Chat.findById(req.params.id);
    const messages = await Message.find({ chatId: chat._id });
    res.status(200).json({message:"Chat fetched successfully",chat,messages});
    
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteChat = async (req, res) => {
  try {

    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Chat deleted successfully"});
    
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editChatTitle = async (req, res) => {
  try {
    await Chat.findByIdAndUpdate(req.params.id, { $set: { title: req.body.title } });
    res.status(200).json({ message: "Chat title updated successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};