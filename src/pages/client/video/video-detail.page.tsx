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
    
    const playerRef = useRef<any>(null);
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

                    if (videoData.subtitle) {
                        let subtitleContent = "";
                        
                        const isUrl = videoData.subtitle.startsWith('http') || videoData.subtitle.startsWith('/');
                        
                        try {
                            if (isUrl) {
                                const subtitleUrl = `${import.meta.env.VITE_BACKEND_URL}${videoData.subtitle}`;
                                subtitleContent = await fetch(subtitleUrl).then(res => res.text());
                            } else {
                                subtitleContent = videoData.subtitle;
                            }
                            
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
                console.error(error);
                message.error(t('errors.fetchVideoError'));
            } finally {
                setIsLoading(false);
            }
        };

        getVideoData();
    }, [id, t]);

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

    const handlePlayerProgress = (state: any) => {
        const playedSeconds = state.playedSeconds;
        const activeSub = subtitles.find(sub => playedSeconds >= sub.startTime && playedSeconds <= sub.endTime);
        
        if (activeSub?.id !== currentSubtitle?.id) {
            setCurrentSubtitle(activeSub || null);
        }
    };

    const handleSubtitleClick = (time: number) => {
        playerRef.current?.seekTo(time, 'seconds');
        setPlaying(true);
    };

    if (isLoading) {
        return <Card><Skeleton active paragraph={{ rows: 10 }} /></Card>;
    }

    if (!video) {
        return <Card>{t('errors.videoNotFound')}</Card>;
    }

    const subtitleOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: '20px',       
        right: '20px',      
        zIndex: 10,        
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: '12px 16px',
        borderRadius: '8px',
        maxWidth: '40%',    
        textAlign: 'right', 
        color: '#fff',      
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none', 
    };

    return (
        <Row gutter={[md ? 0 : 16, md ? 0 : 16]} className={styles.pageContainer}>
            <Col xs={24} lg={16}>
                <Card className={styles.videoCard} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                    
                    <div className={styles.playerWrapper} style={{ position: 'relative', paddingTop: '56.25%' }}>
                        
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

                        <ReactPlayer
                            ref={playerRef}
                            src={video.url}
                            className={styles.reactPlayer}
                            style={{ position: 'absolute', top: 0, left: 0 }}
                            width="100%"
                            height="100%"
                            controls
                            playing={playing}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={() => setPlaying(false)}
                            
                            onProgress={handlePlayerProgress as any} 
                            
                            //@ts-ignore
                            progressInterval={500}
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
                <Card 
                    title={t('video.subtitles')} 
                    className={styles.subtitleCard}
                    styles={{ body: { padding: 0 } }} 
                >
                    {subtitles.length > 0 ? (
                        <div className={styles.subtitleList}>
                            {subtitles.map((sub, index) => (
                                <div
                                    key={index} 
                                    ref={(el) => {
                                        if (sub.id) subtitleRefs.current.set(sub.id, el);
                                    }}
                                    className={`${styles.subtitleItem} ${
                                        currentSubtitle && 
                                        sub.startTime === currentSubtitle.startTime 
                                        ? styles.active 
                                        : ''
                                    }`}
                                    onClick={() => handleSubtitleClick(sub.startTime)}
                                >
                                    <div className={styles.subTextEn}>
                                        {sub.english}
                                    </div>
                                    {sub.vietnamese && (
                                        <div className={styles.subTextVi}>
                                            {sub.vietnamese}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                            {t('video.noSubtitles', 'Chưa có phụ đề cho video này')}
                        </div>
                    )}
                </Card>

                {/* Phần Video gợi ý giữ nguyên */}
                <div className={styles.suggestedSection} style={{ marginTop: '24px' }}>
                    <Title level={4}>{t('video.suggestedVideos')}</Title>
                    {suggestedVideos.map(v => <SuggestedVideoCard key={v.id} video={v} />)}
                </div>
            </Col>
        </Row>
    );
};

export default VideoDetailPage;