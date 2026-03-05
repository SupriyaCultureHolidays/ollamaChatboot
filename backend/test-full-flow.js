import mongoose from "mongoose";
import { detectIntent } from "./services/ollamaService.js";
import { getIntents, findIntent, loadIntents } from "./services/intentService.js";
import { executeQuery } from "./services/dbService.js";
import { extractParameters } from "./utils/promptBuilder.js";
import { formatResult } from "./utils/responseFormatter.js";
import dotenv from "dotenv";

dotenv.config();

const testFullFlow = async () => {
    try {
        console.log("🔧 Testing full chat flow...");
        
        // 1. Test MongoDB connection
        console.log("\n1️⃣ Testing MongoDB connection...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected");
        
        // Check collections
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("📊 Available collections:", collections.map(c => c.name));
        
        // Check agents collection
        const agentsCount = await db.collection("agents").countDocuments();
        console.log("👥 Total agents:", agentsCount);
        
        // 2. Load intents
        console.log("\n2️⃣ Loading intents...");
        loadIntents();
        const intents = getIntents();
        console.log("✅ Loaded intents:", intents.length);
        
        // 3. Test parameter extraction
        console.log("\n3️⃣ Testing parameter extraction...");
        const message = "What is the nationality of RAY HARPER?";
        const params = extractParameters(message);
        console.log("📝 Extracted params:", params);
        
        // 4. Test intent detection
        console.log("\n4️⃣ Testing intent detection...");
        const detectedIntent = await detectIntent(message, intents);
        console.log("🎯 Detected intent:", detectedIntent);
        
        // 5. Find intent object
        console.log("\n5️⃣ Finding intent object...");
        const intent = findIntent(detectedIntent);
        console.log("📋 Intent object:", intent);
        
        if (!intent) {
            console.log("❌ Intent not found!");
            return;
        }
        
        // 6. Test database query
        console.log("\n6️⃣ Testing database query...");
        const dbResult = await executeQuery(intent, params);
        console.log("💾 DB Result:", dbResult);
        
        // 7. Test response formatting
        console.log("\n7️⃣ Testing response formatting...");
        const reply = formatResult(dbResult, intent.template, params);
        console.log("💬 Final reply:", reply);
        
        console.log("\n✅ Full flow test completed successfully!");
        
    } catch (error) {
        console.error("❌ Error in flow:", error.message);
        console.error("Stack:", error.stack);
    } finally {
        await mongoose.disconnect();
    }
};

testFullFlow();