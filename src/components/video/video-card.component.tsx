import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import styles from './video-card.module.scss';
import { formatISODate } from 'utils/format.util';
import type { IVideo } from 'types/video.type';
import ReactPlayer from 'react-player'

const { Title, Paragraph } = Typography;

interface VideoCardProps {
    video: IVideo;
}

const VideoCard = ({ video }: VideoCardProps) => {

    return (
        <Link to={`/videos/${video.id}`}>
            <div className={styles.videoCard}>
                <div className={styles.playerWrapper}>
                    <ReactPlayer
                        className={styles.reactPlayer}
                        src={video.url}
                        width="100%"
                        height="100%"
                        controls={true}
                    />
                </div>
                <Title ellipsis={{ rows: 2 }} level={5} className={styles.cardTitle}>{video.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }} className={styles.cardDesc}>
                    <div dangerouslySetInnerHTML={{ __html: video.description }} />
                </Paragraph>
                <Paragraph className={styles.cardTime}>
                    <div>{video.duration}</div>
                    <div>{formatISODate(video.createdAt)}</div>
                </Paragraph>
            </div>
        </Link>
    );
};

export default VideoCard;
