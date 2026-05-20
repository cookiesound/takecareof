import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '@/components/GameLayout/GameLayout';
import GameButton from '@/components/GameButton/GameButton';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { ACTIVITY_GIF_DURATION_MS } from '@/constants/game';
import { getActivityBackground } from '@/assets';
import { getApiErrorMessage } from '@/utils/apiError';
import { showGameError } from '@/utils/gameModal';
import './ActivityPage.scss';

function getActivityPlayingLabel(activityName: string): string {
  if (activityName === '영화') return '영화 보는 중...';
  return `${activityName} 중...`;
}

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
        showGameError({
          message: getApiErrorMessage(err, '활동에 실패했습니다.'),
          onClose: () => navigate('/main', { replace: true }),
        });
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
  const activityBg = activity ? getActivityBackground(activity.activityName) : undefined;

  return (
    <GameLayout className="activity-page-layout">
      <div
        className="activity-page"
        style={
          activityBg ? { backgroundImage: `url(${activityBg})` } : undefined
        }
      >
        {phase === 'playing' && activity && (
          <div className="activity-page__playing">
            <p className="activity-page__name">
              {getActivityPlayingLabel(activity.activityName)}
            </p>
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
            <GameButton gameVariant="confirm" className="activity-page__btn" onClick={handleReturn}>
              메인으로
            </GameButton>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
