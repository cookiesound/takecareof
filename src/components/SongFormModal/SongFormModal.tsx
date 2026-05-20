import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import { Song, CreateSongRequest, UpdateSongRequest, Genre } from "../../types";
import "./SongFormModal.scss";

const { Option } = Select;

interface SongFormModalProps {
  visible: boolean;
  song: Song | null;
  onCancel: () => void;
  onSubmit: (values: CreateSongRequest | UpdateSongRequest) => void;
  loading: boolean;
}

const SongFormModal: React.FC<SongFormModalProps> = ({
  visible,
  song,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (song) {
        form.setFieldsValue({
          genre: song.genre,
          title: song.title,
          artist: song.artist,
          proficiency: song.proficiency,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, song, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      message.error("입력 정보를 확인해주세요.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={song ? "노래 수정" : "노래 추가"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={500}
      okText="저장"
      cancelText="취소"
      className="song-form-modal"
    >
      <Form form={form} layout="vertical" className="song-form">
        <Form.Item
          name="genre"
          label="장르"
          rules={[{ required: true, message: "장르를 선택해주세요." }]}
        >
          <Select placeholder="장르를 선택하세요">
            <Option value="K-POP">K-POP</Option>
            <Option value="J-POP">J-POP</Option>
            <Option value="POP">POP</Option>
            <Option value="사극풍">사극풍</Option>
            <Option value="신청곡">신청곡</Option>
            <Option value="발라드/OST">발라드/OST</Option>
            <Option value="트로트">트로트</Option>
            <Option value="뮤지컬">뮤지컬</Option>
            <Option value="인디/락">인디/락</Option>
            <Option value="기타">기타</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="노래제목"
          rules={[{ required: true, message: "노래제목을 입력해주세요." }]}
        >
          <Input placeholder="노래제목을 입력하세요" />
        </Form.Item>

        <Form.Item
          name="artist"
          label="가수"
          rules={[{ required: true, message: "가수를 입력해주세요." }]}
        >
          <Input placeholder="가수를 입력하세요" />
        </Form.Item>

        <Form.Item
          name="proficiency"
          label="숙련도"
          rules={[{ required: true, message: "숙련도를 선택해주세요." }]}
        >
          <Select placeholder="숙련도를 선택하세요">
            <Option value={1}>1단계</Option>
            <Option value={2}>2단계</Option>
            <Option value={3}>3단계</Option>
            <Option value={4}>4단계</Option>
            <Option value={5}>5단계</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SongFormModal;
