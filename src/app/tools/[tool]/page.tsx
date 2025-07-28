"use client";
import React, { useState } from "react";
import ToolHeader from '../../../components/ToolHeader';
import ChatWindow from '../../../components/ChatWindow';
import ChatSidebar from '../../../components/ChatSidebar';
import { useParams } from 'next/navigation';

export default function ToolPage() {
  const params = useParams();
  const tool = Array.isArray(params?.tool) ? params.tool[0] : params?.tool || '';
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <ToolHeader tool={tool} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatWindow tool={tool} conversationId={currentConversationId} />
      </div>
    </div>
  );
} 