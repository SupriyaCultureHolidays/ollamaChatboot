import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "../hooks/useChat";

export default function ChatWindow() {
    const { messages, loading, send } = useChat();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="chat-window">
            <div className="header">
                <h2>🤖 Agent Assistant</h2>
            </div>
            <div className="messages">
                {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
            <InputBar onSend={send} disabled={loading} />
        </div>
    );
}
