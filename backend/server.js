import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { loadIntents } from "./services/intentService.js";
import chatRoutes from "./routes/chat.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api", chatRoutes);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB();
    loadIntents();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

startServer();
