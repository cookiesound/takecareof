import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Select,
  Input,
  Button,
  Pagination,
  Spin,
  message,
  Modal,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  StarFilled,
  StarOutlined,
  GiftOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { songService } from "../services/songService";
import {
  Song,
  SongFilterParams,
  Genre,
  GENRE_COLORS,
  RecommendedSongResponse,
} from "../types";
import "./SongbookPage.scss";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const SongbookPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [filters, setFilters] = useState<SongFilterParams>({
    page: 1,
    limit: 25,
  });
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationModalVisible, setRecommendationModalVisible] =
    useState(false);
  const [recommendedSong, setRecommendedSong] = useState<
    RecommendedSongResponse["data"] | null
  >(null);

  const fetchSongs = async (params: SongFilterParams = {}) => {
    try {
      setLoading(true);
      const response: any = await songService.getSongs(params);
      // response.data가 배열인지 확인하고 안전하게 처리
      const songsData = Array.isArray(response.data.songs)
        ? response.data.songs
        : [];
      setSongs(songsData);
      setPagination({
        current: response.data.pagination?.page || 1,
        pageSize: response.data.pagination?.limit || 25,
        total: response.data.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error("노래 목록 조회 실패:", error);
      message.error("노래 목록을 불러오는데 실패했습니다.");
      // 에러 시 빈 배열로 설정
      setSongs([]);
      setPagination({
        current: 1,
        pageSize: 25,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const genresData: any = await songService.getGenres();
      setGenres(genresData.data);
    } catch (error) {
      console.error("장르 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchSongs(filters);
    fetchGenres();
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    const newFilters = { ...filters, page, limit: pageSize };
    setFilters(newFilters);
    fetchSongs(newFilters);
  };

  const handleSearch = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchSongs(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { page: 1, limit: 25 };
    setFilters(resetFilters);
    fetchSongs(resetFilters);
  };

  const handleFilterChange = (key: keyof SongFilterParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRecommendation = async () => {
    try {
      setRecommendationLoading(true);
      const response = await songService.getRecommendedSong();
      setRecommendedSong(response.data);
      setRecommendationModalVisible(true);
    } catch (error) {
      console.error("추천 노래 조회 실패:", error);
      message.error("추천 노래를 가져오는데 실패했습니다.");
    } finally {
      setRecommendationLoading(false);
    }
  };

  const handleCloseRecommendationModal = () => {
    setRecommendationModalVisible(false);
    setRecommendedSong(null);
  };

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
  ];

  return (
    <div className="songbook-page">
      <Card className="page-card">
        <div className="page-header">
          <Title level={2} className="page-title">
            🎵 노래책 🎵
          </Title>
          <Button
            type="primary"
            icon={<GiftOutlined />}
            onClick={handleRecommendation}
            loading={recommendationLoading}
            className="recommendation-button"
          >
            {recommendationLoading ? "추천할 노래 찾는 중..." : "자동 추천"}
          </Button>
        </div>

        {/* 검색 필터 영역 */}
        <div className="filter-section">
          <Space wrap size="middle" className="filter-controls">
            <Select
              placeholder="장르 선택"
              style={{ width: 120 }}
              allowClear
              value={filters.genre}
              onChange={(value) => handleFilterChange("genre", value)}
            >
              <Option value="">전체</Option>
              {genres?.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="숙련도 선택"
              style={{ width: 120 }}
              allowClear
              value={filters.proficiency}
              onChange={(value) => handleFilterChange("proficiency", value)}
            >
              <Option value="">전체</Option>
              <Option value={1}>1단계</Option>
              <Option value={2}>2단계</Option>
              <Option value={3}>3단계</Option>
              <Option value={4}>4단계</Option>
              <Option value={5}>5단계</Option>
            </Select>

            <Search
              placeholder="키워드 검색"
              style={{ width: 200 }}
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
              onSearch={handleSearch}
              enterButton
            />

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              검색
            </Button>

            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              초기화
            </Button>
          </Space>
        </div>

        {/* 테이블 영역 */}
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>노래 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={songs}
              rowKey="id"
              pagination={false}
              className="song-table"
            />

            <div className="pagination-container">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["25", "50", "100"]}
                // showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} / 총 ${total}개`
                }
              />
            </div>
          </>
        )}
      </Card>

      {/* 추천 노래 모달 */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>🎵 추천 노래 🎵</span>
          </div>
        }
        open={recommendationModalVisible}
        onCancel={handleCloseRecommendationModal}
        footer={null}
        centered
        maskClosable={true}
        className="recommendation-modal"
      >
        {recommendedSong && (
          <div className="recommended-song-content">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <strong>장르:</strong>
              </Col>
              <Col span={18}>
                <Tag color={GENRE_COLORS[recommendedSong.genre]}>
                  {recommendedSong.genre}
                </Tag>
              </Col>

              <Col span={6}>
                <strong>노래제목:</strong>
              </Col>
              <Col span={18}>
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {recommendedSong.title}
                </span>
              </Col>

              <Col span={6}>
                <strong>가수:</strong>
              </Col>
              <Col span={18}>
                <span style={{ fontSize: "14px" }}>
                  {recommendedSong.artist}
                </span>
              </Col>

              <Col span={6}>
                <strong>숙련도:</strong>
              </Col>
              <Col span={18}>
                {renderProficiency(recommendedSong.proficiency)}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SongbookPage;
