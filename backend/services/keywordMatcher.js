export const matchIntentByKeywords = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Agent Details - more flexible patterns
    if ((msg.includes('details') || msg.includes('show me') || msg.includes('who is') || msg.includes('find agent')) && 
        (msg.includes('@') || msg.includes('chagt') || msg.includes('agent'))) {
        return 'get_agent_details';
    }
    
    // Company Questions - simplified
    if ((msg.includes('what company') || msg.includes('work for') || msg.includes('works for')) && 
        !msg.includes('how many')) {
        return 'get_agent_company';
    }
    
    // Nationality Questions
    if (msg.includes('nationality') || (msg.includes('from') && msg.includes('is'))) {
        return 'get_agent_nationality';
    }
    
    // Count Queries
    if (msg.includes('how many')) {
        if (msg.includes('total agents')) return 'get_total_agents';
        if (msg.includes('agents from') || msg.includes('agents are from')) return 'count_agents_by_nationality';
        if (msg.includes('agents does') || msg.includes('agents has')) return 'count_agents_by_company';
        if (msg.includes('logged in today')) return 'count_logins_today';
        if (msg.includes('never logged in')) return 'count_never_logged_in';
        if (msg.includes('companies')) return 'count_total_companies';
    }
    
    // Agents by Country
    if (msg.includes('agents from') || msg.includes('show all agents from')) {
        return 'get_agents_by_nationality';
    }
    
    // Agents by Company - more flexible
    if ((msg.includes('agents') && msg.includes('company')) || 
        msg.includes('list agents by company') || msg.includes('show agents of') ||
        msg.includes('agents by company')) {
        return 'get_agents_by_company';
    }
    
    // Last Login
    if (msg.includes('last login') || (msg.includes('when did') && msg.includes('login'))) {
        return 'get_agent_last_login';
    }
    
    // Login History
    if (msg.includes('login history') || msg.includes('show login')) {
        return 'get_login_history';
    }
    
    // Today's Logins
    if (msg.includes('logged in today') || msg.includes('login today')) {
        return 'get_logins_today';
    }
    
    // This Week's Logins
    if (msg.includes('logged in this week') || msg.includes('login this week')) {
        return 'get_logins_this_week';
    }
    
    // This Month's Logins
    if (msg.includes('logged in this month') || msg.includes('login this month')) {
        return 'get_logins_this_month';
    }
    
    // Date Range Logins
    if ((msg.includes('logged in') || msg.includes('logins in')) && 
        (msg.includes('may') || msg.includes('january') || msg.includes('between'))) {
        return 'get_logins_by_date';
    }
    
    // Recent Logins
    if (msg.includes('recent login') || msg.includes('show recent')) {
        return 'get_recent_logins';
    }
    
    // Last Agent to Login
    if (msg.includes('last agent to login') || msg.includes('who was the last')) {
        return 'get_last_login_agent';
    }
    
    // Inactive Agents
    if ((msg.includes('not logged in') || msg.includes('inactive')) && 
        (msg.includes('30 days') || msg.includes('6 months'))) {
        return 'get_inactive_agents';
    }
    
    // Company Establishment
    if (msg.includes('establishment date') || (msg.includes('when was') && msg.includes('established'))) {
        return 'get_company_establishment';
    }
    
    // Company Agent Created
    if (msg.includes('when was') && msg.includes('agent created')) {
        return 'get_company_agent_created';
    }
    
    // Oldest Company
    if (msg.includes('oldest company') || msg.includes('established first')) {
        return 'get_oldest_company';
    }
    
    // All Companies
    if (msg.includes('list all companies') || msg.includes('all companies registered')) {
        return 'get_all_companies';
    }
    
    // Email Domain Search
    if (msg.includes('with gmail') || msg.includes('with yahoo') || 
        (msg.includes('find') && (msg.includes('gmail') || msg.includes('yahoo')))) {
        return 'get_agents_by_email_domain';
    }
    
    // Name starts with
    if (msg.includes('name starts with') || msg.includes('names starting with')) {
        return 'search_agents_name_starts_with';
    }
    
    // Company contains
    if (msg.includes('company name contains') || msg.includes('companies with')) {
        return 'search_company_contains';
    }
    
    // General Search - more flexible
    if (msg.includes('find agent') || msg.includes('search agent') || 
        (msg.includes('find') && msg.includes('name'))) {
        return 'search_agent';
    }
    
    return null; // No match found, use Ollama
};

// Fix for email domain search
export const fixEmailDomainParam = (param) => {
    if (param === 'gmail') return 'gmail.com';
    if (param === 'yahoo') return 'yahoo.com';
    if (param === 'hotmail') return 'hotmail.com';
    return param;
};