import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  message,
  Modal,
  Layout,
  Menu,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  UserOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  usersAtom,
  paginationAtom,
  loadingAtom,
  selectedUserAtom,
  modalAtom,
} from "../store/userStore";
import { userService } from "../services/userService";
import { songService } from "../services/songService";
import { authService } from "../services/authService";
import UserTable from "../components/UserTable/UserTable";
import UserDetailModal from "../components/UserDetailModal/UserDetailModal";
import UserFormModal from "../components/UserFormModal/UserFormModal";
import SongTable from "../components/SongTable/SongTable";
import SongFormModal from "../components/SongFormModal/SongFormModal";
import PasswordCheckModal from "../components/PasswordCheckModal/PasswordCheckModal";
import WishDetailModal from "../components/WishDetailModal/WishDetailModal";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Wish,
  Song,
  CreateSongRequest,
  UpdateSongRequest,
} from "../types";
import "./AdminPage.scss";

const { Title } = Typography;
const { confirm } = Modal;
const { Sider, Content } = Layout;

type MenuKey = "users" | "songs";

const AdminPage: React.FC = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [formLoading, setFormLoading] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishDetailModalVisible, setWishDetailModalVisible] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  // 사이드바 상태
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>("users");

  // 노래 관련 상태
  const [songs, setSongs] = useState<Song[]>([]);
  const [songPagination, setSongPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [songLoading, setSongLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [songFormModalVisible, setSongFormModalVisible] = useState(false);
  const [selectedSongRowKeys, setSelectedSongRowKeys] = useState<React.Key[]>(
    []
  );

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

  const fetchSongs = async (page: number = 1, limit: number = 10) => {
    try {
      setSongLoading(true);
      const response: any = await songService.getSongs({ page, limit });
      // response.data가 배열인지 확인하고 안전하게 처리
      const songsData = Array.isArray(response.data.songs)
        ? response.data.songs
        : [];
      setSongs(songsData);
      setSongPagination({
        current: response.data.pagination?.page || 1,
        pageSize: response.data.pagination?.limit || 10,
        total: response.data.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error("노래 목록 조회 실패:", error);
      // 에러 시 빈 배열로 설정
      setSongs([]);
      setSongPagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    } finally {
      setSongLoading(false);
    }
  };

  const fetchWishes = async () => {
    try {
      const wishesData = await userService.getWishes();
      setWishes(wishesData);
    } catch (error) {
      console.error("소원 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (selectedMenu === "users") {
        fetchUsers();
        fetchWishes();
      } else if (selectedMenu === "songs") {
        fetchSongs();
      }
    }
  }, [isAuthenticated, selectedMenu]);

  const handlePageChange = (page: number, pageSize: number) => {
    if (selectedMenu === "users") {
      fetchUsers(page, pageSize);
    } else if (selectedMenu === "songs") {
      fetchSongs(page, pageSize);
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setModal((prev) => ({ ...prev, userDetail: true }));
  };

  const handleCloseDetailModal = () => {
    setModal((prev) => ({ ...prev, userDetail: false }));
    setSelectedUser(null);
  };

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleSongSelectionChange = (keys: React.Key[]) => {
    setSelectedSongRowKeys(keys);
  };

  const handleWishCheckClick = (user: User) => {
    console.log(wishes);

    console.log(user);
    const userWish = wishes.find((wish) => wish.user_id === user.id);
    if (userWish) {
      setSelectedWish(userWish);
      setWishDetailModalVisible(true);
    } else {
      message.warning("해당 사용자의 소원을 찾을 수 없습니다.");
    }
  };

  const handleWishDetailModalClose = () => {
    setWishDetailModalVisible(false);
    setSelectedWish(null);
  };

  const handleWishSuccess = () => {
    fetchUsers(pagination.current, pagination.pageSize);
    fetchWishes();
  };

  // 사용자 관련 핸들러
  const handleCreateUser = () => {
    setSelectedUser(null);
    setModal((prev) => ({ ...prev, userForm: true }));
  };

  const handleEditUser = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("수정할 사용자를 선택해주세요.");
      return;
    }

    const selectedUser = users.find((user) => user.id === selectedRowKeys[0]);
    if (selectedUser) {
      setSelectedUser(selectedUser);
      setModal((prev) => ({ ...prev, userForm: true }));
    }
  };

  const handleDeleteUser = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 사용자를 선택해주세요.");
      return;
    }

    confirm({
      title: "사용자 삭제",
      content: "선택한 사용자를 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: async () => {
        try {
          await userService.deleteUser(selectedRowKeys[0] as string);
          message.success("사용자가 삭제되었습니다.");
          setSelectedRowKeys([]);
          fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
          console.error("사용자 삭제 실패:", error);
        }
      },
    });
  };

  const handleFormSubmit = async (
    values: CreateUserRequest | UpdateUserRequest
  ) => {
    try {
      setFormLoading(true);
      if (selectedUser) {
        await userService.updateUser(
          selectedUser.id,
          values as UpdateUserRequest
        );
        message.success("사용자가 수정되었습니다.");
      } else {
        await userService.createUser(values as CreateUserRequest);
        message.success("사용자가 생성되었습니다.");
      }
      setModal((prev) => ({ ...prev, userForm: false }));
      setSelectedUser(null);
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("사용자 저장 실패:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setModal((prev) => ({ ...prev, userForm: false }));
    setSelectedUser(null);
  };

  // 노래 관련 핸들러
  const handleCreateSong = () => {
    setSelectedSong(null);
    setSongFormModalVisible(true);
  };

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setSongFormModalVisible(true);
  };

  const handleDeleteSong = (song: Song) => {
    confirm({
      title: "노래 삭제",
      content: `"${song.title}" 노래를 삭제하시겠습니까?`,
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: async () => {
        try {
          await songService.deleteSong(song.id);
          message.success("노래가 삭제되었습니다.");
          fetchSongs(songPagination.current, songPagination.pageSize);
        } catch (error) {
          console.error("노래 삭제 실패:", error);
        }
      },
    });
  };

  const handleSongFormSubmit = async (
    values: CreateSongRequest | UpdateSongRequest
  ) => {
    try {
      setFormLoading(true);
      if (selectedSong) {
        await songService.updateSong(
          selectedSong.id,
          values as UpdateSongRequest
        );
        message.success("노래가 수정되었습니다.");
      } else {
        await songService.createSong(values as CreateSongRequest);
        message.success("노래가 추가되었습니다.");
      }
      setSongFormModalVisible(false);
      setSelectedSong(null);
      fetchSongs(songPagination.current, songPagination.pageSize);
    } catch (error) {
      console.error("노래 저장 실패:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSongFormCancel = () => {
    setSongFormModalVisible(false);
    setSelectedSong(null);
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setModal((prev) => ({ ...prev, passwordCheck: false }));
  };

  const handlePasswordCancel = () => {
    setModal((prev) => ({ ...prev, passwordCheck: false }));
    // 인증 취소 시 사용자 페이지로 리다이렉트
    window.location.href = "/";
  };

  const handleLogout = () => {
    authService.removeToken();
    setIsAuthenticated(false);
    setModal((prev) => ({ ...prev, passwordCheck: true }));
  };

  const handleMenuClick = (key: string) => {
    setSelectedMenu(key as MenuKey);
    setSelectedRowKeys([]);
    setSelectedSongRowKeys([]);
  };

  // 인증되지 않은 경우 비밀번호 확인 모달 표시
  if (!isAuthenticated) {
    return (
      <PasswordCheckModal
        visible={true}
        onSuccess={handlePasswordSuccess}
        onCancel={handlePasswordCancel}
      />
    );
  }

  const renderContent = () => {
    if (selectedMenu === "users") {
      return (
        <>
          <div className="admin-controls">
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
              >
                신규 사용자 생성
              </Button>
              <Button
                icon={<EditOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={handleEditUser}
              >
                수정
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={handleDeleteUser}
              >
                삭제
              </Button>
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ marginLeft: "auto" }}
              >
                로그아웃
              </Button>
            </Space>
          </div>

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
              showCheckbox={true}
              showId={true}
              selectedRowKeys={selectedRowKeys}
              onSelectionChange={handleSelectionChange}
              onWishCheckClick={handleWishCheckClick}
              isAdmin={true}
            />
          )}
        </>
      );
    } else if (selectedMenu === "songs") {
      return (
        <>
          <div className="admin-controls">
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateSong}
              >
                노래 추가
              </Button>
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ marginLeft: "auto" }}
              >
                로그아웃
              </Button>
            </Space>
          </div>

          {songLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p>노래 목록을 불러오는 중...</p>
            </div>
          ) : (
            <SongTable
              data={songs}
              loading={songLoading}
              pagination={songPagination}
              onPageChange={handlePageChange}
              onEdit={handleEditSong}
              onDelete={handleDeleteSong}
              selectedRowKeys={selectedSongRowKeys}
              onSelectionChange={handleSongSelectionChange}
            />
          )}
        </>
      );
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="admin-sider"
      >
        <div className="sider-header">
          <h3>{collapsed ? "관리" : "관리자 페이지"}</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="users" icon={<UserOutlined />}>
            깨불이 스티커 관리
          </Menu.Item>
          <Menu.Item key="songs" icon={<BookOutlined />}>
            노래책 관리
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <div className="admin-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="trigger-button"
          />
          <Title level={3} className="page-title">
            {selectedMenu === "users"
              ? "깨불이 칭찬 스티커 - 관리자"
              : "노래책 관리"}
          </Title>
        </div>

        <Content className="admin-content">
          <Card className="page-card">{renderContent()}</Card>
        </Content>
      </Layout>

      <UserDetailModal
        visible={modal.userDetail}
        user={selectedUser}
        onClose={handleCloseDetailModal}
      />

      <UserFormModal
        visible={modal.userForm}
        user={selectedUser}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      <SongFormModal
        visible={songFormModalVisible}
        song={selectedSong}
        onCancel={handleSongFormCancel}
        onSubmit={handleSongFormSubmit}
        loading={formLoading}
      />

      <WishDetailModal
        visible={wishDetailModalVisible}
        wish={selectedWish}
        onClose={handleWishDetailModalClose}
        onSuccess={handleWishSuccess}
      />
    </Layout>
  );
};

export default AdminPage;
