import { Progress } from 'antd';
import { MAX_EXP_PER_LEVEL, MAX_DAILY_ENERGY } from '@/constants/game';
import type { PublicUser } from '@/types/user';
import './StatusBar.scss';

interface Props {
  user: PublicUser;
}

export default function StatusBar({ user }: Props) {
  const expPercent = (user.exp / MAX_EXP_PER_LEVEL) * 100;

  return (
    <header className="status-bar">
      <div className="status-bar__row">
        <span className="status-bar__nickname">{user.nickname}</span>
        <span className="status-bar__level">Lv.{user.level}</span>
      </div>
      <Progress
        percent={expPercent}
        showInfo={false}
        strokeColor="#ff6eb4"
        trailColor="#ffe0ef"
        size="small"
      />
      <p className="status-bar__exp">
        EXP {user.exp}/{MAX_EXP_PER_LEVEL}
      </p>
      <div className="status-bar__energy">
        {Array.from({ length: MAX_DAILY_ENERGY }).map((_, i) => (
          <span
            key={i}
            className={`status-bar__heart ${i < user.energy ? 'status-bar__heart--full' : ''}`}
          />
        ))}
      </div>
    </header>
  );
}
