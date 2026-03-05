import ollamaConfig from "./config/ollama.js";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing ollama config import...");
console.log("ollamaConfig:", ollamaConfig);
console.log("ollamaConfig.url:", ollamaConfig.url);
console.log("ollamaConfig.model:", ollamaConfig.model);

console.log("\nEnvironment variables:");
console.log("OLLAMA_URL:", process.env.OLLAMA_URL);
console.log("OLLAMA_MODEL:", process.env.OLLAMA_MODEL);