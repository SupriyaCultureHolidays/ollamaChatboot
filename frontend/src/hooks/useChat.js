import { useState } from "react";
import { sendMessage } from "../services/chatApi";

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const send = async (text) => {
        const userMsg = { text, sender: "user", timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        
        setLoading(true);
        try {
            const { reply, data, pagination } = await sendMessage(text);
            const botMsg = { text: reply, sender: "bot", data, pagination, timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = { text: "Sorry, something went wrong.", sender: "bot", timestamp: new Date() };
            setMessages(prev => [...prev, errorMsg]);
        }
        setLoading(false);
    };

    return { messages, loading, send };
};
