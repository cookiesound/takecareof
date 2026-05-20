import { Modal, Button } from 'antd';
import { CHZZK_URL } from '@/constants/game';
import type { PublicUser } from '@/types/user';
import './SettingModal.scss';

interface Props {
  open: boolean;
  user: PublicUser;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingModal({ open, user, onClose, onLogout }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="setting-modal"
      title="설정"
    >
      <div className="setting-modal__content">
        <Button
          type="primary"
          block
          href={CHZZK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          치지직 이동
        </Button>
        <p className="setting-modal__stat">
          총 스티커 신청 횟수: <strong>{user.stickerRequestCount}</strong>
        </p>
        <Button danger block onClick={onLogout}>
          로그아웃
        </Button>
      </div>
    </Modal>
  );
}
