export default function DataTable({ data, pagination, onPageChange }) {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    // Handle nested objects (like agentInfo from aggregation)
    const flattenedData = data.map(row => {
        const flat = {};
        Object.keys(row).forEach(key => {
            if (key.startsWith('_')) return;
            if (Array.isArray(row[key]) && row[key].length > 0 && typeof row[key][0] === 'object') {
                // Flatten array of objects (from $lookup)
                Object.assign(flat, row[key][0]);
            } else if (typeof row[key] === 'object' && row[key] !== null && !(row[key] instanceof Date)) {
                // Flatten nested objects
                Object.assign(flat, row[key]);
            } else {
                flat[key] = row[key];
            }
        });
        return flat;
    });
    
    const keys = Object.keys(flattenedData[0]).filter(k => !k.startsWith('_'));
    if (keys.length === 0) return null;
    
    return (
        <div className="data-table">
            <table>
                <thead>
                    <tr>{keys.map(k => <th key={k}>{k.replace(/_/g, ' ')}</th>)}</tr>
                </thead>
                <tbody>
                    {flattenedData.map((row, i) => (
                        <tr key={i}>
                            {keys.map(k => (
                                <td key={k}>
                                    {row[k] instanceof Date 
                                        ? row[k].toLocaleDateString() 
                                        : typeof row[k] === 'object' 
                                        ? JSON.stringify(row[k]) 
                                        : String(row[k] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {pagination && (
                <div className="pagination">
                    <span>📊 Showing {pagination.from}-{pagination.to} of {pagination.total}</span>
                    <div className="pagination-buttons">
                        <button 
                            onClick={() => onPageChange('prev')} 
                            disabled={pagination.page === 1}
                        >
                            ◀ Prev
                        </button>
                        <span>Page {pagination.page}/{pagination.totalPages}</span>
                        <button 
                            onClick={() => onPageChange('next')} 
                            disabled={pagination.page >= pagination.totalPages}
                        >
                            Next ▶
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
