export const formatResult = (result, template) => {
    if (!result) return "No results found.";
    
    // Paginated result
    if (result.pagination) {
        const { from, to, total } = result.pagination;
        if (result.data.length === 0) return "No results found.";
        return `Showing ${from}-${to} of ${total} results.`;
    }
    
    // Count
    if (typeof result === "number") {
        return template.replace("{count}", result);
    }
    
    // Array of strings (distinct)
    if (Array.isArray(result) && typeof result[0] === "string") {
        return template.replace("{count}", result.length).replace("{list}", result.join(", "));
    }
    
    // Empty array
    if (Array.isArray(result) && result.length === 0) {
        return "No results found.";
    }
    
    // Array with single object - extract it
    if (Array.isArray(result) && result.length === 1 && template !== "list") {
        return fillTemplate(template, result[0]);
    }
    
    // Single object
    if (!Array.isArray(result) && typeof result === "object") {
        if (template === "single") return result;
        return fillTemplate(template, result);
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
