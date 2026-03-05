import axios from "axios";
import ollamaConfig from "../config/ollama.js";

export const detectIntent = async (userMessage, intents) => {
    const intentNames = intents.map(i => i.intent).join(', ');

    const prompt = `You are an intent classifier. Respond with ONLY the intent name, nothing else.

Available intents: ${intentNames}

User: "${userMessage}"
Intent:`;

    const response = await axios.post(`${ollamaConfig.url}/api/generate`, {
        model: ollamaConfig.model,
        prompt,
        stream: false,
        options: {
            temperature: 0.1,
            num_predict: 20
        }
    });

    return response.data.response.trim().split('\n')[0].replace(/[^a-z_]/g, '');
};
