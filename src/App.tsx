import React, { useState, useRef, useEffect } from "react";
import { Terminal, Cpu, Info } from 'lucide-react';
import { Message, Sender } from "../types"
import { sendMessageToGemini } from '../services/geminiService';
import MessageBubble from '../components/MessageBubble';
import InputArea from '../components/InputArea';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  text: "# DSA INSTRUCTOR v2.5 \n\nI am here to teach you **Data Structures and Algorithms**. \n\nDo not waste my time with irrelevant chatter. \n\nAsk your question.",
  sender: Sender.BOT,
  timestamp: new Date(),
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Get AI Response
      const responseText = await sendMessageToGemini(text);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.BOT,
        timestamp: new Date(),
        // Simple heuristic: if the bot is rude (short response without code blocks usually), maybe flag it?
        // But let's keep it simple.
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "System Failure: Unable to compute response.",
        sender: Sender.BOT,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <Terminal className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white">DSA Drill Sergeant</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <Cpu className="w-4 h-4" />
            <span>Gemini 2.5 Flash</span>
          </div>
          <Info className="w-5 h-5 hover:text-slate-200 cursor-pointer transition-colors" />
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto w-full pb-4">
             {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start w-full mb-6 animate-pulse">
                <div className="flex max-w-[85%] flex-row gap-3">
                   <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700">
                      <Terminal className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div className="flex flex-col p-4 rounded-lg bg-slate-900 border border-slate-800 rounded-tl-none min-w-[120px]">
                      <div className="text-sm font-bold mb-2 text-slate-500">Instructor</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input Area */}
        <InputArea onSend={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;