"use client";
import React, { useState } from "react";
import ChatSidebar from "../../components/ChatSidebar";
import { useParams } from 'next/navigation';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const tool = Array.isArray(params?.tool) ? params.tool[0] : params?.tool || '';
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 280, background: 'rgba(24,25,42,0.92)', borderRight: '1px solid var(--color-border)', padding: '2rem 1rem' }}>
        <ChatSidebar 
          tool={tool} 
          onConversationSelect={handleConversationSelect}
          currentConversationId={currentConversationId}
        />
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
} 