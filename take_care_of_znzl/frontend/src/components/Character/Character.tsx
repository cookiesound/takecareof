import type { CharacterReaction } from '@/constants/game';
import { ASSETS } from '@/assets';
import './Character.scss';

interface Props {
  reaction: CharacterReaction;
  positionX: number;
  walkDirection: 1 | -1;
  onClick: () => void;
}

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
        className="character__wrapper"
        style={{ transform: `translateX(${positionX}px)` }}
      >
        <img
          src={ASSETS.characterDefaultGif}
          alt="깨비 캐릭터"
          className="character__sprite"
          style={{ transform: `scaleX(${walkDirection})` }}
          draggable={false}
        />
      </span>
    </button>
  );
}
