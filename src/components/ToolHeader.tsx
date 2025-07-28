"use client";
import React from "react";
import { useRouter } from 'next/navigation';

const toolNames: Record<string, string> = {
  'text-to-speech': 'Text to Speech',
  'image-generator': 'Image Generator',
  'text-summarizer': 'Text Summarizer',
  'language-translator': 'Language Translator',
  'code-assistant': 'Code Assistant',
  'chat-assistant': 'Chat Assistant',
  'music-generator': 'Music Generator',
  'video-editor': 'Video Editor',
  'logo-designer': 'Logo Designer',
  'content-search': 'Content Search',
  'data-analyzer': 'Data Analyzer',
  'schedule-planner': 'Schedule Planner',
  'email-assistant': 'Email Assistant',
  'web-tools': 'Web Tools',
  'ai-brainstorm': 'AI Brainstorm',
  'voice-tools': 'Voice Tools',
  'document-tools': 'Document Tools',
  'favorites': 'Favorites',
};

const ToolHeader = ({ tool }: { tool: string }) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div style={{ padding: '1rem 2rem 0.5rem 2rem', borderBottom: '1px solid var(--color-border)', background: 'rgba(24,25,42,0.85)', position: 'sticky', top: 0, zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={handleBackClick}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: '0.5rem 0.75rem',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          ← Back
        </button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{toolNames[tool] || tool}</h2>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 2 }}>
            Start a conversation with the {toolNames[tool] || tool}.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolHeader; 