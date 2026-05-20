import React, { useState } from "react";
import { Modal, Button, message, Spin } from "antd";
import { Wish } from "../../types";
import { userService } from "../../services/userService";
import dayjs from "dayjs";
import "./WishDetailModal.scss";

interface WishDetailModalProps {
  visible: boolean;
  wish: Wish | null;
  onClose: () => void;
  onSuccess: () => void;
}

const WishDetailModal: React.FC<WishDetailModalProps> = ({
  visible,
  wish,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleFulfillWish = async () => {
    if (!wish) return;

    try {
      setLoading(true);
      await userService.fulfillWish(wish.user_id);
      message.success("소원이 성취되었습니다!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("소원 성취 실패:", error);
      message.error("소원 성취에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!wish) return null;

  return (
    <Modal
      title="소원 확인"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          닫기
        </Button>,
        <Button
          key="fulfill"
          type="primary"
          danger
          loading={loading}
          onClick={handleFulfillWish}
        >
          소원성취
        </Button>,
      ]}
      width={500}
    >
      <div className="wish-detail-modal">
        <div className="wish-header">
          <h4>{wish.nickname}님의 소원</h4>
          <span className="wish-date">
            {dayjs(wish.created_at).format("YYYY-MM-DD")}
          </span>
        </div>

        <div className="wish-content">
          <p>{wish.content}</p>
        </div>

        <div className="wish-warning">
          <p>
            ⚠️ 소원성취 버튼을 누르면 {wish.nickname}님의 스티커가 0개로
            초기화됩니다.
          </p>
          <p style={{ color: "red", marginTop: 8 }}>
            깨불이 본인이 아닌 소원은 적지 말아주세요!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default WishDetailModal;
