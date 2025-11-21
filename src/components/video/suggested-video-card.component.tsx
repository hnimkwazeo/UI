import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { IVideo } from 'types/video.type';
import styles from './suggested-video-card.module.scss';


const { Title, Text } = Typography;

interface SuggestedVideoCardProps {
    video: IVideo;
}

const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};


const SuggestedVideoCard = ({ video }: SuggestedVideoCardProps) => {
    const videoId = getYoutubeVideoId(video.url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
        : 'https://placehold.co/160x90?text=Invalid+URL';

    return (
        <Link to={`/videos/${video.id}`} className={styles.cardLink}>
            <Card hoverable className={styles.suggestedCard}>
                <div className={styles.cardContent}>
                    <div className={styles.thumbnail}>
                        <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className={styles.videoThumb}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                            }}
                        />
                        <Text className={styles.duration}>{video.duration}</Text>
                    </div>
                    <div className={styles.meta}>
                        <Title level={5} className={styles.title}>{video.title}</Title>
                        <Text className={styles.description}>
                            <div dangerouslySetInnerHTML={{ __html: video.description }} />
                        </Text>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default SuggestedVideoCard;
