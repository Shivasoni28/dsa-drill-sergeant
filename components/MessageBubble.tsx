import React from 'react';
import { Message, Sender } from '../types'
import { User, Terminal, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
          ${isUser ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}
        `}>
          {isUser ? (
            <User className="w-6 h-6 text-white" />
          ) : (
             message.isError ? <AlertTriangle className="w-6 h-6 text-rose-500" /> : <Terminal className="w-6 h-6 text-emerald-500" />
          )}
        </div>

        {/* Bubble */}
        <div className={`
          flex flex-col p-4 rounded-lg shadow-md overflow-hidden
          ${isUser 
            ? 'bg-indigo-600 text-white rounded-tr-none' 
            : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
          }
        `}>
          <div className={`text-sm font-bold mb-1 ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
            {isUser ? 'Student' : 'Instructor'}
          </div>
          
          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 max-w-none text-sm md:text-base">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
          
          <div className={`text-[10px] mt-2 opacity-50 text-right`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;