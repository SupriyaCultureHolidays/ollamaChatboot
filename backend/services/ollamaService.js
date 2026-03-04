import axios from "axios";
import ollamaConfig from "../config/ollama.js";

export const detectIntent = async (userMessage, intents) => {
    const intentNames = intents.map(i => i.intent).join(', ');
    
    const prompt = `You must respond with ONLY ONE of these exact intent names, nothing else:
${intentNames}

User question: "${userMessage}"

Respond with the exact intent name only:`;

    const response = await axios.post(`${ollamaConfig.url}/api/generate`, {
        model: ollamaConfig.model,
        prompt,
        stream: false,
        options: {
            temperature: 0.1,
            num_predict: 50
        }
    });

    return response.data.response.trim().split('\n')[0].replace(/[^a-z_]/g, '');
};
