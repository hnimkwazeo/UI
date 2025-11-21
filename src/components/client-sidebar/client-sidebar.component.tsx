import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    BookOutlined,
    BulbOutlined,
    TranslationOutlined,
    ReadOutlined,
    PlaySquareOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined,
    HomeOutlined,
    PicLeftOutlined,
    OrderedListOutlined,
    LogoutOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';
import styles from './client-sidebar.module.scss';
import LanguageSwitcher from '@/components/common/language-switcher/language-switcher.component';
import ThemeSwitcher from '@/components/common/theme-switcher/theme-switcher.component';
import NotificationBell from '@/components/notification/notification-bell.component';
import { useMediaQuery } from 'react-responsive';
import { useAuthStore } from 'stores/auth.store';
import { Button, message, Popconfirm } from 'antd';

const ClientSidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const md = useMediaQuery({ minWidth: 992 });

    const handleLogout = async () => {
        await logout();
        message.success(t('logout.success'));
        navigate('/login');
    };

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: t('sidebar.home') },
        { key: '/dictionary', icon: <TranslationOutlined />, label: t('sidebar.dictionary') },
        { key: '/vocabularies', icon: <BulbOutlined />, label: t('sidebar.vocabulary') },
        { key: '/notebook', icon: <BookOutlined />, label: t('sidebar.notebook') },
        { key: '/grammars', icon: <ReadOutlined />, label: t('sidebar.grammar') },
        { key: '/articles', icon: <PicLeftOutlined />, label: t('sidebar.blog') },
        { key: '/videos', icon: <PlaySquareOutlined />, label: t('sidebar.video') },
        { key: '/dictations', icon: <CustomerServiceOutlined />, label: t('sidebar.dictation') },
        { key: '/community', icon: <TeamOutlined />, label: t('sidebar.community') },
        { key: '/store', icon: <ShopOutlined />, label: t('sidebar.store') },
        { key: '/profile', icon: <UserOutlined />, label: t('sidebar.profile') },
    ];

    !md && menuItems.push({ key: '/leaderboard', icon: <OrderedListOutlined />, label: t('sidebar.leaderboard') });


    return (
        <div className={styles.sidebar}>
            <div className={styles.logo} onClick={() => navigate('/')}>
                4Stars
            </div>
            <nav className={styles.menuContainer}>
                {menuItems.map(item => (
                    <NavLink
                        key={item.key}
                        to={item.key}
                        className={({ isActive }) =>
                            `${styles.menuItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span >{item.label} </span>
                    </NavLink>
                ))}
            </nav>
            <div className={styles.bottomControls}>
                <Popconfirm
                    title={t('logout.confirmTitle')}
                    onConfirm={handleLogout}
                    okText={t('common.yes')}
                    cancelText={t('common.no')}
                >
                    <Button
                        type="text"
                        size="large"
                        icon={<LogoutOutlined className={styles.logoutIcon} />}
                        title={t('sidebar.logout')}
                    />
                </Popconfirm>
                <LanguageSwitcher />
                <ThemeSwitcher />
                <NotificationBell />
            </div>
        </div>
    );
};

export default ClientSidebar;
