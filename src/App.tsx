import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem('chatMessages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 本地缓存聊天记录
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
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
    <div
      style={{
        maxWidth: 760,
        margin: 'auto',
        padding: 20,
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>
        Cloudflare Pages + React + OpenAI Chat
      </h1>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 12px',
          marginBottom: 12,
          backgroundColor: '#f9f9f9',
          borderRadius: 6,
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              margin: '8px 0',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#e5e5ea',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: '10px 14px',
                borderRadius: 18,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 16,
                boxShadow:
                  msg.role === 'user'
                    ? '0 1px 3px rgba(0, 123, 255, 0.4)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {msg.content}
              </ReactMarkdown>
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#666',
                marginTop: 2,
                userSelect: 'none',
              }}
            >
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex' }}>
        <textarea
          rows={2}
          style={{
            flex: 1,
            fontSize: 16,
            padding: 8,
            borderRadius: 6,
            border: '1px solid #ccc',
            resize: 'none',
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="输入你的问题..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          style={{
            marginLeft: 8,
            padding: '0 20px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}
