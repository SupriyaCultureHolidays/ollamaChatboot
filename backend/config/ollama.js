import dotenv from "dotenv";

dotenv.config();

export default {
    url: process.env.OLLAMA_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3.2:1b"
};
