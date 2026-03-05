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
    if (emailMatch) {
        params.param = emailMatch[0];
        return params;
    }
    
    // Extract Agent ID (CHAGT format)
    const agentIdMatch = userMessage.match(/\b(CHAGT\d+)\b/i);
    if (agentIdMatch) {
        params.param = agentIdMatch[1];
        return params;
    }
    
    // Extract name (after "agent", "name", "by name", "of", "find")
    const nameMatch = userMessage.match(/(?:agent|name|by name|find|search|of|for|with name)\s+(?:by\s+name\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
    if (nameMatch) {
        params.param = nameMatch[1].trim();
        return params;
    }
    
    // Extract single letter for "name starts with"
    const startsWithMatch = userMessage.match(/(?:name starts with|names starting with|starts with)\s+([A-Z])/i);
    if (startsWithMatch) {
        params.param = startsWithMatch[1];
        return params;
    }
    
    // Extract company name (quoted, after "company", or capitalized multi-word)
    const companyQuotedMatch = userMessage.match(/["']([^"']+)["']/);
    if (companyQuotedMatch) {
        params.param = companyQuotedMatch[1];
        return params;
    }
    
    const companyMatch = userMessage.match(/(?:company|of|for|by company)\s+(?:name\s+)?([A-Z][A-Z\s&]+(?:[A-Z][a-z]+)?)/i);
    if (companyMatch) {
        params.param = companyMatch[1].trim();
        return params;
    }
    
    // Extract "travel" for company contains search
    const travelMatch = userMessage.match(/(?:company.*contains|companies.*with)\s+(\w+)/i);
    if (travelMatch) {
        params.param = travelMatch[1];
        return params;
    }
    
    // Extract specific company names from common patterns
    const knownCompanies = [
        "Culture Holidays", "LUXE GRAND TRAVEL", "Travel Chacha", 
        "Gone Again Travel and Tours", "Luxe Grand Travel"
    ];
    for (const company of knownCompanies) {
        if (userMessage.toLowerCase().includes(company.toLowerCase())) {
            params.param = company;
            return params;
        }
    }
    
    // Extract country/nationality
    const countryMatch = userMessage.match(/\b(India|USA|United States|UK|United Kingdom|Canada|Australia|China|Japan|Germany|France|Italy|Spain)\b/i);
    if (countryMatch) {
        params.param = countryMatch[1];
        return params;
    }
    
    // Extract email domain (gmail, yahoo, etc.)
    const domainMatch = userMessage.match(/\b(gmail|yahoo|hotmail|outlook|mail)\b/i);
    if (domainMatch) {
        params.param = domainMatch[0];
        return params;
    }
    
    // Extract month and year (e.g., "May 2022")
    const monthYearMatch = userMessage.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i);
    if (monthYearMatch) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthYearMatch[1].toLowerCase());
        const year = parseInt(monthYearMatch[2]);
        params.startDate = new Date(year, monthIndex, 1).toISOString();
        params.endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59).toISOString();
        return params;
    }
    
    // Extract date range (e.g., "1st Jan to 1st March", "between X and Y")
    const dateRangeMatch = userMessage.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+(\d{4}))?\s+(?:to|and)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+(\d{4}))?/i);
    if (dateRangeMatch) {
        const monthMap = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
        const year1 = dateRangeMatch[3] || new Date().getFullYear();
        const year2 = dateRangeMatch[6] || year1;
        params.startDate = new Date(year1, monthMap[dateRangeMatch[2].toLowerCase().slice(0,3)], parseInt(dateRangeMatch[1])).toISOString();
        params.endDate = new Date(year2, monthMap[dateRangeMatch[5].toLowerCase().slice(0,3)], parseInt(dateRangeMatch[4]), 23, 59, 59).toISOString();
        return params;
    }
    
    // Extract common time periods
    if (userMessage.match(/\btoday\b/i)) {
        params.startDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/\bthis week\b/i)) {
        const now = new Date();
        params.startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/\bthis month\b/i)) {
        const now = new Date();
        params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/30 days|\bmonth\b/i) && !userMessage.match(/this month/i)) {
        params.dateThreshold = new Date(Date.now() - 30*24*60*60*1000).toISOString();
    }
    if (userMessage.match(/6 months/i)) {
        params.dateThreshold = new Date(Date.now() - 180*24*60*60*1000).toISOString();
    }
    
    return params;
};
