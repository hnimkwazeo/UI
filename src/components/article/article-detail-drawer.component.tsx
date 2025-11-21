import { useMemo } from 'react';
import { Drawer, Typography, Tag, Divider, Image } from 'antd';
import DOMPurify from 'dompurify';
import type { IArticle } from 'types/article.type';
import styles from './article-detail-drawer.module.scss';

const { Title, Paragraph } = Typography;

interface ArticleDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    article: IArticle | null;
}

const ArticleDetailDrawer = ({ open, onClose, article }: ArticleDetailDrawerProps) => {
    const sanitizedContent = useMemo(() => {
        if (article?.content) {
            return DOMPurify.sanitize(article.content);
        }
        return '';
    }, [article]);

    if (!article) return null;

    const thumbnailUrl = article.image
        ? `${import.meta.env.VITE_BACKEND_URL}${article.image}`
        : undefined;

    const audioUrl = article.audio
        ? `${import.meta.env.VITE_BACKEND_URL}${article.audio}`
        : undefined;

    return (
        <Drawer width="56vw" placement="right" onClose={onClose} open={open}>
            {thumbnailUrl && <Image width="100%" src={thumbnailUrl} />}

            <Title level={2} style={{ marginTop: 24 }}>{article.title}</Title>

            <Paragraph>
                <Tag color="blue">{article.category?.name || 'Uncategorized'}</Tag>
            </Paragraph>

            <Paragraph>
                <audio controls src={audioUrl} />
            </Paragraph>

            <Divider />

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </Drawer>
    );
};

export default ArticleDetailDrawer;