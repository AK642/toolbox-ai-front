"use client";
import { randomUUID } from "crypto";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatWindowProps {
  tool: string;
  conversationId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ tool, conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load messages for this conversation
    const saved = localStorage.getItem(`messages_${conversationId || tool}`);
    if (saved) {
      setMessages(JSON.parse(saved).map((msg: { id: string; content: string; sender: 'user' | 'ai'; timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      setMessages([]);
    }
  }, [conversationId, tool]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem(`messages_${conversationId || tool}`, JSON.stringify(newMessages));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/ai-tool/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, toolId: tool })
      });
      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data?.data?.response || 'No response from AI.',
        sender: 'ai',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (err) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Failed to get response from AI tool.',
        sender: 'ai',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(35,36,74,0.5)', borderRadius: 12, padding: 24, minHeight: 0 }}>
        {messages.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 40 }}>
            Start a new conversation with the {tool} AI
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 16
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    background: message.sender === 'user' ? 'var(--color-primary)' : 'rgba(35,36,74,0.8)',
                    color: message.sender === 'user' ? '#fff' : 'var(--color-text)',
                    fontSize: 14,
                    lineHeight: 1.4
                  }}
                >
                  <div>{message.content}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 12,
                  background: 'rgba(35,36,74,0.8)',
                  color: 'var(--color-text-secondary)',
                  fontSize: 14
                }}>
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, padding: '1rem', flexShrink: 0 }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..." 
          // disabled={!conversationId}
          style={{ 
            flex: 1, 
            borderRadius: 8, 
            border: '1px solid var(--color-border)', 
            padding: '0.75rem 1rem', 
            fontSize: 16, 
            background: 'rgba(24,25,42,0.9)', 
            color: 'var(--color-text)',
            opacity: conversationId ? 1 : 0.5
          }} 
        />
        <button 
          type="submit" 
          // disabled={!conversationId || !inputValue.trim()}
          disabled={!inputValue.trim()}
          style={{ 
            background: conversationId && inputValue.trim() ? 'var(--color-primary)' : 'var(--color-border)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            padding: '0.75rem 1.5rem', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            opacity: inputValue.trim() ? 1 : 0.5
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow; 