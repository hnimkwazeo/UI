import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, message, Skeleton, Card, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import styles from './video-detail.page.module.scss';
import type { IVideo } from 'types/video.type';
import { fetchVideoDetailClientAPI, fetchVideosClientAPI } from 'services/video.service';
import { parseSubtitle, type ParsedSubtitle } from 'utils/subtitle-parser';
import SuggestedVideoCard from 'components/video/suggested-video-card.component';
import { useMediaQuery } from 'react-responsive';

const { Title, Paragraph, Text } = Typography;

const VideoDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const playerRef = useRef(null);
    const subtitleRefs = useRef(new Map());

    const [video, setVideo] = useState<IVideo | null>(null);
    const [suggestedVideos, setSuggestedVideos] = useState<IVideo[]>([]);
    const [subtitles, setSubtitles] = useState<ParsedSubtitle[]>([]);
    const [currentSubtitle, setCurrentSubtitle] = useState<ParsedSubtitle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    
    const md = useMediaQuery({ maxWidth: 991.98 });

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        const getVideoData = async () => {
            try {
                const res = await fetchVideoDetailClientAPI(parseInt(id));
                if (res && res.data) {
                    const videoData = res.data;
                    setVideo(videoData);

                    // Fetch subtitle content
                    if (videoData.subtitle) {
                        const subtitleUrl = `${import.meta.env.VITE_BACKEND_URL}${videoData.subtitle}`;
                        try {
                            const subtitleContent = await fetch(subtitleUrl).then(res => res.text());
                            const parsed = parseSubtitle(subtitleContent);
                            setSubtitles(parsed);
                        } catch (err) {
                            console.error("Failed to load subtitle", err);
                        }
                    }

                    const suggestedRes = await fetchVideosClientAPI(`categoryId=${videoData.category.id}&limit=5`);
                    if (suggestedRes && suggestedRes.data) {
                        setSuggestedVideos(suggestedRes.data.result.filter((v: any) => v.id !== videoData.id));
                    }
                }
            } catch (error) {
                message.error(t('errors.fetchVideoError'));
            } finally {
                setIsLoading(false);
            }
        };

        getVideoData();
    }, [id, t]);

    // Logic đồng bộ thời gian video với phụ đề
    useEffect(() => {
        if (playing) {
            const interval = setInterval(() => {
                if (playerRef.current) {
                    // @ts-ignore
                    // Lấy thời gian hiện tại từ ReactPlayer
                    const currentTime = playerRef.current.getCurrentTime(); 
                    if (typeof currentTime === 'number') {
                        handleProgress(currentTime);
                    }
                }
            }, 500);

            return () => {
                clearInterval(interval);
            };
        }
    }, [playing]);

    // Scroll danh sách phụ đề bên phải
    useEffect(() => {
        if (currentSubtitle) {
            const activeSubtitleElement = subtitleRefs.current.get(currentSubtitle.id);
            if (activeSubtitleElement) {
                activeSubtitleElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [currentSubtitle]);

    const handleProgress = (playedSeconds: number) => {
        // Tìm phụ đề khớp với khoảng thời gian hiện tại
        const activeSub = subtitles.find(sub => playedSeconds >= sub.startTime && playedSeconds <= sub.endTime);
        setCurrentSubtitle(activeSub || null);
    };

    const handleSubtitleClick = (time: number) => {
        // @ts-ignore
        playerRef.current?.seekTo(time, 'seconds');
        setPlaying(true);
    };

    if (isLoading) {
        return <Card><Skeleton active paragraph={{ rows: 10 }} /></Card>;
    }

    if (!video) {
        return <Card>{t('errors.videoNotFound')}</Card>;
    }

    // Style cho khung phụ đề nổi (Overlay)
    const subtitleOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: '20px',        // Cách mép trên 20px
        right: '20px',      // Cách mép phải 20px
        zIndex: 10,         // Nổi lên trên video
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền đen bán trong suốt
        padding: '12px 16px',
        borderRadius: '8px',
        maxWidth: '40%',    // Giới hạn chiều rộng
        textAlign: 'right', // Canh lề phải
        color: '#fff',      // Chữ trắng
        backdropFilter: 'blur(4px)',
    };

    return (
        <Row gutter={[md ? 0 : 16, md ? 0 : 16]} className={styles.pageContainer}>
            {/* Thêm position: relative để làm điểm neo cho subtitle absolute */}
            <Col xs={24} lg={16} style={{ position: 'relative' }}>
                
                {/* --- KHU VỰC HIỂN THỊ PHỤ ĐỀ OVERLAY (ĐÃ SỬA) --- */}
                {currentSubtitle && (
                    <div style={subtitleOverlayStyle}>
                        <Text strong style={{ fontSize: '18px', color: '#fff', marginBottom: '4px', display: 'block' }}>
                            {currentSubtitle.english}
                        </Text>
                        <Text style={{ fontSize: '14px', color: '#d9d9d9' }}>
                            {currentSubtitle.vietnamese}
                        </Text>
                    </div>
                )}
                {/* ------------------------------------------------ */}

                <Card className={styles.videoCard} bodyStyle={{ padding: 0, overflow: 'hidden' }}>
                    <div className={styles.playerWrapper} style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                        <ReactPlayer
                            ref={playerRef}
                            src={video.url}
                            className={styles.reactPlayer}
                            style={{ position: 'absolute', top: 0, left: 0 }}
                            width="100%"
                            height="100%"
                            controls
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={() => setPlaying(false)}
                        />
                    </div>
                    <div className={styles.infoSection} style={{ padding: '24px' }}>
                        <Title level={3} className={styles.videoTitle}>{video.title}</Title>
                        <Paragraph>
                            <div dangerouslySetInnerHTML={{ __html: video.description }} />
                        </Paragraph>
                    </div>
                </Card>
            </Col>

            <Col xs={24} lg={8}>
                <Card title={t('video.subtitles')} className={styles.subtitleCard} bodyStyle={{ padding: 0, maxHeight: '600px', overflowY: 'auto' }}>
                    <div className={styles.subtitleList}>
                        {subtitles.map(sub => (
                            <div key={sub.id}>
                                <div
                                    // @ts-ignore
                                    ref={el => subtitleRefs.current.set(sub.id, el)}
                                    className={`${styles.subtitleItem} ${currentSubtitle?.id === sub.id ? styles.active : ''}`}
                                    onClick={() => handleSubtitleClick(sub.startTime)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        backgroundColor: currentSubtitle?.id === sub.id ? '#e6f7ff' : 'transparent',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Paragraph className={styles.subTextEn} style={{ marginBottom: 4, fontWeight: 500 }}>
                                        {sub.english}
                                    </Paragraph>
                                    <Paragraph className={styles.subTextVi} style={{ marginBottom: 0, color: '#8c8c8c' }}>
                                        {sub.vietnamese}
                                    </Paragraph>
                                </div>
                                <Divider style={{ margin: 0 }} />
                            </div>
                        ))}
                    </div>
                </Card>

                <div className={styles.suggestedSection} style={{ marginTop: '24px' }}>
                    <Title level={4}>{t('video.suggestedVideos')}</Title>
                    {suggestedVideos.map(v => <SuggestedVideoCard key={v.id} video={v} />)}
                </div>
            </Col>
        </Row>
    );
};

export default VideoDetailPage;