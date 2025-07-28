"use client";

import Header from '../components/Header';
import CardGrid from '../components/CardGrid';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { useEffect, useState } from 'react';
import { aiService } from '../services';

interface ToolCard {
  icon: string;
  title: string;
  badge?: string | number;
  tool: string;
}

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [cards, setCards] = useState<ToolCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    aiService.getTools()
      .then((tools) => {
        if (!isMounted) return;
        // Map backend model to CardGrid props
        setCards(
          tools
            .filter((tool) => tool.isActive && !tool.isDeleted)
            .map((tool) => ({
              icon: tool.icon,
              title: tool.name,
              badge: tool.badge,
              tool: tool.tool,
            }))
        );
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError('Failed to load AI tools.');
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (tool: string) => {
    router.push(`/tools/${tool}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <ProtectedRoute>
      <main>
        <Header user={user} onLogout={handleLogout} />
        <div style={{ textAlign: 'center', margin: '2rem 0 1.5rem 0' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, color: 'var(--color-primary)' }}>AI Tools Hub</h1>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>
            Choose from our collection of powerful AI tools to enhance your productivity
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 18, margin: '2rem 0' }}>Loading tools...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ef4444', fontSize: 18, margin: '2rem 0' }}>{error}</div>
        ) : (
          <CardGrid cards={cards} onCardClick={handleCardClick} />
        )}
      </main>
    </ProtectedRoute>
  );
}
