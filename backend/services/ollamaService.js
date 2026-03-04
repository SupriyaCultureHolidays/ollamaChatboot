import axios from "axios";
import ollamaConfig from "../config/ollama.js";

export const detectIntent = async (userMessage, intents) => {
    const intentList = intents.map(i => `- ${i.intent}: ${i.examples[0]}`).join('\n');
    
    const prompt = `You are an intent classifier. User asked: "${userMessage}"

Available intents:
${intentList}

Reply with ONLY the intent name, nothing else.`;

    const response = await axios.post(`${ollamaConfig.url}/api/generate`, {
        model: ollamaConfig.model,
        prompt,
        stream: false
    });

    return response.data.response.trim();
};

export const generateResponse = async (userMessage, dbResult) => {
    const prompt = `User asked: "${userMessage}"
Database returned: ${JSON.stringify(dbResult, null, 2)}

Give a friendly, concise reply in 1-2 sentences.`;

    const response = await axios.post(`${ollamaConfig.url}/api/generate`, {
        model: ollamaConfig.model,
        prompt,
        stream: false
    });

    return response.data.response.trim();
};
