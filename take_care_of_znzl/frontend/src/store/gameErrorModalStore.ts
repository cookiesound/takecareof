import { create } from 'zustand';

export type GameMessageModalVariant = 'error' | 'success';

export interface ShowGameMessageModalPayload {
  message: string;
  onClose?: () => void;
  variant?: GameMessageModalVariant;
  /** 미지정 시 success → 확인, error → 닫기 */
  primaryLabel?: string;
}

interface GameMessageModalState extends ShowGameMessageModalPayload {
  open: boolean;
  variant: GameMessageModalVariant;
  primaryLabel: string;
  _pendingOnClose: (() => void) | undefined;
  show: (payload: ShowGameMessageModalPayload) => void;
  close: () => void;
}

function resolvePrimaryLabel(
  variant: GameMessageModalVariant,
  explicit?: string
): string {
  if (explicit) return explicit;
  return variant === 'success' ? '확인' : '닫기';
}

export const useGameErrorModalStore = create<GameMessageModalState>((set, get) => ({
  open: false,
  message: '',
  variant: 'error',
  primaryLabel: '닫기',
  _pendingOnClose: undefined,

  show: (payload) => {
    const prev = get()._pendingOnClose;
    prev?.();
    const variant = payload.variant ?? 'error';
    set({
      open: true,
      message: payload.message,
      variant,
      primaryLabel: resolvePrimaryLabel(variant, payload.primaryLabel),
      _pendingOnClose: payload.onClose,
    });
  },

  close: () => {
    const cb = get()._pendingOnClose;
    set({ open: false, _pendingOnClose: undefined });
    cb?.();
  },
}));

export function showGameMessageModal(payload: ShowGameMessageModalPayload): void {
  useGameErrorModalStore.getState().show(payload);
}

export function showGameError(
  payload: Omit<ShowGameMessageModalPayload, 'variant'>
): void {
  showGameMessageModal({ ...payload, variant: 'error' });
}

export function showGameSuccessModal(
  payload: Omit<ShowGameMessageModalPayload, 'variant'>
): void {
  showGameMessageModal({ ...payload, variant: 'success' });
}
