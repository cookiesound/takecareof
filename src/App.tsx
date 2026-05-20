import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import SongbookPage from "./pages/SongbookPage";
import FloatingAnimation from "./components/FloatingAnimation/FloatingAnimation";
import HelpFloatingButton from "./components/HelpFloatingButton/HelpFloatingButton";
import "./styles/App.scss";

// 페이지네이션 텍스트 커스터마이징
const customLocale = {
  ...koKR,
  Pagination: {
    ...koKR.Pagination,
    items_per_page: "",
    jump_to: "",
    jump_to_confirm: "",
    page: "",
  },
};

// 페이지별 타이틀 변경 컴포넌트
const PageTitleUpdater: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const updateTitle = () => {
      switch (location.pathname) {
        case "/songbook":
          document.title = "노래책";
          break;
        case "/admin":
          document.title = "관리자 페이지";
          break;
        default:
          document.title = "깨불이 칭찬 스티커";
          break;
      }
    };

    updateTitle();
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <ConfigProvider locale={customLocale}>
      <Router>
        <div className="app">
          <PageTitleUpdater />
          <Routes>
            <Route path="/" element={<UserPage />} />
            <Route path="/songbook" element={<SongbookPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <FloatingAnimation />
          <HelpFloatingButton />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
