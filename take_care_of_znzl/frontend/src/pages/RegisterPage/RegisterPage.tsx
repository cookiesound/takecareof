import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input } from 'antd';
import * as authApi from '@/api/auth';
import GameLayout from '@/components/GameLayout/GameLayout';
import GameButton from '@/components/GameButton/GameButton';
import { ASSETS } from '@/assets';
import { getApiErrorMessage } from '@/utils/apiError';
import { showGameError, showGameSuccessModal } from '@/utils/gameModal';
import './RegisterPage.scss';

interface RegisterForm {
  nickname: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      showGameError({ message: '비밀번호가 일치하지 않습니다.' });
      return;
    }
    setLoading(true);
    try {
      const successMessage = await authApi.register(
        values.nickname,
        values.password
      );
      showGameSuccessModal({
        message: successMessage,
        onClose: () => navigate('/login', { replace: true }),
      });
    } catch (err) {
      showGameError({
        message: getApiErrorMessage(err, '회원가입에 실패했습니다.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameLayout
      className="auth-layout"
      style={{ backgroundImage: `url(${ASSETS.joinBg})` }}
    >
      <div className="register-page">
        <div className="register-page__content">
          <h2>회원가입</h2>
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="nickname"
              label="닉네임"
              rules={[
                { required: true, message: '닉네임을 입력해주세요' },
                { min: 2, message: '2자 이상 입력해주세요' },
              ]}
            >
              <Input placeholder="닉네임" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              label="비밀번호"
              rules={[
                { required: true, message: '비밀번호를 입력해주세요' },
                { min: 4, message: '4자 이상 입력해주세요' },
              ]}
            >
              <Input.Password placeholder="비밀번호" size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="비밀번호 확인"
              rules={[{ required: true, message: '비밀번호를 다시 입력해주세요' }]}
            >
              <Input.Password placeholder="비밀번호 확인" size="large" />
            </Form.Item>
            <Form.Item>
              <GameButton
                gameVariant="confirm"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                가입하기
              </GameButton>
            </Form.Item>
          </Form>
          <p className="register-page__link">
            이미 계정이 있나요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
