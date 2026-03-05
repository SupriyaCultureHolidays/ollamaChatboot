import { useState } from "react";

export default function InputBar({ onSend, disabled }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text);
            setText("");
        }
    };

    return (
        <form className="input-bar" onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                placeholder="💬 Ask about agents, logins, companies..."
                disabled={disabled}
            />
            <button type="submit" disabled={disabled || !text.trim()}>
                {disabled ? '⏳' : '🚀'} Send
            </button>
        </form>
    );
}
