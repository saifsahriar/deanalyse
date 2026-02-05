import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
    return (
        <div className="flex w-full mb-6 justify-start animate-fade-in">
            <div className="flex flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 mr-3 bg-indigo-100 text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>
    );
}
