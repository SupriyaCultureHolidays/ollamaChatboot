import DataTable from "./DataTable";

export default function MessageBubble({ message }) {
    return (
        <div className={`message ${message.sender}`}>
            <div className="bubble">{message.text}</div>
            {message.data && <DataTable data={message.data} />}
        </div>
    );
}
