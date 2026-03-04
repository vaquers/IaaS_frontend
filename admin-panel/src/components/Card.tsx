import { type ReactNode } from 'react';
import { cardTitleStyle } from '../theme';

interface CardProps {
  title?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({ title, children, style, className = '' }: CardProps) {
  return (
    <div className={`app-card ${className}`} style={style}>
      {title && <h2 style={cardTitleStyle}>{title}</h2>}
      <div style={{ color: 'var(--text-primary)', fontSize: 15 }}>{children}</div>
    </div>
  );
}
