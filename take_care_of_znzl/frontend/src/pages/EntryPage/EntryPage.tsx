import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useServerWake } from '@/hooks/useServerWake';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import GameButton from '@/components/GameButton/GameButton';
import { getToken } from '@/utils/storage';
import { ASSETS } from '@/assets';
import './EntryPage.scss';

export default function EntryPage() {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const { isWaking, wake } = useServerWake();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      await wake();
      const token = getToken();
      if (token) {
        const ok = await checkAuth();
        if (ok) {
          const user = useAuthStore.getState().user;
          navigate(user?.role === 'admin' ? '/admin' : '/main', { replace: true });
          return;
        }
      }
      setChecking(false);
    };
    void init();
  }, [checkAuth, navigate, wake]);

  if (isWaking || checking) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="entry-page"
      style={{ backgroundImage: `url(${ASSETS.enterBg})` }}
    >
      <div className="entry-page__actions">
        <GameButton
          gameVariant="confirm"
          size="large"
          className="entry-page__login-btn"
          onClick={() => navigate('/login')}
        >
          로그인
        </GameButton>
        <GameButton
          gameVariant="cancel"
          className="entry-page__register-btn"
          onClick={() => navigate('/register')}
        >
          회원가입
        </GameButton>
      </div>
    </div>
  );
}
