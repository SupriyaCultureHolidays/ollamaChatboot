export default function DataTable({ data }) {
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
        </div>
    );
}
