import { STICKER_UNLOCK_LEVEL } from '@/constants/game';
import type { PublicUser } from '@/types/user';
import './BottomMenu.scss';

interface Props {
  user: PublicUser;
  onSticker: () => void;
  onActivity: () => void;
  onSetting: () => void;
  onHelp: () => void;
}

export default function BottomMenu({
  user,
  onSticker,
  onActivity,
  onSetting,
  onHelp,
}: Props) {
  const stickerEnabled = user.level >= STICKER_UNLOCK_LEVEL && !user.isStickerRequesting;
  const activityEnabled = user.energy > 0;

  return (
    <nav className="bottom-menu">
      <button
        type="button"
        className="bottom-menu__btn"
        disabled={!stickerEnabled}
        onClick={onSticker}
      >
        스티커
      </button>
      <button
        type="button"
        className={`bottom-menu__btn bottom-menu__btn--primary ${!activityEnabled ? 'bottom-menu__btn--disabled' : ''}`}
        disabled={!activityEnabled}
        onClick={onActivity}
      >
        활동
      </button>
      <button type="button" className="bottom-menu__btn" onClick={onSetting}>
        설정
      </button>
      <button type="button" className="bottom-menu__btn" onClick={onHelp}>
        도움말
      </button>
    </nav>
  );
}
