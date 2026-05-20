import type { ReactNode } from 'react';
import './GameLayout.scss';

interface Props {
  children: ReactNode;
}

export default function GameLayout({ children }: Props) {
  return <div className="game-layout">{children}</div>;
}
