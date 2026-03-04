export default function DataTable({ data, pagination, onPageChange }) {
    if (!data || data.length === 0) return null;
    
    const keys = Object.keys(data[0]);
    
    return (
        <div className="data-table">
            <table>
                <thead>
                    <tr>{keys.map(k => <th key={k}>{k}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {keys.map(k => <td key={k}>{JSON.stringify(row[k])}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            {pagination && (
                <div className="pagination">
                    <span>Showing {pagination.from}-{pagination.to} of {pagination.total}</span>
                    <div className="pagination-buttons">
                        <button 
                            onClick={() => onPageChange('prev')} 
                            disabled={pagination.page === 1}
                        >
                            ◀ Prev
                        </button>
                        <span>Page {pagination.page} of {pagination.totalPages}</span>
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
