import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { authService } from "../../services/authService";
import "./PasswordCheckModal.scss";

interface PasswordCheckModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordCheckModal: React.FC<PasswordCheckModalProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const response: any = await authService.login({
        password: values.password,
      });

      if (response.success && response.data.token) {
        authService.saveToken(response.data.token);
        message.success("인증되었습니다.");
        onSuccess();
        form.resetFields();
      } else {
        message.error(response.message || "비밀번호가 올바르지 않습니다.");
      }
    } catch (error: any) {
      console.error("인증 실패:", error);
      message.error(
        error.response?.data?.message || "인증 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="관리자 인증"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="확인"
      cancelText="취소"
      className="password-check-modal"
    >
      <Form form={form} layout="vertical" className="password-form">
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
        >
          <Input.Password
            placeholder="관리자 비밀번호를 입력하세요"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordCheckModal;
