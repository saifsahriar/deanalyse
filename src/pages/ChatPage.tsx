
import { ChatWindow } from '../components/chat/ChatWindow';
import { Link } from 'react-router-dom';
import { ChatInput } from '../components/chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { Sparkles, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function ChatPage() {
    const { messages, isLoading, sendMessage, clearHistory } = useChat();

    const suggestedQuestions = [
        "What are the top selling products?",
        "Show me the sales trend for last year.",
        "Which region has the lowest performance?",
        "Summarize the key insights."
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto">
            {/* Chat Header */}
            <div className="flex items-center justify-between py-4 border-b border-slate-200 mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">AI Analyst</h1>
                        <p className="text-xs text-slate-500">Ask questions about your data</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/upload">
                        <Button variant="secondary" size="sm">
                            Upload Data
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="text-slate-400 hover:text-red-500"
                        title="Clear Conversation"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
                <ChatWindow messages={messages} isLoading={isLoading} />

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    {/* Suggested Questions */}
                    {messages.length < 3 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(q)}
                                    className="text-xs bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-full transition-colors flex items-center"
                                >
                                    <HelpCircle className="w-3 h-3 mr-1.5 opacity-70" />
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <ChatInput onSend={sendMessage} disabled={isLoading} />

                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-400">
                            AI can make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
