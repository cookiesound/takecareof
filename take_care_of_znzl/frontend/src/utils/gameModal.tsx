import { Modal } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { ASSETS } from '@/assets';

interface GameAlertOptions {
  title: string;
  content?: ReactNode;
  onOk?: () => void;
}

export function showGameSuccess({ title, content, onOk }: GameAlertOptions): void {
  Modal.success({
    title,
    content,
    centered: true,
    className: 'game-popup game-popup--medium game-alert',
    style: { '--popup-bg': `url(${ASSETS.popM})` } as CSSProperties,
    okText: '확인',
    okButtonProps: { className: 'game-btn game-btn--confirm' },
    onOk,
  });
}

export {
  showGameError,
  showGameMessageModal,
  showGameSuccessModal,
} from '@/store/gameErrorModalStore';
