import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, message, Skeleton, Button, Empty, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './article-detail.page.module.scss';
import type { IArticle } from 'types/article.type';
import { fetchArticleDetailClientAPI } from 'services/article.service';
import Logo from 'assets/images/logo.png';
import { useMediaQuery } from 'react-responsive';

const { Title } = Typography;

const ArticleDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [article, setArticle] = useState<IArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const sm = useMediaQuery({ maxWidth: 767.98 });

    useEffect(() => {
        if (!id) return;

        const getArticleDetail = async () => {
            setIsLoading(true);
            try {
                const res = await fetchArticleDetailClientAPI(parseInt(id));
                if (res && res.data) {
                    setArticle(res.data);
                } else {
                    message.error(t('errors.fetchArticleDetail'));
                }
            } catch (error) {
                message.error(t('errors.fetchArticleDetail'));
            } finally {
                setIsLoading(false);
            }
        };

        getArticleDetail();
    }, [id, t]);

    if (isLoading) {
        return <Card className={styles.detailContainer}><Skeleton active paragraph={{ rows: 10 }} /></Card>;
    }

    if (!article) {
        return <Card bordered={false} className={styles.detailContainer}>
            <Empty
                image={Logo}
                imageStyle={{ height: 100 }}
                description={t('errors.articleNotFound')}
            />
        </Card>;
    }

    return (
        <Card bordered={false} className={styles.detailContainer}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className={styles.backButton}
            >
                {t('common.back')}
            </Button>

            <div className={styles.articleDetail}>
                <Image className={styles.articleImage} width="100%" height={sm ? 250 : 400} src={`${import.meta.env.VITE_BACKEND_URL}${article.image}`} />
                <Title level={2} className={styles.articleTitle}>{article.title}</Title>
                <audio className={styles.articleAudio} controls src={`${import.meta.env.VITE_BACKEND_URL}${article.audio}`} />
                <div
                    className={styles.articleContent}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </Card>
    );
};

export default ArticleDetailPage;
