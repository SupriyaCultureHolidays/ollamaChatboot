import { matchIntentByKeywords } from "./services/keywordMatcher.js";
import { extractParameters } from "./utils/promptBuilder.js";
import { findIntent } from "./services/intentService.js";

// Test queries from the user's list
const testQueries = [
    // Agent Profile Questions
    "Show me details of agent gautam@cultureholidays.com",
    "Who is CHAGT0001000024104?",
    "Find agent by name Ray Harper",
    "What company does gautam work for?",
    "What is the nationality of RAY HARPER?",
    "Show all agents from India",
    "Show all agents from United States",
    "List agents by company name Culture Holidays",
    "When was LUXE GRAND TRAVEL agent created?",
    "What is the establishment date of LUXE GRAND TRAVEL?",
    
    // Login Activity Questions
    "When did ashish.bhasin@travelchacha.com last login?",
    "Show login history of goneagaintravelandtours",
    "Who logged in today?",
    "Who logged in this week?",
    "Who logged in this month?",
    "Show all logins in May 2022",
    "Which agents have not logged in for 30 days?",
    "Which agents have not logged in for 6 months?",
    "Show recent logins",
    "Who was the last agent to login?",
    "Who logged in between 1st Jan to 1st March?",
    
    // Count & Summary Questions
    "How many total agents are there?",
    "How many agents are from India?",
    "How many agents registered this year?",
    "How many agents logged in today?",
    "How many agents have never logged in?",
    "How many agents are from United States?",
    "How many companies are registered?",
    "How many agents were created in January 2022?",
    "total companies are registered?",
    
    // Company Based Questions
    "List all companies registered",
    "Show agents of Culture Holidays company",
    "How many agents does LUXE GRAND TRAVEL have?",
    "Which company was established first?",
    "Show companies established after 2015",
    "Show companies with no establishment date",
    
    // Date Based Questions
    "Show agents created before 2023",
    "Show agents created after January 2022",
    "Which agents were created this month?",
    "Which agents last logged in in 2025?",
    "Show agents who logged in after July 2025",
    "Show agents created and never logged in again",
    
    // Search Questions
    "Search agent by email luxegrandtravel@mail.com",
    "Find all agents with gmail",
    "Find agents whose name starts with R",
    "Show agents where company name contains travel",
    "Find agent ID for Ray Harper",
    
    // Inactive / Risk Questions
    "Which agents have not logged in for over 1 year?",
    "Show inactive agents",
    "Which agents registered but never logged in?",
    "Show agents last active before 2024",
    "Which agents have missing establishment date?"
];

console.log("🧪 Testing All Query Patterns\n");

testQueries.forEach((query, index) => {
    console.log(`${index + 1}. "${query}"`);
    
    // Test keyword matching
    const intent = matchIntentByKeywords(query);
    console.log(`   Intent: ${intent || 'NO MATCH'}`);
    
    // Test parameter extraction
    const params = extractParameters(query);
    if (Object.keys(params).length > 0) {
        console.log(`   Params:`, params);
    }
    
    // Check if intent exists
    if (intent) {
        const intentObj = findIntent(intent);
        console.log(`   Valid: ${intentObj ? '✅' : '❌'}`);
    } else {
        console.log(`   Valid: ⚠️ (will use Ollama)`);
    }
    
    console.log("");
});

console.log("✅ Test completed!");