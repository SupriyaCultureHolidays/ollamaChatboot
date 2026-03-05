import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import keywords from "./keywords.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let intents = [];

export const loadIntents = () => {
    const intentsPath = path.join(__dirname, "../intents/intents.json");
    const data = fs.readFileSync(intentsPath, "utf8");
    intents = JSON.parse(data);
    console.log(`✅ Loaded ${intents.length} intents`);
};

export const getIntents = () => intents;

export const findIntent = (intentName) => {
    return intents.find(i => i.intent.toLowerCase() === intentName.toLowerCase());
};

// Match user message against keywords for instant responses
export const matchKeywords = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    const words = message.split(/\s+/);
    
    let bestMatch = null;
    let highestScore = 0;
    
    // Check each intent's keywords
    for (const [intentName, keywordList] of Object.entries(keywords)) {
        let score = 0;
        let matches = 0;
        
        // Check each keyword against message
        for (const keyword of keywordList) {
            if (message.includes(keyword.toLowerCase())) {
                matches++;
                // Exact phrase match gets higher score
                if (message === keyword.toLowerCase()) {
                    score += 100;
                } else {
                    score += 50;
                }
            }
        }
        
        // Calculate percentage score
        const percentage = matches > 0 ? (score / keywordList.length) : 0;
        
        if (percentage > highestScore && percentage >= 30) {
            highestScore = percentage;
            bestMatch = intentName;
        }
    }
    
    return {
        intent: bestMatch,
        confidence: highestScore,
        isInstant: highestScore >= 30
    };
};
