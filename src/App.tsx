import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是你的AI助手，有什么可以帮助你的吗？',
      timestamp: Date.now() - 60000
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'mutation { chat { choices { message { content } } } }',
          variables: {
            model: 'gpt-4o-mini',
            messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
            stream: false,
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `错误: ${txt}`, timestamp: Date.now() },
        ]);
      } else {
        const json = await res.json();
        const content =
          json.data?.choices?.[0]?.message?.content ||
          json.data?.chat?.choices?.[0]?.message?.content ||
          '无响应';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content, timestamp: Date.now() },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `请求异常: ${e.message}`, timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto h-[90vh] flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI 智能助手</h1>
              <p className="text-white/80 text-sm">随时为你提供帮助</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-blue-50/30">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } animate-fade-in`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
              }}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-green-400 to-blue-500'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`relative px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/90 text-gray-800 border border-gray-200/50'
                  }`}
                >
                  {/* Message tail */}
                  <div
                    className={`absolute top-4 w-3 h-3 rotate-45 ${
                      msg.role === 'user'
                        ? 'right-[-6px] bg-purple-600'
                        : 'left-[-6px] bg-white border-l border-b border-gray-200/50'
                    }`}
                  />
                  
                  <div className="relative z-10">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
                
                {/* Timestamp */}
                <p className={`text-xs text-gray-500 mt-1 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-gray-200/30">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                rows={1}
                className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-400 shadow-lg text-gray-800"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                disabled={loading}
                placeholder="输入你的问题..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{ maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}