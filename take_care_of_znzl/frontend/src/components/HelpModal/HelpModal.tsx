import { Modal } from 'antd';
import type { CSSProperties } from 'react';
import { MAX_DAILY_ENERGY, MAX_EXP_PER_LEVEL, STICKER_UNLOCK_LEVEL } from '@/constants/game';
import GameButton from '@/components/GameButton/GameButton';
import { ASSETS } from '@/assets';
import './HelpModal.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
  const popupStyle = {
    '--popup-bg': `url(${ASSETS.popL})`,
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
      className="game-popup game-popup--large help-modal"
      style={popupStyle}
      width={360}
    >
      <div className="game-popup__content help-modal__content">
        <section>
          <h4>활동</h4>
          <p>
            하루 최대 {MAX_DAILY_ENERGY}회 활동할 수 있어요. 활동 시 랜덤으로 경험치
            20~50을 받습니다.
          </p>
        </section>
        <section>
          <h4>레벨</h4>
          <p>
            경험치가 {MAX_EXP_PER_LEVEL}에 도달하면 레벨업! 초과 경험치는 다음 레벨로
            이월됩니다.
          </p>
        </section>
        <section>
          <h4>스티커</h4>
          <p>
            레벨 {STICKER_UNLOCK_LEVEL} 달성 시 스티커를 신청할 수 있어요. 신청 후
            레벨과 경험치가 초기화됩니다.
          </p>
        </section>
        <div className="game-popup__actions">
          <GameButton gameVariant="confirm" block onClick={onClose}>
            확인
          </GameButton>
        </div>
      </div>
    </Modal>
  );
}
