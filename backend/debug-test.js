import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:1b";

console.log("🔧 Testing Ollama connection...");
console.log("URL:", OLLAMA_URL);
console.log("Model:", OLLAMA_MODEL);

const testOllama = async () => {
    try {
        const prompt = `You are an intent classifier. Respond with ONLY the intent name, nothing else.

Available intents: get_agent_nationality, get_agent_details, search_agent

User: "What is the nationality of RAY HARPER?"
Intent:`;

        console.log("📤 Sending request to Ollama...");
        
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt,
            stream: false,
            options: {
                temperature: 0.1,
                num_predict: 20
            }
        });

        console.log("✅ Ollama Response:", response.data);
        console.log("🎯 Detected Intent:", response.data.response.trim().split('\n')[0].replace(/[^a-z_]/g, ''));
        
    } catch (error) {
        console.error("❌ Ollama Error:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    }
};

testOllama();