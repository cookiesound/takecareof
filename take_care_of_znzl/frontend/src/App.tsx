import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import EntryPage from '@/pages/EntryPage/EntryPage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import MainPage from '@/pages/MainPage/MainPage';
import ActivityPage from '@/pages/ActivityPage/ActivityPage';
import AdminPage from '@/pages/AdminPage/AdminPage';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute/AdminRoute';
import { useAuthStore } from '@/store/authStore';
import { wakeServer } from '@/api/health';

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    void wakeServer();
    void checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <ActivityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
