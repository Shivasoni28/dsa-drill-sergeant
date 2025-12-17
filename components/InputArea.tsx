import React, { useState, useRef, useEffect } from 'react';
import { Send, Code2, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-4 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
          <div className="p-2 text-slate-500">
            <Code2 className="w-5 h-5" />
          </div>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a DSA question (e.g., 'How does QuickSort work?')..."
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none py-2 min-h-[44px] max-h-[120px] font-mono text-sm"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              p-2 rounded-lg flex-shrink-0 transition-colors duration-200
              ${!input.trim() || isLoading 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
              }
            `}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Strict Mode Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;