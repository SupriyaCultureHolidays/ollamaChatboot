export const extractParameters = (userMessage) => {
    const params = {};
    
    // Extract pagination
    const pageMatch = userMessage.match(/page\s+(\d+)/i);
    if (pageMatch) params.page = parseInt(pageMatch[1]);
    
    const limitMatch = userMessage.match(/(?:show|first|next)\s+(\d+)/i);
    if (limitMatch) params.limit = parseInt(limitMatch[1]);
    
    if (userMessage.match(/\b(next|more)\b/i)) params.nextPage = true;
    if (userMessage.match(/\b(prev|previous|back)\b/i)) params.prevPage = true;
    
    // Extract email - highest priority
    const emailMatch = userMessage.match(/([\w.-]+@[\w.-]+\.\w+)/);
    if (emailMatch) {
        params.param = emailMatch[1];
        return params;
    }
    
    // Extract Agent ID - second priority
    const agentIdMatch = userMessage.match(/\b([A-Z]{2,}\d+)\b/);
    if (agentIdMatch) {
        params.param = agentIdMatch[1];
        return params;
    }
    
    // Extract quoted strings - third priority
    const quotedMatch = userMessage.match(/["']([^"']+)["']/);
    if (quotedMatch) {
        params.param = quotedMatch[1];
        return params;
    }
    
    // Enhanced name extraction patterns
    const namePatterns = [
        /\bname\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i,
        /\bfind agent\s+(?:by\s+name\s+)?([A-Za-z]+(?:\s+[A-Za-z]+)*)/i,
        /\bdetails of agent\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i,
        /\bnationality of\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i,
        /\bdoes\s+([A-Za-z]+)\s+work/i,
        /\bwho is\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i,
        /\bfind\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)(?:\s|$)/i,
        /\bsearch\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)(?:\s|$)/i,
        /\bagent\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)(?:\s|$)/i
    ];
    
    for (const pattern of namePatterns) {
        const match = userMessage.match(pattern);
        if (match) {
            params.param = match[1].trim();
            return params;
        }
    }
    
    // Extract country/location after "from"
    const fromMatch = userMessage.match(/\bfrom\s+([A-Za-z]+(?:\s+[A-Za-z]+)*?)(?:\s*$|\s+\w)/i);
    if (fromMatch) {
        params.param = fromMatch[1].trim();
        return params;
    }
    
    // Enhanced company name patterns
    const companyPatterns = [
        /\bcompany name\s+([A-Za-z\s&.-]+?)(?:\s*$|\?)/i,
        /\bestablishment date of\s+([A-Za-z\s&.-]+?)(?:\s*$|\?)/i,
        /\bwhen was\s+([A-Za-z\s&.-]+?)\s+(?:agent created|established)/i,
        /\bagents of\s+([A-Za-z\s&.-]+?)(?:\s+company)?(?:\s*$|\?)/i,
        /\bcompany\s+([A-Za-z\s&.-]+?)(?:\s*$|\?)/i,
        /\bshow agents of\s+([A-Za-z\s&.-]+?)(?:\s*$|\?)/i,
        /\bhow many agents does\s+([A-Za-z\s&.-]+?)\s+have/i,
        /\blist agents by company\s+([A-Za-z\s&.-]+?)(?:\s*$|\?)/i
    ];
    
    for (const pattern of companyPatterns) {
        const match = userMessage.match(pattern);
        if (match) {
            params.param = match[1].trim();
            return params;
        }
    }
    
    // Extract email domain patterns
    const domainMatch = userMessage.match(/\bwith\s+(gmail|yahoo|hotmail|outlook)\b/i);
    if (domainMatch) {
        params.param = domainMatch[1].toLowerCase();
        return params;
    }
    
    // Extract name starting patterns
    const startsWithMatch = userMessage.match(/\bstarts with\s+([A-Za-z])\b/i);
    if (startsWithMatch) {
        params.param = startsWithMatch[1].toUpperCase();
        return params;
    }
    
    // Extract "contains" patterns
    const containsMatch = userMessage.match(/\bcontains\s+([A-Za-z]+)/i);
    if (containsMatch) {
        params.param = containsMatch[1];
        return params;
    }
    
    // Enhanced date and time handling
    if (userMessage.match(/\btoday\b/i)) {
        const today = new Date();
        params.startDate = new Date(today.setHours(0,0,0,0)).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/\bthis week\b/i)) {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        params.startDate = weekStart.toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/\bthis month\b/i)) {
        const now = new Date();
        params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        params.endDate = new Date().toISOString();
    }
    if (userMessage.match(/\bthis year\b/i)) {
        const now = new Date();
        params.startDate = new Date(now.getFullYear(), 0, 1).toISOString();
        params.endDate = new Date().toISOString();
    }
    
    // Specific month and year patterns
    const monthYearMatch = userMessage.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i);
    if (monthYearMatch) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const monthIndex = months.findIndex(m => m.toLowerCase() === monthYearMatch[1].toLowerCase());
        const year = parseInt(monthYearMatch[2]);
        params.startDate = new Date(year, monthIndex, 1).toISOString();
        params.endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59).toISOString();
    }
    
    // Date range patterns
    const dateRangeMatch = userMessage.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)\s+to\s+(\d{1,2})(?:st|nd|rd|th)?\s+(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)/i);
    if (dateRangeMatch) {
        const months = {'jan':0,'january':0,'feb':1,'february':1,'mar':2,'march':2,'apr':3,'april':3,'may':4,'jun':5,'june':5,'jul':6,'july':6,'aug':7,'august':7,'sep':8,'september':8,'oct':9,'october':9,'nov':10,'november':10,'dec':11,'december':11};
        const startDay = parseInt(dateRangeMatch[1]);
        const startMonth = months[dateRangeMatch[2].toLowerCase()];
        const endDay = parseInt(dateRangeMatch[3]);
        const endMonth = months[dateRangeMatch[4].toLowerCase()];
        const currentYear = new Date().getFullYear();
        params.startDate = new Date(currentYear, startMonth, startDay).toISOString();
        params.endDate = new Date(currentYear, endMonth, endDay, 23, 59, 59).toISOString();
    }
    
    // Extract years and date comparisons
    const yearMatch = userMessage.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        if (userMessage.match(/\b(before|prior to)\b/i)) {
            params.endDate = new Date(year, 0, 1).toISOString();
        } else if (userMessage.match(/\b(after|since)\b/i)) {
            params.startDate = new Date(year, 11, 31, 23, 59, 59).toISOString();
        } else {
            params.startDate = new Date(year, 0, 1).toISOString();
            params.endDate = new Date(year, 11, 31, 23, 59, 59).toISOString();
        }
        params.year = year;
    }
    
    // Inactive periods
    const dayMatch = userMessage.match(/(\d+)\s+days?/i);
    if (dayMatch) {
        params.dateThreshold = new Date(Date.now() - parseInt(dayMatch[1]) * 24 * 60 * 60 * 1000).toISOString();
    }
    const monthMatch = userMessage.match(/(\d+)\s+months?/i);
    if (monthMatch) {
        params.dateThreshold = new Date(Date.now() - parseInt(monthMatch[1]) * 30 * 24 * 60 * 60 * 1000).toISOString();
    }
    const yearInactiveMatch = userMessage.match(/(\d+)\s+years?/i);
    if (yearInactiveMatch) {
        params.dateThreshold = new Date(Date.now() - parseInt(yearInactiveMatch[1]) * 365 * 24 * 60 * 60 * 1000).toISOString();
    }
    
    // Extract standalone names (single word queries) - moved to end
    if (!params.param && !params.startDate && !params.endDate && !params.dateThreshold) {
        const standaloneMatch = userMessage.match(/^\s*([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*$/);
        if (standaloneMatch) {
            params.param = standaloneMatch[1].trim();
        }
    }
    
    return params;
};
