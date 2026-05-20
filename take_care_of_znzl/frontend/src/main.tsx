import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import App from './App';
import '@/styles/global.scss';
import '@/components/GameButton/GameButton.scss';
import '@/styles/game-modal.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={koKR}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
