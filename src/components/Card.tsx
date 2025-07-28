// import Image from "next/image";
import React from "react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  badge?: string | number;
  description?: string;
  tool: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ icon, title, badge, description, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <img className="card-icon" alt="icon" src={icon as string} width={75} height={75}></img>
    <div className="card-title">{title}</div>
    {description && <div className="card-description">{description}</div>}
    {badge && <div className="card-badge">{badge}</div>}
  </div>
);

export default Card; 