import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useAuthStore } from '@/store/authStore';
import { useServerWake } from '@/hooks/useServerWake';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { getToken } from '@/utils/storage';
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
    <div className="entry-page">
      <div className="entry-page__logo">🐰</div>
      <h1 className="entry-page__title">즈니를 돌봐줘</h1>
      <Button
        type="primary"
        size="large"
        className="entry-page__login-btn"
        onClick={() => navigate('/login')}
      >
        로그인
      </Button>
      <button
        type="button"
        className="entry-page__register-link"
        onClick={() => navigate('/register')}
      >
        회원가입
      </button>
    </div>
  );
}
