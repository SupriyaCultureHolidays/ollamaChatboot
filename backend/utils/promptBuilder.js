export const extractParameters = (userMessage) => {
    const params = {};
    
    // Extract email
    const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) params.param = emailMatch[0];
    
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
