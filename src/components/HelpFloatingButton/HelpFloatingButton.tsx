import React from "react";
import { Button, Tooltip } from "antd";
import { QuestionOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "./HelpFloatingButton.scss";

const HelpFloatingButton: React.FC = () => {
  const location = useLocation();

  const getTooltipContent = () => {
    if (location.pathname === "/songbook") {
      return (
        <div style={{ whiteSpace: "pre-line" }}>
          {`1. 데이터가 보이지 않는다면 1~2분 뒤에 새로고침 해주세요!
2. 노래 방송 중에만 노래 신청 부탁드립니다!
3. 신청곡은 한곡당 2000치즈 입니다.`}
        </div>
      );
    }

    // 기본 툴팁 (깨불이 스티커 페이지)
    return (
      <div style={{ whiteSpace: "pre-line" }}>
        {`1. 데이터가 보이지 않는다면 1~2분 뒤에 새로고침 해주세요!
2. 스티커 30개가 모이면 "소원 요청" 버튼으로 소원을 요청하세요.
3. 본인의 소원만 요청해주세요 ^^`}
      </div>
    );
  };

  return (
    <div className="help-floating-button">
      <Tooltip title={getTooltipContent()} placement="left" color="#000000">
        <Button
          type="primary"
          shape="circle"
          icon={<QuestionOutlined />}
          size="large"
          className="help-button"
        />
      </Tooltip>
    </div>
  );
};

export default HelpFloatingButton;
