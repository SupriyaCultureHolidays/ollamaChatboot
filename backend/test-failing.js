import { matchIntentByKeywords } from './services/keywordMatcher.js';

const failingQueries = [
    "List agents by company name Culture Holidays",
    "What company does gautam work for?",
    "Find agent by name Ray Harper"
];

console.log('🧪 Testing Failing Queries\n');

failingQueries.forEach(query => {
    const intent = matchIntentByKeywords(query);
    console.log(`"${query}" → ${intent || 'OLLAMA_FALLBACK'}`);
});

console.log('\n🔍 Expected Results:');
console.log('"List agents by company name Culture Holidays" → get_agents_by_company');
console.log('"What company does gautam work for?" → get_agent_company');
console.log('"Find agent by name Ray Harper" → search_agent');