import { useEffect, useRef } from 'react';
import { MessageBubble, type Message } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <p>No messages yet.</p>
                </div>
            )}

            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && <TypingIndicator />}

            <div ref={bottomRef} className="h-1" />
        </div>
    );
}
