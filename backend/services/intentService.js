import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
