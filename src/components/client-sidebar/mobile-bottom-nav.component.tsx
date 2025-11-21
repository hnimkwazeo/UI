import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Drawer, List, message, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import {
    TranslationOutlined, BulbOutlined, TeamOutlined,
    BookOutlined, ReadOutlined, PlaySquareOutlined, ShopOutlined, UserOutlined,
    MenuOutlined,
    HomeOutlined,
    PicLeftOutlined,
    OrderedListOutlined,
    LogoutOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';
import styles from './mobile-bottom-nav.module.scss';
import LanguageSwitcher from 'components/common/language-switcher/language-switcher.component';
import ThemeSwitcher from 'components/common/theme-switcher/theme-switcher.component';
import NotificationBell from 'components/notification/notification-bell.component';
import { useAuthStore } from 'stores/auth.store';

const MobileBottomNav = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
        message.success(t('logout.success'));
        navigate('/login');
    };


    const mainItems = [
        { key: '/dictionary', icon: <TranslationOutlined />, label: t('sidebar.dictionary') },
        { key: '/vocabularies', icon: <BulbOutlined />, label: t('sidebar.vocabulary') },
        { key: '/', icon: <HomeOutlined />, label: t('sidebar.home') },
        { key: '/notebook', icon: <BookOutlined />, label: t('sidebar.notebook') },
    ];

    const moreItems = [
        { key: '/grammars', icon: <ReadOutlined />, label: t('sidebar.grammar') },
        { key: '/articles', icon: <PicLeftOutlined />, label: t('sidebar.blog') },
        { key: '/videos', icon: <PlaySquareOutlined />, label: t('sidebar.video') },
        { key: '/dictations', icon: <CustomerServiceOutlined />, label: t('sidebar.dictation') },
        { key: '/community', icon: <TeamOutlined />, label: t('sidebar.community') },
        { key: '/store', icon: <ShopOutlined />, label: t('sidebar.store') },
        { key: '/profile', icon: <UserOutlined />, label: t('sidebar.profile') },
        { key: '/leaderboard', icon: <OrderedListOutlined />, label: t('sidebar.leaderboard') }
    ];

    const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
        <NavLink to={to} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
        </NavLink>
    );

    return (
        <>
            <div className={styles.bottomNav}>
                {mainItems.map(item => <NavItem key={item.key} to={item.key} icon={item.icon} label={item.label} />)}
                <div className={styles.navItem} onClick={() => setDrawerVisible(true)}>
                    <span className={styles.icon}><MenuOutlined /></span>
                    <span className={styles.label}>{t('sidebar.more')}</span>
                </div>
            </div>
            <Drawer
                title={t('sidebar.more')}
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                height="auto"
                className={styles.moreDrawer}
                width={250}
            >
                <List
                    dataSource={moreItems}
                    renderItem={item => (
                        <List.Item>
                            <NavLink to={item.key} onClick={() => setDrawerVisible(false)} className={styles.drawerItem}>
                                {item.icon} {item.label}
                            </NavLink>
                        </List.Item>
                    )}
                />
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
            </Drawer>
        </>
    );
};

export default MobileBottomNav;
