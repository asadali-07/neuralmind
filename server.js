import express from "express";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import { createSocketServer } from './socket/socket.js';
import { connectDB } from './config/db.js';
import  http from 'http';
import cors from 'cors';
import path from "path";

configDotenv();

const app = express();
const server = http.createServer(app);

createSocketServer(server);
connectDB()

/* Middleware */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));



/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("*name", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});


