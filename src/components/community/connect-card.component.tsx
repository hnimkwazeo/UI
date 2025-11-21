import { useState, useEffect } from 'react';
import { Card, List, Avatar, Typography, message } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { IUser } from 'types/user.type';
import styles from 'pages/client/community/community.page.module.scss';
import { useAuthStore } from 'stores/auth.store';
import { fetchLeaderboardAPI } from 'services/leaderboard.service';

const { Title } = Typography;

const ConnectCard = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSuggestedUsers = async () => {
            try {
                const res = await fetchLeaderboardAPI('');
                if (res && res.data) {
                    const allUsers = res.data.result;

                    const finalUsers = allUsers
                        .filter(item => item.id !== user?.id)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);

                    setUsers(finalUsers);
                }
            } catch (error) {
                message.error(t('errors.fetchSuggestedUsersError'));
            } finally {
                setIsLoading(false);
            }
        };
        getSuggestedUsers();
    }, [t]);

    const avatarColors = ['#ff7875', '#ff9c6e', '#ffd666', '#95de64', '#5cdbd3', '#69b1ff', '#b37feb', '#ff85c0'];

    return (
        <Card title={<Title level={5}>{t('community.connectSuggestions')}</Title>} className={styles.widgetCard}>
            <List
                loading={isLoading}
                itemLayout="horizontal"
                dataSource={users}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            className={styles.userMeta}
                            avatar={<Avatar style={{ backgroundColor: avatarColors[index % avatarColors.length] }} size={40}>{item.name.charAt(0)}</Avatar>}
                            title={<a href="#">{item.name}</a>}
                            description={`${item.point || 0} ${t('community.points')} • ${item.badge?.name || 'N/A'}`}
                        />
                    </List.Item>
                )}
            />
            <div className={styles.viewAll}>
                <Link to="/leaderboard">{t('community.viewAllSuggestions')}</Link>
            </div>
        </Card>
    );
};

export default ConnectCard;
