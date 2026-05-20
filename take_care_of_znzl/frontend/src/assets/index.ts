import enterBg from './enter_bg.png';
import joinBg from './join_bg.png';
import mainBg from './main_bg.png';
import popL from './pop_l.png';
import popM from './pop_m.png';
import popS from './pop_s.png';
import characterDefaultGif from './기본.gif';
import activityWalkBg from './산책.png';
import activitySleepBg from './수면.png';
import activityGameBg from './게임.png';
import activityReadBg from './독서.png';
import activityMovieBg from './영화.png';
import activitySongBg from './노래.png';

export const ASSETS = {
  enterBg,
  joinBg,
  mainBg,
  popL,
  popM,
  popS,
  characterDefaultGif,
} as const;

/** 활동 이름(백엔드 ACTIVITY_NAMES)과 동일한 키 */
export const ACTIVITY_BACKGROUNDS: Record<string, string> = {
  산책: activityWalkBg,
  수면: activitySleepBg,
  게임: activityGameBg,
  독서: activityReadBg,
  영화: activityMovieBg,
  노래: activitySongBg,
};

export function getActivityBackground(activityName: string): string {
  return ACTIVITY_BACKGROUNDS[activityName] ?? mainBg;
}
