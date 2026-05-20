import type { CharacterReaction } from '@/constants/game';
import './Character.scss';

interface Props {
  reaction: CharacterReaction;
  positionX: number;
  walkDirection: 1 | -1;
  onClick: () => void;
}

const REACTION_LABELS: Record<CharacterReaction, string> = {
  idle: '🐰',
  walk: '🐰💨',
  cute: '🐰💕',
  angry: '🐰💢',
  yawn: '🐰😴',
};

export default function Character({
  reaction,
  positionX,
  walkDirection,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      className={`character character--${reaction}`}
      onClick={onClick}
      aria-label="캐릭터와 상호작용"
    >
      <span
        className="character__sprite"
        style={{
          transform: `translateX(${positionX}px) scaleX(${walkDirection})`,
        }}
      >
        {REACTION_LABELS[reaction]}
      </span>
    </button>
  );
}
