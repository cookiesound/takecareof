import type { CSSProperties, ReactNode } from 'react';
import './GameLayout.scss';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function GameLayout({ children, className = '', style }: Props) {
  return (
    <div className={`game-layout ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
