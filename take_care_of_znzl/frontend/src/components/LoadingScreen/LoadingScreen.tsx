import './LoadingScreen.scss';

interface Props {
  message?: string;
  subMessage?: string;
}

export default function LoadingScreen({
  message = '서버를 깨우는 중입니다...',
  subMessage = '잠시만 기다려주세요.',
}: Props) {
  return (
    <div className="loading-screen">
      <div className="loading-screen__spinner" aria-hidden />
      <p className="loading-screen__message">{message}</p>
      {subMessage && <p className="loading-screen__sub">{subMessage}</p>}
    </div>
  );
}
