import { Server } from "socket.io";
import cookie from "cookie";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateResponse, generateVector } from "../services/gemini.ai.js";
import Message from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/pinecone.service.js";

export function createSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://neuralmind.netlify.app",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    const token = cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("Client connected");

    socket.on("ai-message", async (messagePayload) => {
      const [message, vectors] = await Promise.all([
        Message.create({
          chatId: messagePayload.chatId,
          userId: socket.user._id,
          role: "user",
          content: messagePayload.content,
        }),
        generateVector(messagePayload.content),
      ]);

      const [memory, messageHistory] = await Promise.all([
        queryMemory({
          queryVector: vectors,
          limit: 2,
          metadata: {
            userId: socket.user._id,
          },
        }),
        await Message.find({ chatId: messagePayload.chatId })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean(),
      ]);

      await createMemory({
        vectors: vectors,
        messageId: message._id,
        metadata: {
          userId: socket.user._id,
          chatId: messagePayload.chatId,
          content: messagePayload.content,
        },
      });

      const stm = messageHistory.reverse().map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: ` There is a previous conversation use them to generate response:
             ${memory.map((m) => m.metadata.content).join("\n")}
            `,
            },
          ],
        },
      ];

      const response = await generateResponse([...ltm, ...stm]);

      socket.emit("ai-message-response", response);

      const [aiMessage, aiVectors] = await Promise.all([
        Message.create({
          chatId: messagePayload.chatId,
          userId: socket.user._id,
          role: "model",
          content: response,
        }),
        generateVector(response),
      ]);

      await createMemory({
        vectors: aiVectors,
        messageId: aiMessage._id,
        metadata: {
          userId: socket.user._id,
          chatId: messagePayload.chatId,
          content: response,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}
