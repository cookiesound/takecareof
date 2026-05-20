import React from "react";
import { Table, TableProps, Button } from "antd";
import { TrophyOutlined, CrownOutlined } from "@ant-design/icons";
import { User } from "../../types";
import "./UserTable.scss";

interface UserTableProps {
  data: User[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick?: (user: User) => void;
  showCheckbox?: boolean;
  showId?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
  onWishClick?: (user: User) => void;
  onWishCheckClick?: (user: User) => void;
  isAdmin?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  loading,
  pagination,
  onPageChange,
  onRowClick,
  showCheckbox = false,
  showId = false,
  selectedRowKeys = [],
  onSelectionChange,
  onWishClick,
  onWishCheckClick,
  isAdmin = false,
}) => {
  // API에서 받은 rank 값 사용
  const getRank = (rank: number) => {
    return rank <= 3 ? rank : null;
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
  const columns = [
    ...(showCheckbox
      ? [
          {
            title: "",
            dataIndex: "selection",
            key: "selection",
            width: 10,
            align: "center" as const,
            render: () => null,
          },
        ]
      : []),
    {
      title: "No.",
      key: "index",
      width: 80,
      align: "center" as const,
      render: (_: any, __: any, index: number) => {
        const currentPage = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    ...(showId
      ? [
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 300,
            align: "center" as const,
          },
        ]
      : []),
    {
      title: "치지직 닉네임",
      dataIndex: "nickname",
      key: "nickname",
      sorter: (a: User, b: User) => a.nickname.localeCompare(b.nickname),
      render: (nickname: string, record: User) => (
        <span>
          {nickname}
          {renderMedalIcon(getRank(record.rank))}
        </span>
      ),
    },
    {
      title: "스티커 개수",
      dataIndex: "sticker_count",
      key: "sticker_count",
      width: 200,
      align: "center" as const,
      sorter: (a: User, b: User) => a.sticker_count - b.sticker_count,
      render: (stickerCount: number, record: User) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span>{stickerCount}</span>
          {stickerCount === 30 &&
            !isAdmin &&
            onWishClick &&
            (record.has_wish ? (
              <span
                style={{
                  color: "#666",
                  fontSize: "12px",
                  fontStyle: "italic",
                  padding: "4px 8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                소원 처리중
              </span>
            ) : (
              <Button
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onWishClick(record);
                }}
              >
                소원 요청
              </Button>
            ))}
          {stickerCount === 30 && isAdmin && onWishCheckClick && (
            <Button
              type="default"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onWishCheckClick(record);
              }}
            >
              소원확인
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "가입 날짜",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      align: "center" as const,
      sorter: (a: User, b: User) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString("ko-KR"),
    },
  ];

  const tableProps: TableProps<User> = {
    columns,
    dataSource: data,
    loading,
    pagination: {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
      showQuickJumper: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
      size: "default",
      position: ["bottomCenter"],
    },
    onChange: (pagination, filters, sorter) => {
      // 정렬이 변경된 경우에는 API 호출하지 않음
      if (sorter && typeof sorter === "object" && "field" in sorter) {
        return;
      }
      // 페이지네이션만 변경된 경우에만 API 호출
      onPageChange(pagination.current || 1, pagination.pageSize || 10);
    },
    rowKey: "id",
    size: "middle",
  };

  if (onRowClick) {
    tableProps.onRow = (record) => ({
      onClick: () => onRowClick(record),
      style: {
        cursor: "pointer",
        backgroundColor: getRank(record.rank) ? "#FFFBE6" : undefined,
      },
    });
  } else {
    tableProps.onRow = (record) => ({
      style: {
        backgroundColor: getRank(record.rank) ? "#FFFBE6" : undefined,
      },
    });
  }

  if (showCheckbox) {
    tableProps.rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        // 단일 선택을 위해 마지막 선택된 항목만 유지
        const lastSelected = selectedRowKeys.slice(-1);
        onSelectionChange?.(lastSelected);
      },
      type: "checkbox" as const,
    };
  }

  return (
    <div className="user-table">
      <Table {...tableProps} />
    </div>
  );
};

export default UserTable;
