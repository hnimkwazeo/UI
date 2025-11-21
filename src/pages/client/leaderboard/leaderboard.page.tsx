import { useEffect, useState } from 'react';
import { Row, Col, Card, message, List, Avatar, Space, Skeleton, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { CrownFilled } from '@ant-design/icons';
import type { IUser } from 'types/user.type';
import type { IBadge } from 'types/badge.type';
import { fetchLeaderboardAPI } from 'services/leaderboard.service';
import { fetchBadgesClientAPI } from 'services/badge.service';
import styles from './leaderboard.page.module.scss';
import icon_point from '@/assets/icons/dashboard/point.png';
import icon_streak from '@/assets/icons/dashboard/streak.png';
import { fetchUserDashboardAPI } from 'services/user-dashboard.service';
import type { IUserDashboard } from 'types/user-dashboard.type';
import { useAuthStore } from 'stores/auth.store';
import { useMediaQuery } from 'react-responsive';

const LeaderboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [leaderboard, setLeaderboard] = useState<IUser[]>([]);
    const [badges, setBadges] = useState<IBadge[]>([]);
    const [activeBadge, setActiveBadge] = useState<IBadge | null>(null);
    const [currentUser, setCurrentUser] = useState<IUserDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState('');

    const md = useMediaQuery({ maxWidth: 991.98 });

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date();
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
            endOfWeek.setHours(23, 59, 59, 999);

            const diff = endOfWeek.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setTimeRemaining(`${days} ${t('leaderboard.days')}`);
        };
        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, [t]);

    useEffect(() => {
        const getBadges = async () => {
            try {
                const res = await fetchBadgesClientAPI('');
                if (res && res.data) {
                    setBadges(res.data.result);
                    if (res.data.result.length > 0) {
                        setActiveBadge(res.data.result[0]);
                    }
                }
            } catch (error) {
                message.error(t('errors.fetchBadges'));
            }
        };
        getBadges();
    }, [t]);

    useEffect(() => {
        if (!activeBadge) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const query = activeBadge.id ? `badgeId=${activeBadge.id}` : '';
                const res = await fetchLeaderboardAPI(query);
                if (res && res.data) {
                    setLeaderboard(res.data.result);
                }
            } catch (error) {
                message.error(t('errors.fetchLeaderboard'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeBadge, t]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const dashboardRes = await fetchUserDashboardAPI();

                if (dashboardRes && dashboardRes.data) {
                    setCurrentUser(dashboardRes.data);
                }

            } catch (error) {
                message.error("Failed to fetch homepage data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <CrownFilled style={{ color: '#FFD700' }} />;
        if (index === 1) return <CrownFilled style={{ color: '#C0C0C0' }} />;
        if (index === 2) return <CrownFilled style={{ color: '#CD7F32' }} />;
        return <b>{index + 1}</b>;
    };

    if (isLoading && leaderboard.length === 0) {
        return (
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </Card>
                        <Card>
                            <Skeleton active paragraph={{ rows: 3 }} />
                        </Card>
                    </Space>
                </Col>
            </Row>
        );
    }

    const avatarColors = ['#ff7875', '#ff9c6e', '#ffd666', '#95de64', '#5cdbd3', '#69b1ff', '#b37feb', '#ff85c0'];

    return (
        <div className={styles.leaderboardContainer}>
            <Row gutter={[md ? 0 : 16, md ? 0 : 16]} className={styles.container}>
                <Col xs={24} lg={16}>
                    {
                        md &&
                        <Card bordered={false} className={styles.statsCard}>
                            <div className={styles.statisc}>
                                <div className={styles.statiscItem}>
                                    <div className={styles.statiscItemIcon}>
                                        <img src={icon_point} alt="point" />
                                    </div>
                                    <div className={styles.statiscItemValue}>{currentUser?.userPoints}</div>
                                    <div className={styles.statiscItemTitle}>{t('homepage.points')}</div>
                                </div>
                                <div className={styles.statiscItem}>
                                    <div className={styles.statiscItemIcon}>
                                        <img src={icon_streak} alt="streak" />
                                    </div>
                                    <div className={styles.statiscItemValue}>{currentUser?.currentStreak}</div>
                                    <div className={styles.statiscItemTitle}>{t('homepage.streak')}</div>
                                </div>
                                <div className={styles.statiscItem}>
                                    <div className={styles.statiscItemIcon}>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}${currentUser?.badges?.image}`} alt="badge" />
                                    </div>
                                    <div className={styles.statiscItemValueRank}>{currentUser?.badges?.name}</div>
                                    <div className={styles.statiscItemTitle}>{t('homepage.rank')}</div>
                                </div>
                            </div>
                        </Card>
                    }

                    <Card bordered={false} className={styles.mainCard}>
                        <div className={styles.header}>
                            <h1>{t('leaderboard.weeklyRanking')}</h1>
                        </div>

                        <Tabs
                            activeKey={activeBadge?.id.toString()}
                            centered
                            onChange={(key) => {
                                const newActiveBadge = badges.find(b => b.id.toString() === key);
                                if (newActiveBadge) setActiveBadge(newActiveBadge);
                            }}
                            items={badges.map(badge => ({
                                key: badge.id.toString(),
                                label: (
                                    <div className={styles.tabLabel}>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}${badge.image}`} alt={badge.name} />
                                        <span>{badge.name}</span>
                                    </div>
                                ),
                            }))}
                        />

                        <div className={styles.leagueInfo}>
                            <h2>{t('leaderboard.leagueTitle', { leagueName: activeBadge?.name.toUpperCase() })}</h2>
                            <p><strong>{t('leaderboard.timeRemaining', { time: timeRemaining })}</strong></p>
                        </div>

                        <List
                            itemLayout="horizontal"
                            dataSource={leaderboard}
                            className={styles.rankList}
                            renderItem={(item, index) => {
                                const isCurrentUser = item.id === user?.id;
                                return (
                                    <List.Item className={`${styles.rankItem} ${index < 3 ? styles[`top${index + 1}`] : ''} ${isCurrentUser ? styles.currentUserItem : ''}`}>
                                        <div className={styles.rankNumber}>
                                            {getRankIcon(index)}
                                        </div>
                                        <List.Item.Meta
                                            avatar={<Avatar size={48} style={{ backgroundColor: avatarColors[index % avatarColors.length] }}>{item.name.charAt(0).toUpperCase()}</Avatar>}
                                            title={<b className={styles.rankName}>{item.name}</b>}
                                            description={`${t('leaderboard.rank')} ${item.badge.name}`}
                                        />
                                        <div className={styles.rankPoints}>
                                            <b>{item.point} {t('homepage.points')}</b>
                                        </div>
                                    </List.Item>
                                )
                            }}
                        />
                    </Card>
                </Col>

                {
                    !md &&
                    <Col xs={24} lg={8}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Card bordered={false} className={styles.statsCard}>
                                <div className={styles.statisc}>
                                    <div className={styles.statiscItem}>
                                        <div className={styles.statiscItemIcon}>
                                            <img src={icon_point} alt="point" />
                                        </div>
                                        <div className={styles.statiscItemValue}>{currentUser?.userPoints}</div>
                                        <div className={styles.statiscItemTitle}>{t('homepage.points')}</div>
                                    </div>
                                    <div className={styles.statiscItem}>
                                        <div className={styles.statiscItemIcon}>
                                            <img src={icon_streak} alt="streak" />
                                        </div>
                                        <div className={styles.statiscItemValue}>{currentUser?.currentStreak}</div>
                                        <div className={styles.statiscItemTitle}>{t('homepage.streak')}</div>
                                    </div>
                                    <div className={styles.statiscItem}>
                                        <div className={styles.statiscItemIcon}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}${currentUser?.badges?.image}`} alt="badge" />
                                        </div>
                                        <div className={styles.statiscItemValueRank}>{currentUser?.badges?.name}</div>
                                        <div className={styles.statiscItemTitle}>{t('homepage.rank')}</div>
                                    </div>
                                </div>
                            </Card>

                            <Card bordered={false} className={styles.infoCard}>
                                <h3>{t('leaderboard.whatIsRanking')}</h3>
                                <p>{t('leaderboard.explanation')}</p>
                            </Card>
                        </Space>
                    </Col>
                }
            </Row>
        </div>
    );
};

export default LeaderboardPage;
