import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Card, Typography, Spin } from "antd";
import {
  usersAtom,
  paginationAtom,
  loadingAtom,
  selectedUserAtom,
  modalAtom,
} from "../store/userStore";
import { userService } from "../services/userService";
import UserTable from "../components/UserTable/UserTable";
import UserDetailModal from "../components/UserDetailModal/UserDetailModal";
import WishModal from "../components/WishModal/WishModal";
import { User } from "../types";
import "./UserPage.scss";

const { Title } = Typography;

const UserPage: React.FC = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const [wishModalVisible, setWishModalVisible] = useState(false);
  const [wishUser, setWishUser] = useState<User | null>(null);

  const fetchUsers = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await userService.getUsers({ page, limit });
      setUsers(response.data);
      setPagination({
        current: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.totalItems,
      });
    } catch (error) {
      console.error("사용자 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    fetchUsers(page, pageSize);
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setModal((prev) => ({ ...prev, userDetail: true }));
  };

  const handleCloseDetailModal = () => {
    setModal((prev) => ({ ...prev, userDetail: false }));
    setSelectedUser(null);
  };

  const handleWishClick = (user: User) => {
    setWishUser(user);
    setWishModalVisible(true);
  };

  const handleWishModalClose = () => {
    setWishModalVisible(false);
    setWishUser(null);
  };

  const handleWishSuccess = () => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  return (
    <div className="user-page">
      <Card className="page-card">
        <Title level={2} className="page-title">
          깨불이 칭찬 스티커
        </Title>
        <Title level={4} className="page-subtitle">
          깨불이 목록
        </Title>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>깨불이 불러오는 중...</p>
          </div>
        ) : (
          <UserTable
            data={users}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowClick={handleRowClick}
            onWishClick={handleWishClick}
          />
        )}
      </Card>

      <UserDetailModal
        visible={modal.userDetail}
        user={selectedUser}
        onClose={handleCloseDetailModal}
      />

      <WishModal
        visible={wishModalVisible}
        user={wishUser}
        onClose={handleWishModalClose}
        onSuccess={handleWishSuccess}
      />
    </div>
  );
};

export default UserPage;
