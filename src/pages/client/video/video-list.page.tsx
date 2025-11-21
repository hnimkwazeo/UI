import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Typography, Breadcrumb, message, Skeleton, Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './video-list.page.module.scss';
import type { ICategory } from 'types/category.type';
import CategoryCard from 'components/category/category-card.component';
import { fetchCategoriesClientAPI } from 'services/category.service';
import type { IVideo } from 'types/video.type';
import { fetchVideosClientAPI } from 'services/video.service';
import VideoCard from 'components/video/video-card.component';
const { Title } = Typography;


const VideoListPage = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const { t } = useTranslation();
    const [categoryTree, setCategoryTree] = useState<ICategory[]>([]);
    const [currentSubCategories, setCurrentSubCategories] = useState<ICategory[]>([]);
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [breadcrumbPath, setBreadcrumbPath] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCategoryName, setCurrentCategoryName] = useState<string>('');

    useEffect(() => {
        const getCategoryTree = async () => {
            setIsLoading(true);
            try {
                const res = await fetchCategoriesClientAPI('type=VIDEO');
                if (res && res.data) {
                    setCategoryTree(res.data.result);
                }
            } catch (error) {
                message.error(t('errors.fetchDataError'));
            } finally {
                setIsLoading(false);
            }
        };
        getCategoryTree();
    }, [t]);

    useEffect(() => {
        if (categoryTree.length === 0) return;

        setIsLoading(true);
        const id = categoryId ? parseInt(categoryId) : undefined;

        if (id) {
            const { category, path } = findCategoryAndPath(categoryTree, id);
            if (category) {
                setCurrentCategoryName(category.name);
                setCurrentSubCategories(category.subCategories || []);
                setBreadcrumbPath(path);

                const getVideos = async () => {
                    try {
                        const res = await fetchVideosClientAPI(`categoryId=${category.id}`);
                        setVideos(res.data.result);
                    } catch (error) {
                        message.error(t('errors.fetchDataError'));
                    } finally {
                        setIsLoading(false);
                    }
                };
                getVideos();
            } else {
                setIsLoading(false);
            }
        } else {
            setCurrentCategoryName(t('video.pageTitle'));
            setCurrentSubCategories(categoryTree);
            setBreadcrumbPath([]);
            setVideos([]);
            setIsLoading(false);
        }
    }, [categoryId, categoryTree, t]);

    const findCategoryAndPath = (nodes: ICategory[], nodeId: number, path: ICategory[] = []): { category: ICategory | null; path: ICategory[] } => {
        for (const node of nodes) {
            const currentPath = [...path, node];
            if (node.id === nodeId) {
                return { category: node, path: currentPath };
            }
            if (node.subCategories && node.subCategories.length > 0) {
                const result = findCategoryAndPath(node.subCategories, nodeId, currentPath);
                if (result.category) {
                    return result;
                }
            }
        }
        return { category: null, path: [] };
    };

    const renderBreadcrumb = () => (
        <>
            <Breadcrumb className={styles.breadcrumb}>
                <Breadcrumb.Item>
                    <Link to="/videos"><HomeOutlined /></Link>
                </Breadcrumb.Item>
                {breadcrumbPath.map(cat => (
                    <Breadcrumb.Item key={cat.id}>
                        {cat.id === breadcrumbPath[breadcrumbPath.length - 1]?.id ? (
                            <span>{cat.name}</span>
                        ) : (
                            <Link to={`/videos/category/${cat.id}`}>{cat.name}</Link>
                        )}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </>
    );

    if (isLoading) {
        const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
        return (
            <>
                <Card className={styles.pageContainer}>
                    <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                        {skeletons.map(item => (
                            <Col key={item} xs={24} sm={12} md={8} lg={8} xl={6}>
                                <Skeleton active paragraph={{ rows: 2 }} className={styles.pageContainer} />;
                            </Col>
                        ))}
                    </Row>
                </Card>
            </>
        )

    }

    return (
        <Card className={styles.pageContainer}>
            <Title level={2} className={styles.pageTitle}>{currentCategoryName}</Title>

            {categoryId && renderBreadcrumb()}

            {currentSubCategories.length > 0 && (
                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    {currentSubCategories.map(cat => (
                        <Col key={cat.id} xs={24} sm={12} md={8} lg={8}>
                            <CategoryCard category={cat} basePath="videos" />
                        </Col>
                    ))}
                </Row>
            )}

            {categoryId && currentSubCategories.length === 0 && (
                <div className={styles.videoContainer}>
                    <Row gutter={[12, 12]} className={styles.videoCards}>
                        {
                            videos.map(item => (
                                <Col key={item.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                                    <VideoCard video={item} />
                                </Col>
                            ))}
                    </Row>
                </div>
            )}
        </Card>
    );
};

export default VideoListPage;
