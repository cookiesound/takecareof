import type { CharacterReaction } from '@/constants/game';
import { ASSETS } from '@/assets';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import './Character.scss';

interface Props {
  reaction: CharacterReaction;
  positionX: number;
  walkDirection: 1 | -1;
  onClick: () => void;
  speechText?: string | null;
}

export default function Character({
  reaction,
  positionX,
  walkDirection,
  onClick,
  speechText,
}: Props) {
  return (
    <div
      className="character-root"
      style={{ transform: `translateX(${positionX}px) translateY(-24px)` }}
    >
      {speechText ? <SpeechBubble text={speechText} /> : null}
      <button
        type="button"
        className={`character character--${reaction}`}
        onClick={onClick}
        aria-label="캐릭터와 상호작용"
      >
        <span className="character__wrapper">
          <img
            src={ASSETS.characterDefaultGif}
            alt="깨비 캐릭터"
            className="character__sprite"
            style={{ transform: `scaleX(${walkDirection})` }}
            draggable={false}
          />
        </span>
      </button>
    </div>
  );
}
