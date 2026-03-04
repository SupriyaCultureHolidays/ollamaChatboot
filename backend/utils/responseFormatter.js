export const formatResult = (result) => {
    if (typeof result === "number") return result;
    if (Array.isArray(result) && result.length === 0) return "No results found";
    if (Array.isArray(result) && typeof result[0] === "string") return result.join(", ");
    return result;
};
