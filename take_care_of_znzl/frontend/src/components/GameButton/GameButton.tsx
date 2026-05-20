import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import './GameButton.scss';

export type GameButtonVariant = 'confirm' | 'cancel';

interface GameButtonProps extends Omit<ButtonProps, 'variant'> {
  gameVariant?: GameButtonVariant;
}

export default function GameButton({
  gameVariant = 'confirm',
  className = '',
  ...props
}: GameButtonProps) {
  return (
    <Button
      className={`game-btn game-btn--${gameVariant} ${className}`.trim()}
      {...props}
    />
  );
}
