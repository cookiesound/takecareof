import { Modal } from 'antd';
import { MAX_DAILY_ENERGY, MAX_EXP_PER_LEVEL, STICKER_UNLOCK_LEVEL } from '@/constants/game';
import './HelpModal.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="help-modal"
      title="도움말"
    >
      <div className="help-modal__content">
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
      </div>
    </Modal>
  );
}
