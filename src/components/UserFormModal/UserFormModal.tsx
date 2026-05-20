import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import { User, CreateUserRequest, UpdateUserRequest } from "../../types";
import "./UserFormModal.scss";

interface UserFormModalProps {
  visible: boolean;
  user?: User | null;
  onCancel: () => void;
  onSubmit: (values: CreateUserRequest | UpdateUserRequest) => void;
  loading?: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  user,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        nickname: user.nickname,
        sticker_count: user.sticker_count,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      message.error("입력값을 확인해주세요.");
    }
  };

  return (
    <Modal
      title={user ? "사용자 수정" : "신규 사용자 생성"}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="저장"
      cancelText="취소"
      className="user-form-modal"
    >
      <Form form={form} layout="vertical" className="user-form">
        <Form.Item
          name="nickname"
          label="닉네임"
          rules={[
            { required: true, message: "닉네임을 입력해주세요." },
            {
              min: 2,
              max: 20,
              message: "닉네임은 2-20자 사이로 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="닉네임을 입력하세요" />
        </Form.Item>

        <Form.Item
          name="sticker_count"
          label="스티커 개수"
          rules={[
            { required: false, message: "스티커 개수를 입력해주세요." },
            {
              type: "number",
              min: 0,
              max: 30,
              message: "스티커 개수는 0-30개 사이로 입력해주세요.",
            },
          ]}
        >
          <InputNumber
            placeholder="스티커 개수를 입력하세요 (기본값: 0)"
            min={0}
            max={30}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
