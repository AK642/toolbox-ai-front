"use client";
import React, { useState, useEffect } from "react";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  tool: string;
}

interface ChatSidebarProps {
  tool: string;
  onConversationSelect: (conversationId: string) => void;
  currentConversationId?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ tool, onConversationSelect, currentConversationId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Load conversations from localStorage
    const saved = localStorage.getItem(`chat_history_${tool}`);
    if (saved) {
      setConversations(JSON.parse(saved).map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      })));
    }
  }, [tool]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `New conversation`,
      timestamp: new Date(),
      tool
    };
    
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    
    // Save to localStorage
    localStorage.setItem(`chat_history_${tool}`, JSON.stringify(updatedConversations));
    
    // Select the new conversation
    onConversationSelect(newConversation.id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button 
        onClick={createNewConversation}
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          marginBottom: 24,
          width: '100%'
        }}
      >
        + New Conversation
      </button>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, textAlign: 'center', marginTop: 20 }}>
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 8,
                marginBottom: 8,
                cursor: 'pointer',
                background: currentConversationId === conversation.id ? 'rgba(123,63,242,0.15)' : 'transparent',
                border: currentConversationId === conversation.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>
                {conversation.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {formatDate(conversation.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar; 