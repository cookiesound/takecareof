import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, message, Typography, Modal } from 'antd';
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.fetchAdminUsers();
      setUsers(data.filter((u) => u.nickname !== 'djemals'));
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

  const selectedUsers = users.filter((u) => selectedRowKeys.includes(u.id));
  const selectedNicknames = selectedUsers.map((u) => u.nickname).join(', ');

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('삭제할 사용자를 선택해주세요.');
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const { deletedCount } = await adminApi.deleteUsers(selectedRowKeys);
      message.success(`${deletedCount}명 삭제되었습니다.`);
      setSelectedRowKeys([]);
      setDeleteModalOpen(false);
      await loadUsers();
    } catch (err) {
      showGameError({
        message: getApiErrorMessage(err, '사용자 삭제에 실패했습니다.'),
      });
    } finally {
      setDeleting(false);
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
        <div className="admin-page__actions">
          <Button danger loading={deleting} onClick={handleDeleteSelected}>
            선택 삭제 ({selectedRowKeys.length})
          </Button>
          <Button onClick={() => void handleLogout()}>로그아웃</Button>
        </div>
      </header>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys.map(String)),
        }}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 900 }}
      />
      <Modal
        title="사용자 삭제"
        open={deleteModalOpen}
        centered
        okText="삭제"
        cancelText="취소"
        okType="danger"
        confirmLoading={deleting}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => handleConfirmDelete()}
      >
        <p>
          선택한 사용자({selectedNicknames || '없음'})를 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}
