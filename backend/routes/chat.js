import express from "express";
import { detectIntent } from "../services/ollamaService.js";
import { getIntents, findIntent, matchKeywords } from "../services/intentService.js";
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
            
            const reply = formatResult(dbResult, session.intent.template, params);
            return res.json({ 
                reply, 
                data: dbResult.data || dbResult,
                pagination: dbResult.pagination 
            });
        }
        
        // Step 1: Try keyword matching first (0ms)
        const keywordMatch = matchKeywords(message);
        let detectedIntent = null;
        
        if (keywordMatch.isInstant) {
            detectedIntent = keywordMatch.intent;
            console.log(`⚡ Instant match: ${detectedIntent} (${keywordMatch.confidence}% confidence)`);
        } else {
            // Step 2: Use Ollama for complex queries (2-3sec)
            const intents = getIntents();
            detectedIntent = await detectIntent(message, intents);
            console.log("🎯 Ollama detected intent:", detectedIntent);
        }
        
        // Step 3: Find matching intent
        const intent = findIntent(detectedIntent);
        if (!intent) {
            return res.json({ 
                reply: "I'm not sure how to help with that. Try asking about agents, logins, or companies.",
                data: null 
            });
        }
        
        // Fix email domain parameter if needed
        if (intent.intent === 'get_agents_by_email_domain' && params.param) {
            // Extract domain from email or use as-is
            if (params.param.includes('@')) {
                params.param = params.param.split('@')[1];
            }
        }
        
        // Step 4: Execute database query
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
        
        // Step 5: Format with template
        const reply = formatResult(dbResult, intent.template, params);
        
        // Determine what data to send
        let responseData = null;
        if (dbResult.pagination) {
            // Paginated results
            responseData = dbResult.data;
        } else if (Array.isArray(dbResult) && dbResult.length > 0 && typeof dbResult[0] === 'object') {
            // Array of objects (show as table)
            responseData = dbResult;
        }
        
        res.json({ 
            reply, 
            data: responseData,
            pagination: dbResult.pagination
        });
        
    } catch (error) {
        next(error);
    }
});

export default router;
