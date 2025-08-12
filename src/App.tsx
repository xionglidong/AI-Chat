import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Code, Lightbulb, HelpCircle, MessageSquare, Clock, AlertCircle, CheckCircle, Brain, Zap, Star, Heart, ThumbsUp, BookOpen, Target, Shield, Rocket, Palette, Music, Camera, Gamepad2, Coffee, Pizza, Sun, Moon, Cloud, Fire, Leaf, Flower } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// AI回答增强组件
const EnhancedAIMessage: React.FC<{ content: string }> = ({ content }) => {
  // 检测内容类型并添加相应的图标和表情
  const getMessageEnhancement = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // 代码相关
    if (lowerText.includes('代码') || lowerText.includes('function') || lowerText.includes('const') || lowerText.includes('var') || lowerText.includes('let')) {
      return { icon: <Code className="w-4 h-4" />, emoji: '💻', prefix: '代码时间！' };
    }
    
    // 学习/教育相关
    if (lowerText.includes('学习') || lowerText.includes('教程') || lowerText.includes('解释') || lowerText.includes('概念')) {
      return { icon: <BookOpen className="w-4 h-4" />, emoji: '📚', prefix: '学习时间！' };
    }
    
    // 创意/设计相关
    if (lowerText.includes('设计') || lowerText.includes('创意') || lowerText.includes('艺术') || lowerText.includes('颜色') || lowerText.includes('布局')) {
      return { icon: <Palette className="w-4 h-4" />, emoji: '🎨', prefix: '创意时间！' };
    }
    
    // 音乐相关
    if (lowerText.includes('音乐') || lowerText.includes('歌曲') || lowerText.includes('旋律') || lowerText.includes('节奏')) {
      return { icon: <Music className="w-4 h-4" />, emoji: '🎵', prefix: '音乐时间！' };
    }
    
    // 游戏相关
    if (lowerText.includes('游戏') || lowerText.includes('玩家') || lowerText.includes('关卡') || lowerText.includes('得分')) {
      return { icon: <Gamepad2 className="w-4 h-4" />, emoji: '🎮', prefix: '游戏时间！' };
    }
    
    // 食物相关
    if (lowerText.includes('食物') || lowerText.includes('美食') || lowerText.includes('烹饪') || lowerText.includes('食谱')) {
      return { icon: <Pizza className="w-4 h-4" />, emoji: '🍕', prefix: '美食时间！' };
    }
    
    // 天气相关
    if (lowerText.includes('天气') || lowerText.includes('温度') || lowerText.includes('下雨') || lowerText.includes('晴天')) {
      return { icon: <Sun className="w-4 h-4" />, emoji: '☀️', prefix: '天气时间！' };
    }
    
    // 成功/完成相关
    if (lowerText.includes('成功') || lowerText.includes('完成') || lowerText.includes('搞定') || lowerText.includes('完美')) {
      return { icon: <CheckCircle className="w-4 h-4" />, emoji: '✅', prefix: '太棒了！' };
    }
    
    // 问题解决相关
    if (lowerText.includes('问题') || lowerText.includes('解决') || lowerText.includes('修复') || lowerText.includes('错误')) {
      return { icon: <Target className="w-4 h-4" />, emoji: '🎯', prefix: '问题解决！' };
    }
    
    // 安全/保护相关
    if (lowerText.includes('安全') || lowerText.includes('保护') || lowerText.includes('隐私') || lowerText.includes('加密')) {
      return { icon: <Shield className="w-4 h-4" />, emoji: '🛡️', prefix: '安全提醒！' };
    }
    
    // 创新/突破相关
    if (lowerText.includes('创新') || lowerText.includes('突破') || lowerText.includes('新想法') || lowerText.includes('革命性')) {
      return { icon: <Rocket className="w-4 h-4" />, emoji: '🚀', prefix: '创新突破！' };
    }
    
    // 智能/AI相关
    if (lowerText.includes('智能') || lowerText.includes('ai') || lowerText.includes('机器学习') || lowerText.includes('算法')) {
      return { icon: <Brain className="w-4 h-4" />, emoji: '🧠', prefix: '智能分析！' };
    }
    
    // 能量/动力相关
    if (lowerText.includes('能量') || lowerText.includes('动力') || lowerText.includes('激情') || lowerText.includes('活力')) {
      return { icon: <Zap className="w-4 h-4" />, emoji: '⚡', prefix: '充满能量！' };
    }
    
    // 默认情况
    return { icon: <Lightbulb className="w-4 h-4" />, emoji: '💡', prefix: '好想法！' };
  };

  const enhancement = getMessageEnhancement(content);

  return (
    <div className="space-y-2">
      {/* 增强头部 */}
      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
        {enhancement.icon}
        <span>{enhancement.prefix}</span>
        <span className="text-lg">{enhancement.emoji}</span>
      </div>
      
      {/* Markdown内容 */}
      <MarkdownMessage content={content} isUser={false} />
    </div>
  );
};

// Markdown渲染组件
const MarkdownMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      className={`markdown-content ${isUser ? 'user-markdown' : 'assistant-markdown'}`}
      components={{
        // 代码块样式
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline ? (
            <div className="my-3">
              <div className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm">
                <Code className="w-4 h-4" />
                <span>{match ? match[1] : '代码'}</span>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        },
        // 链接样式
        a: ({ children, href }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
          >
            {children}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ),
        // 表格样式
        table: ({ children }) => (
          <div className="my-4">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-t-lg text-sm font-medium text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>数据表格</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-b-lg">
                {children}
              </table>
            </div>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-300 px-4 py-2">
            {children}
          </td>
        ),
        // 列表样式
        ul: ({ children }) => (
          <ul className="list-none my-2 space-y-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-none my-2 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => {
          return <li>{children}</li>;
        },
        // 引用样式
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 my-3 italic bg-blue-50 py-2 rounded-r flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div>{children}</div>
          </blockquote>
        ),
        // 标题样式
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold my-4 text-gray-800 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold my-3 text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold my-2 text-gray-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            {children}
          </h3>
        ),
        // 段落样式 - 添加表情支持
        p: ({ children }) => {
          const text = children?.toString() || '';
          const lowerText = text.toLowerCase();
          
          let emoji = '';
          if (lowerText.includes('成功') || lowerText.includes('完成')) emoji = '🎉';
          else if (lowerText.includes('错误') || lowerText.includes('问题')) emoji = '⚠️';
          else if (lowerText.includes('重要') || lowerText.includes('注意')) emoji = '💡';
          else if (lowerText.includes('喜欢') || lowerText.includes('爱')) emoji = '❤️';
          else if (lowerText.includes('谢谢') || lowerText.includes('感谢')) emoji = '🙏';
          else if (lowerText.includes('加油') || lowerText.includes('努力')) emoji = '💪';
          else if (lowerText.includes('开心') || lowerText.includes('快乐')) emoji = '😊';
          else if (lowerText.includes('惊讶') || lowerText.includes('神奇')) emoji = '🤯';
          else if (lowerText.includes('时间') || lowerText.includes('等待')) emoji = '⏰';
          else if (lowerText.includes('金钱') || lowerText.includes('价格')) emoji = '💰';
          
          return (
            <p className="text-sm leading-relaxed mb-3">
              {emoji && <span className="mr-2">{emoji}</span>}
              {children}
            </p>
          );
        },
        
        // 分割线样式
        hr: () => (
          <hr className="my-4 border-gray-300" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 你好！我是你的AI助手，有什么可以帮助你的吗？

我可以帮助你：
- **编写代码** 💻 - 支持多种编程语言
- **解释概念** 💡 - 用简单易懂的方式说明
- **解决问题** 🔧 - 分析并提供解决方案
- **创意写作** ✨ - 帮助创作各种内容
- **学习指导** 📚 - 提供学习建议和方法
- **技术咨询** 🛠️ - 解答技术问题

🎯 试试问我一些问题吧！`,
      timestamp: Date.now() - 60000
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    
    // 保持输入框焦点
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    
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
          { role: 'assistant', content: `😔 **错误**: ${txt}`, timestamp: Date.now() },
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
        { role: 'assistant', content: `😅 **请求异常**: ${e.message}`, timestamp: Date.now() },
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
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI 智能助手</h1>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <Code className="w-4 h-4" />
              </p>
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
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        <EnhancedAIMessage content={msg.content} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Timestamp */}
                <p className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${
                  msg.role === 'user' ? 'text-right justify-end' : 'text-left'
                }`}>
                  <Clock className="w-3 h-3" />
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
                                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-500">🤔 AI 正在思考中...</span>
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
              <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
                <MessageSquare className="w-5 h-5" />
              </div>
              <textarea
                ref={inputRef}
                rows={1}
                className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-400 shadow-lg text-gray-800"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                disabled={loading}
                placeholder="💬 输入你的问题..."
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
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
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

        /* Markdown 样式 */
        .markdown-content {
          line-height: 1.6;
        }

        .markdown-content p {
          margin-bottom: 0.75rem;
        }

        .markdown-content p:last-child {
          margin-bottom: 0;
        }

        .markdown-content strong {
          font-weight: 600;
        }

        .markdown-content em {
          font-style: italic;
        }

        .markdown-content code {
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        }

        .markdown-content pre {
          margin: 1rem 0;
        }

        .markdown-content pre code {
          font-size: 0.875rem;
        }

        .markdown-content ul, .markdown-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        .markdown-content li {
          margin: 0.25rem 0;
        }

        .markdown-content blockquote {
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          border-left: 4px solid #3b82f6;
          background-color: #eff6ff;
          border-radius: 0.375rem;
        }

        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin: 1rem 0 0.5rem 0;
          font-weight: 600;
          line-height: 1.25;
        }

        .markdown-content h1 {
          font-size: 1.5rem;
        }

        .markdown-content h2 {
          font-size: 1.25rem;
        }

        .markdown-content h3 {
          font-size: 1.125rem;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .markdown-content th,
        .markdown-content td {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          text-align: left;
        }

        .markdown-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }

        .markdown-content a {
          color: #2563eb;
          text-decoration: underline;
        }

        .markdown-content a:hover {
          color: #1d4ed8;
        }

        /* 用户消息的 Markdown 样式调整 */
        .user-markdown {
          color: white;
        }

        .user-markdown a {
          color: #93c5fd;
        }

        .user-markdown a:hover {
          color: #dbeafe;
        }

        .user-markdown code {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .user-markdown blockquote {
          background-color: rgba(255, 255, 255, 0.1);
          border-left-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}