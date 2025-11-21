import { Form, Input, Button, Divider, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './auth.page.module.scss';
import { useAuthStore } from 'stores/auth.store';
import { loginAPI, loginGoogleAPI } from 'services/auth.service';
import type { ILoginCredentials, ILoginResponse } from 'types/auth.type';
import loginIllustration from '@/assets/images/logo.png';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuthStore();

    const handleAuthSuccess = (data: ILoginResponse) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
        message.success(t('login.loginSuccess'));
        if (data.user.role.name === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const handleEmailLogin = async (values: ILoginCredentials) => {
        try {
            const res = await loginAPI(values);
            if (res && res.data) {
                handleAuthSuccess(res.data);
            } else {
                message.error(res.message || t('errors.loginFailed'));
            }
        } catch (error) {
            message.error(t('errors.loginFailed'));
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                const res = await loginGoogleAPI({ code: codeResponse.code });
                if (res && res.data) {
                    handleAuthSuccess(res.data);
                } else {
                    message.error(res.message || t('errors.googleLoginFailed'));
                }
            } catch (error) {
                message.error(t('errors.googleLoginFailed'));
            }
        },
        onError: (errorResponse) => {
            console.error("Google login error", errorResponse);
            message.error(t('errors.googleLoginFailed'));
        },
    });

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.illustrationWrapper}>
                    <img src={loginIllustration} alt="Login Illustration" />
                </div>
                <div className={styles.formWrapper}>
                    <Title level={2} className={styles.title}>{t('login.title')}</Title>
                    <Form onFinish={handleEmailLogin} layout="vertical">
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: t('validation.emailRequired') },
                                { type: 'email', message: t('validation.emailInvalid') }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder={t('login.emailPlaceholder')} size="large" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: t('validation.passwordRequired') },
                                { min: 8, message: t('validation.passwordMinLength') }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder={t('login.passwordPlaceholder')} size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Link href="/forgot-password" className={styles.forgotPassword}>{t('login.forgotPassword')}</Link>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block>
                                {t('login.submit')}
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider><Text type="secondary">{t('login.or')}</Text></Divider>
                    <div className={styles.socialLogin}>
                        <Button size="large" icon={<GoogleOutlined />} onClick={() => handleGoogleLogin()}>Google</Button>
                    </div>
                    <Text className={styles.footerText}>
                        {t('login.dontHaveAccount')} <Link href="/register">{t('login.register')}</Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
