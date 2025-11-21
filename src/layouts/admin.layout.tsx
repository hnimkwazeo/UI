import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import {
    AppstoreOutlined,
    BookOutlined,
    CodeOutlined,
    CustomerServiceOutlined,
    DashboardOutlined,
    FileDoneOutlined,
    LineChartOutlined,
    LockOutlined,
    LogoutOutlined,
    PicCenterOutlined,
    PicLeftOutlined,
    TrophyOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import styles from './admin.layout.module.scss';
import Logo from 'assets/images/logo.png';
import { useAuthStore } from 'stores/auth.store';
import { Button, message, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/admin/logging', name: 'Monitor', icon: <CodeOutlined /> },
    { path: '/admin/permissions', name: 'Permission', icon: <LockOutlined /> },
    { path: '/admin/users', name: 'User', icon: <UserOutlined /> },
    { path: '/admin/plans', name: 'Plan', icon: <AppstoreOutlined /> },
    { path: '/admin/subscriptions', name: 'Subscription', icon: <FileDoneOutlined /> },
    { path: '/admin/statistics', name: 'Statistic', icon: <LineChartOutlined /> },
    { path: '/admin/badges', name: 'Badge', icon: <TrophyOutlined /> },
    { path: '/admin/articles', name: 'Article', icon: <BookOutlined /> },
    { path: '/admin/videos', name: 'Video', icon: <VideoCameraOutlined /> },
    { path: '/admin/grammars', name: 'Grammar', icon: <PicLeftOutlined /> },
    { path: '/admin/vocabularies', name: 'Vocabulary', icon: <PicCenterOutlined /> },
    { path: '/admin/dictations', name: 'Dictation', icon: <CustomerServiceOutlined /> },
];

const AdminLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        message.success(t('logout.success'));
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <ProLayout
                logo={Logo}
                title="ADMIN PAGE"
                layout="mix"
                location={{
                    pathname: location.pathname,
                }}
                menuDataRender={() => menuItems}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || !menuItemProps.path) return defaultDom;
                    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
                }}
                avatarProps={{
                    title: user?.name,
                    icon: <UserOutlined />
                }}
                actionsRender={(props) => {
                    return [
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
                    ];
                }}
            >
                <div className={styles.content}>
                    <Outlet />
                </div>
            </ProLayout>
        </div>
    );
};

export default AdminLayout;
