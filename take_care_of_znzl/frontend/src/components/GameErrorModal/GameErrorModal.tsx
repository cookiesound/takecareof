import { Modal } from 'antd';
import type { CSSProperties } from 'react';
import GameButton from '@/components/GameButton/GameButton';
import { ASSETS } from '@/assets';
import { useGameErrorModalStore } from '@/store/gameErrorModalStore';
import '@/styles/game-modal.scss';

export default function GameErrorModal() {
  const open = useGameErrorModalStore((s) => s.open);
  const message = useGameErrorModalStore((s) => s.message);
  const primaryLabel = useGameErrorModalStore((s) => s.primaryLabel);
  const close = useGameErrorModalStore((s) => s.close);

  const popupStyle = {
    '--popup-bg': `url(${ASSETS.popS})`,
  } as CSSProperties;

  return (
    <Modal
      open={open}
      title={null}
      onCancel={close}
      footer={null}
      centered
      closable
      maskClosable
      destroyOnClose
      className="game-popup game-popup--small game-error-modal"
      style={popupStyle}
      width={360}
    >
      <div className="game-error-modal__body">
        <p className="game-error-modal__message">{message}</p>
        <GameButton gameVariant="confirm" block onClick={close}>
          {primaryLabel}
        </GameButton>
      </div>
    </Modal>
  );
}
