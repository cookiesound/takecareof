import { useState, useEffect, useCallback } from 'react';
import {
  CHARACTER_REACTIONS,
  CHARACTER_REACTION_INTERVAL_MS,
  CLICK_QUOTES,
  SPEECH_BUBBLE_DURATION_MS,
  type CharacterReaction,
} from '@/constants/game';
import { useUiStore } from '@/store/uiStore';

function randomReaction(): CharacterReaction {
  const idx = Math.floor(Math.random() * CHARACTER_REACTIONS.length);
  return CHARACTER_REACTIONS[idx];
}

function randomQuote(): string {
  const idx = Math.floor(Math.random() * CLICK_QUOTES.length);
  return CLICK_QUOTES[idx];
}

export function useCharacterReaction() {
  const [reaction, setReaction] = useState<CharacterReaction>('idle');
  const [walkDirection, setWalkDirection] = useState<1 | -1>(1);
  const [positionX, setPositionX] = useState(0);
  const setSpeechText = useUiStore((s) => s.setSpeechText);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = randomReaction();
      setReaction(next);
      if (next === 'walk') {
        setWalkDirection(() => (Math.random() > 0.5 ? 1 : -1));
      }
    }, CHARACTER_REACTION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reaction !== 'walk') return;

    const moveInterval = setInterval(() => {
      setPositionX((prev) => {
        const next = prev + walkDirection * 8;
        const maxOffset = 80;
        if (next > maxOffset) {
          setWalkDirection(-1);
          return maxOffset;
        }
        if (next < -maxOffset) {
          setWalkDirection(1);
          return -maxOffset;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [reaction, walkDirection]);

  const handleClick = useCallback(() => {
    const quote = randomQuote();
    setSpeechText(quote);
    setReaction('cute');
    const timer = setTimeout(() => {
      setSpeechText(null);
      setReaction('idle');
    }, SPEECH_BUBBLE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [setSpeechText]);

  return { reaction, positionX, walkDirection, handleClick };
}
