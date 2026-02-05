import { User, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import ReactMarkdown from 'react-markdown';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[80%] md:max-w-[70%]", isUser ? "flex-row-reverse" : "flex-row")}>
                {/* Avatar */}
                <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
                    isUser ? "ml-3 bg-primary-100 text-primary-600" : "mr-3 bg-indigo-100 text-indigo-600"
                )}>
                    {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                    "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                    isUser
                        ? "bg-primary-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                )}>
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    )}
                    <span className={cn(
                        "text-[10px] block mt-1 opacity-70",
                        isUser ? "text-primary-100" : "text-slate-400"
                    )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
}
