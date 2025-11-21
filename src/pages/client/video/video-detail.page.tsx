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

const { Title, Paragraph } = Typography;

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

                    const subtitleUrl = `${import.meta.env.VITE_BACKEND_URL}${videoData.subtitle}`;
                    const subtitleContent = await fetch(subtitleUrl).then(res => res.text());
                    const parsed = parseSubtitle(subtitleContent);
                    setSubtitles(parsed);

                    const suggestedRes = await fetchVideosClientAPI(`categoryId=${videoData.category.id}&limit=5`);
                    setSuggestedVideos(suggestedRes.data.result.filter(v => v.id !== videoData.id));
                }
            } catch (error) {
                message.error(t('errors.fetchVideoError'));
            } finally {
                setIsLoading(false);
            }
        };

        getVideoData();
    }, [id, t]);

    useEffect(() => {
        if (playing) {
            const interval = setInterval(() => {
                if (playerRef.current) {
                    // @ts-ignore
                    const playedSeconds: number = playerRef.current?.api.getCurrentTime();
                    handleProgress(parseInt(playedSeconds.toFixed(0)));
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [playing]);

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
        console.log('Played seconds:', playedSeconds);
        if (typeof playedSeconds === 'number') {
            const activeSub = subtitles.find(sub => playedSeconds >= sub.startTime && playedSeconds <= sub.endTime);
            setCurrentSubtitle(activeSub || null);
        }
    };

    const handleSubtitleClick = (time: number) => {
        // @ts-ignore
        playerRef.current?.api.seekTo(time, 'seconds');
    };

    if (isLoading) {
        return <Card><Skeleton active paragraph={{ rows: 10 }} /></Card>;
    }

    if (!video) {
        return <Card>{t('errors.videoNotFound')}</Card>;
    }

    return (
        <Row gutter={[md ? 0 : 16, md ? 0 : 16]} className={styles.pageContainer}>
            <Col xs={24} lg={16}>
                <Card className={styles.videoCard}>
                    <div className={styles.playerWrapper}>
                        <ReactPlayer
                            ref={playerRef}
                            src={video.url}
                            className={styles.reactPlayer}
                            width="100%"
                            height="100%"
                            controls
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={() => setPlaying(false)}
                        />
                    </div>
                    <div className={styles.infoSection}>
                        <Title level={3} className={styles.videoTitle}>{video.title}</Title>
                        <Paragraph>
                            <div dangerouslySetInnerHTML={{ __html: video.description }} />
                        </Paragraph>
                    </div>
                </Card>
            </Col>

            <Col xs={24} lg={8}>
                <Card title={t('video.subtitles')} className={styles.subtitleCard}>
                    <div className={styles.subtitleList}>
                        {subtitles.map(sub => (
                            <>
                                <div
                                    // @ts-ignore
                                    ref={el => subtitleRefs.current.set(sub.id, el)}
                                    key={sub.id}
                                    className={`${styles.subtitleItem} ${currentSubtitle?.id === sub.id ? styles.active : ''}`}
                                    onClick={() => handleSubtitleClick(sub.startTime)}
                                >
                                    <Paragraph className={styles.subTextEn}>{sub.english}</Paragraph>
                                    <Paragraph className={styles.subTextVi}>{sub.vietnamese}</Paragraph>
                                </div>
                                <Divider style={{ margin: 0 }} />
                            </>
                        ))}
                    </div>
                </Card>

                <div className={styles.suggestedSection}>
                    <Title level={4}>{t('video.suggestedVideos')}</Title>
                    {suggestedVideos.map(v => <SuggestedVideoCard key={v.id} video={v} />)}
                </div>
            </Col>
        </Row>
    );
};

export default VideoDetailPage;
