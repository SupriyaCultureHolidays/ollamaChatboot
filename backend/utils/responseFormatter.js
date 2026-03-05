export const formatResult = (result, template, params = {}) => {
    if (!result) return "No results found.";
    
    // Paginated result
    if (result.pagination) {
        const { from, to, total } = result.pagination;
        if (result.data.length === 0) return "No results found.";
        return `Showing ${from}-${to} of ${total} results.`;
    }
    
    // Count with template
    if (typeof result === "number" && template) {
        let formatted = template.replace("{count}", result);
        if (params.param) {
            formatted = formatted.replace("{param}", params.param);
        }
        return formatted;
    }
    
    // Count without template
    if (typeof result === "number") {
        return `Found ${result} results.`;
    }
    
    // Array of strings (distinct)
    if (Array.isArray(result) && typeof result[0] === "string") {
        return template.replace("{count}", result.length).replace("{list}", result.join(", "));
    }
    
    // Empty array
    if (Array.isArray(result) && result.length === 0) {
        return "No results found.";
    }
    
    // Single object template - take first result from array
    if (Array.isArray(result) && result.length > 0 && template === "single") {
        return Object.entries(result[0])
            .filter(([key]) => !key.startsWith('_'))
            .map(([key, value]) => {
                const label = key.replace(/_/g, ' ');
                const val = value instanceof Date ? value.toLocaleDateString() : value;
                return `${label}: ${val}`;
            })
            .join('\n');
    }
    
    // Array with single object - extract it and format
    if (Array.isArray(result) && result.length === 1 && template && template !== "list" && template !== "single") {
        return fillTemplate(template, result[0]);
    }
    
    // Array with multiple objects but has template - use first one
    if (Array.isArray(result) && result.length > 1 && template && template !== "list" && template !== "single") {
        return fillTemplate(template, result[0]);
    }
    
    // Single object with template
    if (!Array.isArray(result) && typeof result === "object" && template && template !== "single") {
        return fillTemplate(template, result);
    }
    
    // Single object without template (template === "single")
    if (!Array.isArray(result) && typeof result === "object" && template === "single") {
        return Object.entries(result)
            .filter(([key]) => !key.startsWith('_'))
            .map(([key, value]) => {
                const label = key.replace(/_/g, ' ');
                const val = value instanceof Date ? value.toLocaleDateString() : value;
                return `${label}: ${val}`;
            })
            .join('\n');
    }
    
    // Array of objects (list)
    if (Array.isArray(result) && template === "list") {
        return result;
    }
    
    return result;
};

const fillTemplate = (template, data) => {
    return template.replace(/{(\w+)}/g, (_, key) => {
        const value = data[key];
        if (value instanceof Date) return value.toLocaleDateString();
        return value || "";
    });
};
