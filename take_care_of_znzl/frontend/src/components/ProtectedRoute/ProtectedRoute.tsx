import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen message="로딩 중..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
