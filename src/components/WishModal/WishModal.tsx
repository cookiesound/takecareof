import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { User } from "../../types";
import { userService } from "../../services/userService";
import "./WishModal.scss";

const { TextArea } = Input;

interface WishModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const WishModal: React.FC<WishModalProps> = ({
  visible,
  user,
  onClose,
  onSuccess,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (!content.trim()) {
      message.warning("소원 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await userService.createWish({
        userId: user.id,
        nickname: user.nickname,
        content: content.trim(),
      });
      message.success("소원이 전송되었습니다!");
      setContent("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("소원 전송 실패:", error);
      message.error("소원 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    onClose();
  };

  return (
    <Modal
      title="소원 작성"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          취소
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          소원 전송
        </Button>,
      ]}
      width={500}
    >
      <div className="wish-modal">
        <p className="wish-info">
          <strong>{user?.nickname}</strong>님의 소원을 작성해주세요.
        </p>
        <TextArea
          rows={6}
          placeholder="소원 내용을 입력해주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          showCount
        />
        <p className="wish-note">
          * 소원이 성취되면 스티커가 0개로 초기화됩니다.
        </p>
      </div>
    </Modal>
  );
};

export default WishModal;
