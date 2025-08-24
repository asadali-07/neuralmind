import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "model"],
    default: "user",
  },
  content: {
    type: String,
    required: true,
  },
},{timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;
