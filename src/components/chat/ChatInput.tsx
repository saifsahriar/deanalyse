import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { Send, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    return (
        <div className="relative flex items-end gap-2 bg-white rounded-xl border border-slate-300 shadow-sm p-2 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all">
            {/* Upload button placeholder for future phases */}
            <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-600 rounded-lg flex-shrink-0 mb-0.5 px-2"
                disabled={disabled}
            >
                <Upload className="w-5 h-5" />
            </Button>

            <div className="flex-1 min-w-0">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about your data..."
                    disabled={disabled}
                    rows={1}
                    className="w-full resize-none border-0 bg-transparent py-3 px-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6 max-h-[120px] overflow-y-auto"
                />
            </div>

            <Button
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                size="sm"
                className="flex-shrink-0 mb-1 rounded-lg px-3"
            >
                <Send className="w-4 h-4" />
            </Button>
        </div>
    );
}
