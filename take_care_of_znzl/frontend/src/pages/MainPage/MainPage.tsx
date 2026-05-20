import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '@/components/GameLayout/GameLayout';
import StatusBar from '@/components/StatusBar/StatusBar';
import Character from '@/components/Character/Character';
import BottomMenu from '@/components/BottomMenu/BottomMenu';
import SettingModal from '@/components/SettingModal/SettingModal';
import HelpModal from '@/components/HelpModal/HelpModal';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useCharacterReaction } from '@/hooks/useCharacterReaction';
import { showGameSuccess, showGameError } from '@/utils/gameModal';
import { getApiErrorMessage } from '@/utils/apiError';
import { ASSETS } from '@/assets';
import './MainPage.scss';

export default function MainPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const { user, fetchGameState, requestSticker } = useGameStore();
  const speechText = useUiStore((s) => s.speechText);
  const { isSettingOpen, isHelpOpen, setSettingOpen, setHelpOpen } = useUiStore();
  const { reaction, positionX, walkDirection, handleClick } = useCharacterReaction();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const gameUser = await fetchGameState();
        setAuthUser(gameUser);
      } catch (err) {
        showGameError({
          message: getApiErrorMessage(err, '게임 데이터를 불러오지 못했습니다.'),
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [fetchGameState, setAuthUser]);

  const handleActivity = () => {
    navigate('/activity');
  };

  const handleSticker = async () => {
    try {
      const updated = await requestSticker();
      setAuthUser(updated);
      showGameSuccess({
        title: '스티커 신청 완료',
        content: '신청이 접수되었습니다. 레벨과 경험치가 초기화되었어요!',
      });
    } catch (err) {
      showGameError({
        message: getApiErrorMessage(err, '스티커 신청에 실패했습니다.'),
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (loading || !user) {
    return <LoadingScreen message="게임 로딩 중..." />;
  }

  return (
    <GameLayout className="main-page">
      <StatusBar user={user} />
      <main
        className="main-page__scene"
        style={{ backgroundImage: `url(${ASSETS.mainBg})` }}
      >
        <Character
          reaction={reaction}
          positionX={positionX}
          walkDirection={walkDirection}
          onClick={handleClick}
          speechText={speechText}
        />
      </main>
      <BottomMenu
        user={user}
        onSticker={() => void handleSticker()}
        onActivity={handleActivity}
        onSetting={() => setSettingOpen(true)}
        onHelp={() => setHelpOpen(true)}
      />
      <SettingModal
        open={isSettingOpen}
        user={user}
        onClose={() => setSettingOpen(false)}
        onLogout={() => void handleLogout()}
      />
      <HelpModal open={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </GameLayout>
  );
}
