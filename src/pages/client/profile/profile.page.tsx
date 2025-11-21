import { useState, useEffect } from 'react';
import { Row, Col, message, Skeleton, Card, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './profile.page.module.scss';
import type { IPost } from 'types/post.type';
import { fetchMyPostsAPI } from 'services/post.service';
import PostCard from 'components/community/post-card.component';
import AccountCard from 'components/community/account-card.component';
import icon_streak from '@/assets/icons/dashboard/streak.png';
import icon_point from '@/assets/icons/dashboard/point.png';
import type { IUserDashboard } from 'types/user-dashboard.type';
import { fetchUserDashboardAPI } from 'services/user-dashboard.service';
import Logo from 'assets/images/logo.png';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [dashboardData, setDashboardData] = useState<IUserDashboard | null>(null);

    const md = useMediaQuery({ maxWidth: 991.98 });

    const fetchPosts = async () => {
        try {
            const res = await fetchMyPostsAPI(page, 20);
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
        const fetchData = async () => {
            try {
                const dashboardRes = await fetchUserDashboardAPI();

                if (dashboardRes && dashboardRes.data) {
                    setDashboardData(dashboardRes.data);
                }
            } catch (error) {
                message.error("Failed to fetch user data.");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostDeleted = (postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    return (
        <div className={styles.pageContainer}>
            <Row gutter={[md ? 0 : 16, md ? 0 : 16]}>

                {
                    md &&
                    <Col xs={24} sm={24} md={24} lg={8} className={styles.rightContainer}>
                        <div className={styles.accountCardContainer}>
                            <AccountCard />
                        </div>
                    </Col>
                }
                <Col xs={24} sm={24} md={24} lg={16}>
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchPosts}
                        hasMore={hasMore}
                        loader={<Skeleton avatar paragraph={{ rows: 4 }} active />}
                        endMessage={
                            <>
                                {
                                    posts.length === 0 && <Card style={{ height: 'calc(100vh - 48px)' }}>
                                        <Empty
                                            image={Logo}
                                            imageStyle={{ height: 100 }}
                                            description={
                                                <>
                                                    <h2>{t('common.noPost')}</h2>
                                                    <Link to="/community">{t('sidebar.community')}</Link>
                                                </>}
                                        />
                                    </Card>
                                }
                            </>
                        }
                    >
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
                        ))}
                    </InfiniteScroll>
                </Col>

                {
                    !md &&
                    <Col xs={24} sm={24} md={24} lg={8} className={styles.rightContainer}>
                        <div className={styles.accountCardContainer}>
                            <AccountCard />

                            <Card bordered={false} className={styles.statsCard}>
                                <div className={styles.statisc}>
                                    <div className={styles.statiscItem}>
                                        <div className={styles.statiscItemIcon}>
                                            <img src={icon_point} alt="point" />
                                        </div>
                                        <div className={styles.statiscItemValue}>{dashboardData?.userPoints}</div>
                                        <div className={styles.statiscItemTitle}>{t('homepage.points')}</div>
                                    </div>
                                    <div className={styles.statiscItem}>
                                        <div className={styles.statiscItemIcon}>
                                            <img src={icon_streak} alt="streak" />
                                        </div>
                                        <div className={styles.statiscItemValue}>{dashboardData?.currentStreak}</div>
                                        <div className={styles.statiscItemTitle}>{t('homepage.streak')}</div>
                                    </div>
                                    <div className={styles.statiscItem}>
                                        <div className={styles.statiscItemIcon}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}${dashboardData?.badges?.image}`} alt="badge" />
                                        </div>
                                        <div className={styles.statiscItemValueRank}>{dashboardData?.badges?.name}</div>
                                        <div className={styles.statiscItemTitle}>{t('homepage.rank')}</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                }
            </Row>
        </div>
    );
};

export default ProfilePage;
