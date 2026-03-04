export const extractParameters = (userMessage) => {
    const params = {};
    
    // Extract pagination
    const pageMatch = userMessage.match(/page\s+(\d+)/i);
    if (pageMatch) params.page = parseInt(pageMatch[1]);
    
    const limitMatch = userMessage.match(/(?:show|first|next)\s+(\d+)/i);
    if (limitMatch) params.limit = parseInt(limitMatch[1]);
    
    if (userMessage.match(/\b(next|more)\b/i)) params.nextPage = true;
    if (userMessage.match(/\b(prev|previous|back)\b/i)) params.prevPage = true;
    
    // Extract email
    const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) params.param = emailMatch[0];
    
    // Extract email domain (gmail, yahoo, etc.)
    const domainMatch = userMessage.match(/\b(gmail|yahoo|hotmail|outlook|mail)\b/i);
    if (domainMatch && !emailMatch) params.param = domainMatch[0];
    
    // Extract dates
    const dateMatch = userMessage.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{4})/);
    if (dateMatch) params.startDate = new Date(dateMatch[0]).toISOString();
    
    // Extract common time periods
    if (userMessage.includes("today")) {
        params.startDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.includes("this week")) {
        const now = new Date();
        params.startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.includes("this month")) {
        const now = new Date();
        params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/30 days|month/i)) {
        params.dateThreshold = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    }
    if (userMessage.match(/6 months/i)) {
        params.dateThreshold = new Date(Date.now() - 180*24*60*60*1000).toISOString();
    }
    
    return params;
};
