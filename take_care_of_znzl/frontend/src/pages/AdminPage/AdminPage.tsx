import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, message, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as adminApi from '@/api/admin';
import { useAuthStore } from '@/store/authStore';
import type { AdminUserRow } from '@/types/user';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import { getApiErrorMessage } from '@/utils/apiError';
import { showGameError } from '@/utils/gameModal';
import './AdminPage.scss';

const { Title } = Typography;

export default function AdminPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.fetchAdminUsers();
      setUsers(data.filter((u) => u.nickname !== 'admin'));
    } catch (err) {
      showGameError({
        message: getApiErrorMessage(err, '사용자 목록을 불러오지 못했습니다.'),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleComplete = async (userId: string) => {
    try {
      await adminApi.completeSticker(userId);
      message.success('처리 완료되었습니다.');
      await loadUsers();
    } catch (err) {
      showGameError({
        message: getApiErrorMessage(err, '처리에 실패했습니다.'),
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const columns: ColumnsType<AdminUserRow> = [
    { title: '닉네임', dataIndex: 'nickname', key: 'nickname' },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      ellipsis: true,
      render: (token: string | null) => token ?? '-',
    },
    { title: '레벨', dataIndex: 'level', key: 'level', width: 80 },
    { title: '경험치', dataIndex: 'exp', key: 'exp', width: 80 },
    {
      title: '스티커 신청 횟수',
      dataIndex: 'stickerRequestCount',
      key: 'stickerRequestCount',
      width: 140,
    },
    {
      title: '신청중',
      dataIndex: 'isStickerRequesting',
      key: 'isStickerRequesting',
      width: 90,
      render: (v: boolean) => (v ? '예' : '아니오'),
    },
    {
      title: '처리',
      key: 'action',
      width: 120,
      render: (_, record) =>
        record.isStickerRequesting ? (
          <Button type="primary" size="small" onClick={() => void handleComplete(record.id)}>
            처리 완료
          </Button>
        ) : (
          '-'
        ),
    },
  ];

  if (loading && users.length === 0) {
    return <LoadingScreen message="관리자 페이지 로딩..." subMessage="" />;
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <Title level={3}>관리자 페이지</Title>
        <Button onClick={() => void handleLogout()}>로그아웃</Button>
      </header>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
