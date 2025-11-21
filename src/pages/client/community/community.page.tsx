import { useState, useEffect } from 'react';
import { Row, Col, Button, Avatar, message, Skeleton, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './community.page.module.scss';
import { useAuthStore } from 'stores/auth.store';
import type { IPost } from 'types/post.type';
import { fetchPostsAPI } from 'services/post.service';
import PostCard from 'components/community/post-card.component';
import CreatePostModal from 'components/community/create-post-modal.component';
import AccountCard from 'components/community/account-card.component';
import ConnectCard from 'components/community/connect-card.component';
import Accept from 'components/common/share/accept.component';
import { useMediaQuery } from 'react-responsive';

const CommunityPage = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const md = useMediaQuery({ maxWidth: 991.98 });

    const fetchPosts = async () => {
        try {
            const res = await fetchPostsAPI(page, 5);
            if (res && res.data) {
                setPosts(prev => {
                    if (prev != res.data.result)
                        return [...prev, ...res.data.result]
                    else
                        return prev
                });
                if (res.data.meta.page >= res.data.meta.pages) {
                    setHasMore(false);
                }
                setPage(prev => prev + 1);
            }
        } catch (error) {
            message.error(t('errors.fetchPostsError'));
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost: IPost) => {
        setPosts([newPost, ...posts]);
    };

    const handlePostDeleted = (postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    return (
        <div className={styles.pageContainer}>
            <Row gutter={[md ? 0 : 16, md ? 0 : 16]}>
                <Col xs={24} sm={24} md={24} lg={16}>
                    <Accept apiPath="/api/v1/posts" method="POST" hide>
                        <Card className={styles.createPostTrigger}>
                            <Avatar style={{ backgroundColor: '#1677ff' }}>{user?.name?.charAt(0)}</Avatar>
                            <Button type="text" onClick={() => setIsModalOpen(true)} className={styles.triggerButton}>
                                {t('community.postPlaceholder')}
                            </Button>
                        </Card>
                    </Accept>

                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchPosts}
                        hasMore={hasMore}
                        loader={<Skeleton avatar paragraph={{ rows: 4 }} active />}
                        endMessage={<p style={{ textAlign: 'center' }}><b>{t('common.endOfResults')}</b></p>}
                    >
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
                        ))}
                    </InfiniteScroll>
                </Col>

                {
                    !md &&
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <AccountCard />
                        <ConnectCard />
                    </Col>
                }
            </Row>

            <CreatePostModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    );
};

export default CommunityPage;
