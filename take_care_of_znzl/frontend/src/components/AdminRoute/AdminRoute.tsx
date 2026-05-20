import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen message="로딩 중..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
}
