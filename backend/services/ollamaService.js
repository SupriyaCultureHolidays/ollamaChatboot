import axios from "axios";
import ollamaConfig from "../config/ollama.js";

export const detectIntent = async (userMessage, intents) => {
    const intentExamples = {
        'get_agent_details': ['show me details of agent', 'who is', 'find agent by name', 'agent details'],
        'get_agent_company': ['what company does', 'where does', 'work for'],
        'get_agent_nationality': ['nationality of', 'what is the nationality', 'where is from'],
        'get_agents_by_nationality': ['show all agents from', 'agents from', 'list agents from'],
        'get_agents_by_company': ['agents of', 'show agents of', 'list agents by company'],
        'get_agent_last_login': ['when did', 'last login'],
        'get_login_history': ['login history', 'show login history'],
        'get_logins_today': ['who logged in today', 'logins today'],
        'get_logins_this_week': ['who logged in this week', 'logins this week'],
        'get_logins_this_month': ['who logged in this month', 'logins this month'],
        'get_recent_logins': ['show recent logins', 'recent logins'],
        'get_last_login_agent': ['who was the last agent to login', 'last agent to login'],
        'get_total_agents': ['how many total agents', 'total agents'],
        'count_agents_by_nationality': ['how many agents are from', 'count agents from'],
        'count_agents_by_company': ['how many agents does', 'agents does have'],
        'count_logins_today': ['how many agents logged in today'],
        'count_never_logged_in': ['how many agents have never logged in', 'never logged in'],
        'count_total_companies': ['how many companies', 'total companies'],
        'get_all_companies': ['list all companies', 'show all companies'],
        'get_company_establishment': ['establishment date of', 'when was established'],
        'get_oldest_company': ['which company was established first', 'oldest company'],
        'get_inactive_agents': ['which agents have not logged in', 'inactive agents'],
        'get_agents_never_logged_in': ['agents registered but never logged in', 'never logged in'],
        'search_agent': ['search agent', 'find agent'],
        'get_agents_by_email_domain': ['find all agents with gmail', 'agents with'],
        'get_agents_with_gmail': ['find all agents with gmail', 'agents with gmail'],
        'search_agents_name_starts_with': ['agents whose name starts with', 'name starts with'],
        'search_company_contains': ['company name contains', 'contains'],
        'find_agent_id_by_name': ['find agent id for', 'agent id for'],
        'get_agents_by_date': ['show agents created', 'agents created'],
        'get_logins_by_date': ['show logins in', 'logged in between']
    };

    const intentNames = intents.map(i => i.intent).join(', ');

    const exampleText = Object.entries(intentExamples)
        .map(([intent, examples]) => `${intent}: ${examples.join(', ')}`)
        .join('\n');

    const prompt = `You are an intent classifier for a chatbot that answers questions about agents and login data.

Classify this user message into ONE of these intents. Respond with ONLY the intent name.

Intent Examples:
${exampleText}

Available intents: ${intentNames}

Rules:
- For questions about specific agents (by name, email, ID): use get_agent_details
- For "what company does X work for": use get_agent_company  
- For "nationality of X": use get_agent_nationality
- For "agents from [country]": use get_agents_by_nationality
- For "agents of [company]": use get_agents_by_company
- For counting questions: use count_ intents
- For search/find questions: use search_ intents
- For login activity: use get_logins_ or get_login_ intents
- Handle spelling mistakes and variations

User message: "${userMessage}"

Intent:`;

    try {
        const response = await axios.post(`${ollamaConfig.url}/api/generate`, {
            model: ollamaConfig.model,
            prompt,
            stream: false,
            options: {
                temperature: 0.1,
                num_predict: 30,
                top_p: 0.9
            }
        });

        let detectedIntent = response.data.response.trim().split('\n')[0].replace(/[^a-z_]/g, '');

        // Fallback logic for common patterns
        if (!intents.find(i => i.intent === detectedIntent)) {
            const message = userMessage.toLowerCase();

            // Specific agent queries
            if (message.includes('details of agent') || (message.includes('who is') && !message.includes('company'))) {
                detectedIntent = 'get_agent_details';
            } else if (message.includes('what company') || message.includes('work for') || message.includes('does') && message.includes('work')) {
                detectedIntent = 'get_agent_company';
            } else if (message.includes('nationality of') || message.includes('what is the nationality')) {
                detectedIntent = 'get_agent_nationality';
            }
            // Location/country queries
            else if ((message.includes('agents from') || message.includes('show all agents from') || message.includes('all agents from')) && !message.includes('company')) {
                detectedIntent = 'get_agents_by_nationality';
            }
            // Company queries
            else if (message.includes('agents of') || message.includes('show agents of') || message.includes('list agents by company') || message.includes('company name')) {
                detectedIntent = 'get_agents_by_company';
            } else if (message.includes('establishment date of') || message.includes('when was') && message.includes('established')) {
                detectedIntent = 'get_company_establishment';
            }
            // Count queries
            else if (message.includes('how many total agents') || message.includes('total agents')) {
                detectedIntent = 'get_total_agents';
            } else if (message.includes('how many companies') || message.includes('total companies')) {
                detectedIntent = 'count_total_companies';
            } else if (message.includes('how many agents are from') || message.includes('count agents from')) {
                detectedIntent = 'count_agents_by_nationality';
            } else if (message.includes('how many agents does') && message.includes('have')) {
                detectedIntent = 'count_agents_by_company';
            }
            // Login queries
            else if (message.includes('when did') && message.includes('last login')) {
                detectedIntent = 'get_agent_last_login';
            } else if (message.includes('who logged in today') || message.includes('logins today')) {
                detectedIntent = 'get_logins_today';
            } else if (message.includes('who logged in this week') || message.includes('logins this week')) {
                detectedIntent = 'get_logins_this_week';
            } else if (message.includes('who logged in this month') || message.includes('logins this month')) {
                detectedIntent = 'get_logins_this_month';
            } else if (message.includes('recent logins') || message.includes('show recent logins')) {
                detectedIntent = 'get_recent_logins';
            } else if (message.includes('last agent to login') || message.includes('who was the last')) {
                detectedIntent = 'get_last_login_agent';
            }
            // Search queries
            else if (message.includes('find all agents with gmail') || message.includes('agents with gmail')) {
                detectedIntent = 'get_agents_with_gmail';
            } else if (message.includes('name starts with') || message.includes('whose name starts')) {
                detectedIntent = 'search_agents_name_starts_with';
            } else if (message.includes('company name contains') || message.includes('contains')) {
                detectedIntent = 'search_company_contains';
            } else if (message.includes('find agent id') || message.includes('agent id for')) {
                detectedIntent = 'find_agent_id_by_name';
            }
            // Date-based queries
            else if (message.includes('agents created') || message.includes('show agents created')) {
                detectedIntent = 'get_agents_by_date';
            } else if (message.includes('logged in between') || message.includes('logins in')) {
                detectedIntent = 'get_logins_by_date';
            }
            // Inactive agents
            else if (message.includes('not logged in') || message.includes('inactive agents')) {
                detectedIntent = 'get_inactive_agents';
            } else if (message.includes('never logged in')) {
                detectedIntent = 'get_agents_never_logged_in';
            }
            // General search fallback
            else {
                detectedIntent = 'search_agent';
            }
        }

        return detectedIntent;
    } catch (error) {
        console.error('Ollama error:', error.message);
        // Fallback intent detection
        return 'search_agent';
    }
};
