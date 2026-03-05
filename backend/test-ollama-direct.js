import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const testOllamaDirectly = async () => {
    const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:1b";
    
    console.log("Testing Ollama with exact same config as ollamaService.js");
    console.log("URL:", OLLAMA_URL);
    console.log("Model:", OLLAMA_MODEL);
    
    const intents = ["get_agent_nationality", "get_agent_details", "search_agent"];
    const userMessage = "What is the nationality of RAY HARPER?";
    const intentNames = intents.join(', ');

    const prompt = `You are an intent classifier. Respond with ONLY the intent name, nothing else.

Available intents: ${intentNames}

User: "${userMessage}"
Intent:`;

    try {
        console.log("Making request to:", `${OLLAMA_URL}/api/generate`);
        
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            prompt,
            stream: false,
            options: {
                temperature: 0.1,
                num_predict: 20
            }
        });

        console.log("✅ Success!");
        console.log("Response:", response.data.response);
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.error("Config URL:", error.config?.url);
    }
};

testOllamaDirectly();