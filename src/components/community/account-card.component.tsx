import { Card, Avatar, Typography, Button, Form, message, Collapse, Input } from 'antd';
import { LockOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'stores/auth.store';
import styles from 'pages/client/community/community.page.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { updatePasswordAPI } from 'services/user.service';
const { Panel } = Collapse;

const { Title, Text } = Typography;

const AccountCard = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const isProfile = window.location.pathname === '/profile';

    if (!user) {
        return null;
    }

    const handleUpdatePassword = async (values: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            };
            await updatePasswordAPI(payload);
            message.success(t('profile.passwordUpdateSuccess'));
            form.resetFields();
            setShowPasswordForm(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('errors.passwordUpdateError');
            message.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderButton = () => {
        if (isProfile) {
            return (
                <Button
                    style={{ width: '100%' }}
                    type="primary"
                    icon={<SettingOutlined />}
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                    {showPasswordForm ? t('common.cancel') : t('profile.changePassword')}
                </Button>
            );
        }
        return (
            <Link to="/profile" style={{ width: '100%' }}>
                <Button style={{ width: '100%' }} type="primary" icon={<SettingOutlined />}>
                    {t('community.editProfile')}
                </Button>
            </Link>
        );
    };

    return (
        <>
            <Card className={styles.widgetCard}>
                <div className={styles.accountHeader}>
                    <div className={styles.coverPhoto}></div>
                    <Avatar size={80} className={styles.profileAvatar}>
                        {user.name?.charAt(0)}
                    </Avatar>
                </div>
                <div className={styles.accountInfo}>
                    <Title level={4}>{user.name}</Title>
                    <Text type="secondary">@{user.email?.split('@')[0]}</Text>
                    <div className={styles.stats}>
                        <Text><strong>{user.point || 0}</strong> {t('community.points')}</Text>
                        <Text>{t('community.rank')} <strong>{user.badge?.name || 'N/A'}</strong></Text>
                    </div>

                    {renderButton()}
                </div>
            </Card>

            {
                isProfile && (
                    <Collapse activeKey={showPasswordForm ? ['1'] : []} ghost>
                        <Panel key="1" showArrow={false} header={null} style={{ padding: 0 }}>
                            <Card className={styles.passwordFormCard}>
                                <Title level={5}>{t('profile.changePassword')}</Title>
                                <Form form={form} layout="vertical" onFinish={handleUpdatePassword}>
                                    <Form.Item
                                        name="currentPassword"
                                        label={t('profile.currentPassword')}
                                        rules={[{ required: true, message: t('validation.passwordRequired') }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} />
                                    </Form.Item>
                                    <Form.Item
                                        name="newPassword"
                                        label={t('profile.newPassword')}
                                        rules={[
                                            { required: true, message: t('validation.passwordRequired') },
                                            { min: 8, message: t('validation.passwordMinLength') }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmNewPassword"
                                        label={t('profile.confirmNewPassword')}
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true, message: t('validation.passwordRequired') },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t('validation.passwordsDoNotMatch')));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
                                            {t('profile.updatePassword')}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Panel>
                    </Collapse>
                )
            }
        </>
    );
};

export default AccountCard;
