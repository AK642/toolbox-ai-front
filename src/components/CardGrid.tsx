import React from "react";
import Card from "./Card";

interface CardData {
  icon: React.ReactNode;
  title: string;
  badge?: string | number;
  description?: string;
  tool: string;
}

interface CardGridProps {
  cards: CardData[];
  onCardClick?: (tool: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onCardClick }) => (
  <div className="card-grid">
    {cards.map((card, idx) => (
      <Card key={idx} {...card} onClick={() => onCardClick?.(card.tool)} />
    ))}
  </div>
);

export default CardGrid; 