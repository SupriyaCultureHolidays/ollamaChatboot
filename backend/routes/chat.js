import express from "express";
import { detectIntent, generateResponse } from "../services/ollamaService.js";
import { getIntents, findIntent } from "../services/intentService.js";
import { executeQuery } from "../services/dbService.js";
import { extractParameters } from "../utils/promptBuilder.js";
import { formatResult } from "../utils/responseFormatter.js";

const router = express.Router();

router.post("/chat", async (req, res, next) => {
    try {
        const { message } = req.body;
        
        // Step 1: Detect intent using Ollama
        const intents = getIntents();
        const detectedIntent = await detectIntent(message, intents);
        console.log("🎯 Detected intent:", detectedIntent);
        
        // Step 2: Find matching intent
        const intent = findIntent(detectedIntent);
        if (!intent) {
            return res.json({ 
                reply: "I'm not sure how to help with that. Try asking about agents, logins, or companies.",
                data: null 
            });
        }
        
        // Step 3: Extract parameters from message
        const params = extractParameters(message);
        console.log("📝 Parameters:", params);
        
        // Step 4: Execute database query
        const dbResult = await executeQuery(intent, params);
        console.log("💾 DB Result:", dbResult);
        
        // Step 5: Format result
        const formattedResult = formatResult(dbResult);
        
        // Step 6: Generate natural language response
        const reply = await generateResponse(message, formattedResult);
        
        res.json({ 
            reply, 
            data: Array.isArray(dbResult) && dbResult.length > 3 ? dbResult : null 
        });
        
    } catch (error) {
        next(error);
    }
});

export default router;
