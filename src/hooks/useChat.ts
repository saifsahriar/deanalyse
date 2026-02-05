import { useState, useCallback } from 'react';
import type { Message } from '../components/chat/MessageBubble';
import { sendChatQuery } from '../lib/api';

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm your AI business analyst. Ask me anything like:\n• 'Show me my key business insights'\n• 'What are my top selling products?'\n• 'How is my revenue trending?'",
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(async (content: string) => {
        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const responseText = await sendChatQuery(content);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to the server. Please ensure the backend is running.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }

    }, []);

    const clearHistory = useCallback(() => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: "Hi! I'm your AI business analyst. Ask me anything like:\n• 'Show me my key business insights'\n• 'What are my top selling products?'\n• 'How is my revenue trending?'",
                timestamp: new Date()
            }
        ]);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        clearHistory
    };
}
