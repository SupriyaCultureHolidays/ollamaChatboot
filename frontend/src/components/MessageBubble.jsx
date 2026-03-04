import DataTable from "./DataTable";

export default function MessageBubble({ message, onPageChange }) {
    return (
        <div className={`message ${message.sender}`}>
            <div className="bubble">{message.text}</div>
            {message.data && (
                <DataTable 
                    data={message.data} 
                    pagination={message.pagination}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
