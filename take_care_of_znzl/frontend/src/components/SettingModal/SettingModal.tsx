import { Modal } from 'antd';
import type { CSSProperties } from 'react';
import { CHZZK_URL } from '@/constants/game';
import type { PublicUser } from '@/types/user';
import GameButton from '@/components/GameButton/GameButton';
import { ASSETS } from '@/assets';
import './SettingModal.scss';

interface Props {
  open: boolean;
  user: PublicUser;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingModal({ open, user, onClose, onLogout }: Props) {
  const popupStyle = {
    '--popup-bg': `url(${ASSETS.popM})`,
  } as CSSProperties;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      maskClosable
      title={null}
      className="game-popup game-popup--medium setting-modal"
      style={popupStyle}
      width={320}
    >
      <div className="game-popup__content setting-modal__content">
        <GameButton
          gameVariant="confirm"
          block
          href={CHZZK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          치지직 이동
        </GameButton>
        <p className="game-popup__stat setting-modal__stat">
          총 스티커 신청 횟수: <strong>{user.stickerRequestCount}</strong>
        </p>
        <div className="game-popup__actions">
          <GameButton gameVariant="cancel" block onClick={onLogout}>
            로그아웃
          </GameButton>
          <GameButton gameVariant="confirm" block onClick={onClose}>
            닫기
          </GameButton>
        </div>
      </div>
    </Modal>
  );
}
