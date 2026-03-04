import express from "express";
import { detectIntent } from "../services/ollamaService.js";
import { getIntents, findIntent } from "../services/intentService.js";
import { executeQuery } from "../services/dbService.js";
import { extractParameters } from "../utils/promptBuilder.js";
import { formatResult } from "../utils/responseFormatter.js";

const router = express.Router();
const sessions = {}; // In-memory session store

router.post("/chat", async (req, res, next) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        // Extract parameters
        const params = extractParameters(message);
        console.log("📝 Parameters:", params);
        
        // Handle pagination (next/prev)
        if (params.nextPage || params.prevPage) {
            const session = sessions[sessionId];
            if (!session) {
                return res.json({ reply: "No previous query to paginate.", data: null });
            }
            
            params.page = session.page + (params.nextPage ? 1 : -1);
            if (params.page < 1) params.page = 1;
            params.limit = session.limit;
            
            const dbResult = await executeQuery(session.intent, params);
            
            // Update session
            sessions[sessionId] = { ...session, page: params.page };
            
            const reply = formatResult(dbResult, session.intent.template);
            return res.json({ 
                reply, 
                data: dbResult.data || dbResult,
                pagination: dbResult.pagination 
            });
        }
        
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
        
        // Step 3: Execute database query
        const dbResult = await executeQuery(intent, params);
        console.log("💾 DB Result:", dbResult);
        
        // Store session for pagination
        if (intent.pagination) {
            sessions[sessionId] = {
                intent,
                page: params.page || 1,
                limit: params.limit || intent.defaultLimit || 10
            };
        }
        
        // Step 4: Format with template
        const reply = formatResult(dbResult, intent.template);
        
        res.json({ 
            reply, 
            data: dbResult.data || (Array.isArray(dbResult) && dbResult.length > 3 ? dbResult : null),
            pagination: dbResult.pagination
        });
        
    } catch (error) {
        next(error);
    }
});

export default router;
