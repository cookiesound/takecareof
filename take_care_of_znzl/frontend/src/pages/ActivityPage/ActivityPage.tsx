import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import GameLayout from '@/components/GameLayout/GameLayout';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { ACTIVITY_GIF_DURATION_MS } from '@/constants/game';
import './ActivityPage.scss';

const ACTIVITY_EMOJI: Record<string, string> = {
  산책: '🚶',
  애교: '💕',
  화남: '💢',
  하품: '😴',
  쉬기: '🛋️',
};

export default function ActivityPage() {
  const navigate = useNavigate();
  const performActivity = useGameStore((s) => s.performActivity);
  const lastActivity = useGameStore((s) => s.lastActivity);
  const setUser = useAuthStore((s) => s.setUser);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await performActivity();
        setUser(result.user);
        setTimeout(() => setPhase('result'), ACTIVITY_GIF_DURATION_MS);
      } catch (err) {
        const msg =
          axios.isAxiosError(err) && err.response?.data
            ? String((err.response.data as { message?: string }).message)
            : '활동에 실패했습니다.';
        message.error(msg);
        navigate('/main', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [performActivity, navigate, setUser]);

  const handleReturn = () => {
    navigate('/main', { replace: true });
  };

  if (loading && !lastActivity) {
    return <LoadingScreen message="활동 준비 중..." />;
  }

  const activity = lastActivity;

  return (
    <GameLayout>
      <div className="activity-page">
        {phase === 'playing' && activity && (
          <div className="activity-page__playing">
            <span className="activity-page__emoji">
              {ACTIVITY_EMOJI[activity.activityName] ?? '🎮'}
            </span>
            <p className="activity-page__name">{activity.activityName} 중...</p>
          </div>
        )}
        {phase === 'result' && activity && (
          <div className="activity-page__result">
            <p className="activity-page__name">{activity.activityName} 완료!</p>
            <p
              className={`activity-page__exp ${activity.leveledUp ? 'activity-page__exp--levelup' : ''}`}
            >
              +{activity.gainedExp} EXP
            </p>
            {activity.leveledUp && (
              <p className="activity-page__levelup">🎉 레벨업! Lv.{activity.user.level}</p>
            )}
            <button type="button" className="activity-page__btn" onClick={handleReturn}>
              메인으로
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
