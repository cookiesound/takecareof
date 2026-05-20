import { Modal } from 'antd';
import { useUiStore } from '@/store/uiStore';
import { useGameErrorModalStore } from '@/store/gameErrorModalStore';

/** 로그아웃 등: Ant 정적 모달 + UI·게임 메시지 팝업 모두 닫기 (콜백 호출 안 함) */
export function closeAllModals(): void {
  Modal.destroyAll();
  useUiStore.setState({
    isSettingOpen: false,
    isHelpOpen: false,
    speechText: null,
  });
  useGameErrorModalStore.setState({
    open: false,
    _pendingOnClose: undefined,
  });
}
