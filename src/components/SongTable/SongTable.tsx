import React from "react";
import { Table, Tag, Space, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Song, Genre, GENRE_COLORS } from "../../types";
import "./SongTable.scss";

interface SongTableProps {
  data: Song[];
  loading: boolean;
  pagination: any;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
  selectedRowKeys: React.Key[];
  onSelectionChange: (keys: React.Key[]) => void;
}

const SongTable: React.FC<SongTableProps> = ({
  data,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  selectedRowKeys,
  onSelectionChange,
}) => {
  const renderProficiency = (proficiency: number) => {
    return (
      <Space>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= proficiency ? (
              <StarFilled style={{ color: "#faad14" }} />
            ) : (
              <StarOutlined style={{ color: "#d9d9d9" }} />
            )}
          </span>
        ))}
      </Space>
    );
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: Song, b: Song) => a.id.localeCompare(b.id),
      render: (_: any, __: any, index: number) => {
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        return startIndex + index + 1;
      },
    },
    {
      title: "장르",
      dataIndex: "genre",
      key: "genre",
      width: 120,
      render: (genre: Genre) => <Tag color={GENRE_COLORS[genre]}>{genre}</Tag>,
    },
    {
      title: "노래제목",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      sorter: (a: Song, b: Song) => a.title.localeCompare(b.title),
    },
    {
      title: "가수",
      dataIndex: "artist",
      key: "artist",
      ellipsis: true,
      sorter: (a: Song, b: Song) => a.artist.localeCompare(b.artist),
    },
    {
      title: "숙련도",
      dataIndex: "proficiency",
      key: "proficiency",
      width: 150,
      sorter: (a: Song, b: Song) => a.proficiency - b.proficiency,
      render: (proficiency: number) => renderProficiency(proficiency),
    },
    {
      title: "작업",
      key: "actions",
      width: 120,
      render: (_: any, record: Song) => (
        <Space size="small">
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectionChange,
  };

  return (
    <div className="song-table-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: onPageChange,
          showSizeChanger: true,
          // showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / 총 ${total}개`,
        }}
        // rowSelection={null}
        className="song-table"
      />
    </div>
  );
};

export default SongTable;
