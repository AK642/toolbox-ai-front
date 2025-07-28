import React from "react";
import ThemeToggle from "./ThemeToggle";

interface User {
  name: string;
  email: string;
}

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => (
  <header className="app-header">
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: 32, color: "var(--color-primary)" }}>⚡</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>AI Hub</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Your AI Tools Platform</div>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      {/* Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          <span style={{ fontSize: 18 }}>⚡</span> 125 Credits
        </span>
        <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          <span style={{ fontSize: 18 }}>🔧</span> 18 Tools
        </span>
      </div>
      
      {/* User info */}
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
            Welcome, {user.name}
          </span>
        </div>
      )}
      
      <ThemeToggle />
      
      {/* Logout button */}
      {onLogout && (
        <button
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '0.75rem',
            padding: '0.5rem 1rem',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s'
          }}
        >
          Logout
        </button>
      )}
    </div>
  </header>
);

export default Header; 