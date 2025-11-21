import { Drawer, Typography, Tag, Divider, Descriptions } from 'antd';
import type { IVideo } from 'types/video.type';
import ReactPlayer from 'react-player'
import { formatISODate } from 'utils/format.util';
import styles from './video-detail-drawer.module.scss';
import { useMemo } from 'react';
import DOMPurify from 'dompurify';


const { Title, Paragraph } = Typography;

interface VideoDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    video: IVideo | null;
}

const VideoDetailDrawer = ({ open, onClose, video }: VideoDetailDrawerProps) => {
    const sanitizedContent = useMemo(() => {
        if (video?.description) {
            return DOMPurify.sanitize(video.description);
        }
        return '';
    }, [video]);

    if (!video) return null;

    return (
        <Drawer
            width="50vw"
            placement="right"
            onClose={onClose}
            open={open}
            title="Video Details"
        >
            <div className={styles.playerWrapper}>
                <ReactPlayer
                    className={styles.reactPlayer}
                    src={video.url}
                    width="100%"
                    height="100%"
                    controls={true}
                />
            </div>

            <Title level={3} style={{ marginTop: 24 }}>{video.title}</Title>
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            <Divider />

            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="ID">{video.id}</Descriptions.Item>
                <Descriptions.Item label="Category">
                    <Tag color="blue">{video.category?.name ?? ''}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Duration">{video.duration}</Descriptions.Item>
                <Descriptions.Item label="Created At">{formatISODate(video.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{formatISODate(video.updatedAt)}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default VideoDetailDrawer;