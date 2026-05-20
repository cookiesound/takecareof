import React from "react";
import { Modal } from "antd";
import { TrophyOutlined, CrownOutlined } from "@ant-design/icons";
import { User } from "../../types";
import StickerBoard from "../StickerBoard/StickerBoard";
import "./UserDetailModal.scss";

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  // 스티커 개수 순위 계산 (전체 사용자 데이터가 필요하지만 여기서는 임시로 계산)
  const getRank = (stickerCount: number) => {
    // 실제로는 전체 사용자 데이터를 props로 받아야 하지만,
    // 여기서는 단순히 스티커 개수로 임시 순위 계산
    if (stickerCount >= 25) return 1;
    if (stickerCount >= 20) return 2;
    if (stickerCount >= 15) return 3;
    return null;
  };

  // 메달 아이콘 렌더링
  const renderMedalIcon = (rank: number | null) => {
    if (!rank) return null;

    switch (rank) {
      case 1:
        return <CrownOutlined style={{ color: "#FFD700", marginLeft: 8 }} />;
      case 2:
        return <TrophyOutlined style={{ color: "#C0C0C0", marginLeft: 8 }} />;
      case 3:
        return <TrophyOutlined style={{ color: "#CD7F32", marginLeft: 8 }} />;
      default:
        return null;
    }
  };
  return (
    <Modal
      title={`${user?.nickname}의 스티커`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="user-detail-modal"
    >
      {user && (
        <div className="user-detail-content">
          <div className="user-info">
            <p>
              <strong>닉네임: </strong>
              {user.nickname}
              {renderMedalIcon(getRank(user.sticker_count))}
            </p>
            <p>
              <strong>스티커 개수: </strong> {user.sticker_count}개
            </p>
            <p>
              <strong>가입일: </strong>{" "}
              {new Date(user.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div className="sticker-board-container">
            <StickerBoard stickerCount={user.sticker_count} />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserDetailModal;
