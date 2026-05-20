import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, message } from 'antd';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import GameLayout from '@/components/GameLayout/GameLayout';
import GameButton from '@/components/GameButton/GameButton';
import './LoginPage.scss';

interface LoginForm {
  nickname: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const user = await login(values.nickname, values.password);
      message.success('로그인 성공!');
      navigate(user.role === 'admin' ? '/admin' : '/main', { replace: true });
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data
          ? String((err.response.data as { message?: string }).message)
          : '로그인에 실패했습니다.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameLayout>
      <div className="login-page">
        <h2>로그인</h2>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="nickname"
            label="닉네임"
            rules={[{ required: true, message: '닉네임을 입력해주세요' }]}
          >
            <Input placeholder="닉네임" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
          >
            <Input.Password placeholder="비밀번호" size="large" />
          </Form.Item>
          <Form.Item>
            <GameButton gameVariant="confirm" htmlType="submit" block size="large" loading={loading}>
              로그인
            </GameButton>
          </Form.Item>
        </Form>
        <p className="login-page__link">
          계정이 없나요? <Link to="/register">회원가입</Link>
        </p>
        <Link to="/" className="login-page__back">
          ← 돌아가기
        </Link>
      </div>
    </GameLayout>
  );
}
