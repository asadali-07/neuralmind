# NeuralMind Backend

NeuralMind is an intelligent chat application backend powered by AI and vector search capabilities. It integrates Google's Gemini AI, Pinecone vector database for memory management, and Tavily for web search functionality, providing users with a smart conversational experience.

## 🚀 Features

- **AI-Powered Chat**: Integration with Google Gemini 2.0 Flash for intelligent responses
- **Vector Memory**: Pinecone-based memory system for context-aware conversations
- **Web Search**: Tavily integration for real-time web search capabilities
- **Real-time Communication**: WebSocket support via Socket.IO
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Chat History**: Persistent storage of conversations and messages
- **RESTful API**: Clean and organized API structure

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Services**: 
  - Google Gemini AI
  - Pinecone Vector Database
  - Tavily Web Search
- **Authentication**: JWT & bcrypt
- **Real-time**: Socket.IO
- **Others**: CORS, Cookie Parser, dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asadali-07/neuralmind.git
   cd neuralmind/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=3000
   
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # AI Services
   GEMINI_API_KEY=your_google_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   TAVILY_API_KEY=your_tavily_api_key
   
   # Frontend URL (for CORS)
   FRONTEND_URL=https://neuralmind.netlify.app
   ```

4. **Start the server**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   └── chat.controller.js    # Chat operations
├── middlewares/
│   └── authUser.js           # Authentication middleware
├── models/
│   ├── chat.model.js         # Chat schema
│   ├── message.model.js      # Message schema
│   └── user.model.js         # User schema
├── routes/
│   ├── auth.route.js         # Authentication routes
│   ├── chat.route.js         # Chat routes
│   └── message.route.js      # Message routes
├── services/
│   ├── gemini.ai.js          # Gemini AI integration
│   ├── pinecone.service.js   # Vector database service
│   └── tavily.ai.js          # Web search service
├── socket/
│   └── socket.js             # WebSocket configuration
├── server.js                 # Application entry point
└── package.json              # Dependencies
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (protected)

### Chat
- `GET /api/chat` - Get all chats for authenticated user
- `POST /api/chat` - Create a new chat
- `GET /api/chat/:id` - Get specific chat
- `DELETE /api/chat/:id` - Delete a chat
- `POST /api/chat/:id/message` - Send a message

## 🧠 AI Features

### Gemini AI Integration
NeuralMind uses Google's Gemini 2.0 Flash model with a custom persona:
- Friendly, helpful assistant with playful energy
- Concise, actionable responses
- Step-by-step reasoning for complex queries
- Code generation with best practices

### Vector Memory (Pinecone)
- Stores conversation context as embeddings
- Enables semantic search across chat history
- Maintains conversation continuity
- Retrieves relevant past interactions

### Web Search (Tavily)
- Real-time web search capabilities
- Automatic detection of search-worthy queries
- Integration with AI responses
- Latest information retrieval

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies
- CORS configuration
- Protected routes with middleware

## 🌐 WebSocket Events

Real-time communication powered by Socket.IO:
- User connection/disconnection handling
- Live message delivery
- Typing indicators
- Online status updates

## 🚀 Deployment

The backend is designed to work with the frontend deployed at:
- Frontend: https://neuralmind.netlify.app

Configure your hosting platform with the environment variables from the `.env` file.

## 📝 Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server
- `npm test` - Run tests (to be implemented)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 👤 Author

**Asad Ali**
- GitHub: [@asadali-07](https://github.com/asadali-07)

## 🙏 Acknowledgments

- Google Gemini AI for powerful language model
- Pinecone for vector database infrastructure
- Tavily for web search capabilities
- Socket.IO for real-time communication

---

Made with ❤️ by the NeuralMind Team