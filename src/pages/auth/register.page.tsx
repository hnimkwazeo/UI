import { Form, Input, Button, Divider, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './auth.page.module.scss';
import { useAuthStore } from 'stores/auth.store';
import { registerAPI, loginGoogleAPI } from 'services/auth.service';
import type { IRegisterPayload, ILoginResponse } from 'types/auth.type';
import loginIllustration from '@/assets/images/logo.png';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuthStore();

    const handleAuthSuccess = (data: ILoginResponse) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
        message.success(t('login.loginSuccess'));
        navigate('/');
    };

    const handleRegister = async (values: IRegisterPayload) => {
        try {
            const res = await registerAPI(values);
            if (res && res.data) {
                message.success(t('register.registerSuccess'));
                navigate('/login');
            } else {
                message.error(res.message || t('errors.registerFailed'));
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('errors.registerFailed');
            message.error(errorMessage);
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
                    <img src={loginIllustration} alt="Register Illustration" />
                </div>
                <div className={styles.formWrapper}>
                    <Title level={2} className={styles.title}>{t('register.title')}</Title>
                    <Form onFinish={handleRegister} layout="vertical">
                        <Form.Item name="name" rules={[{ required: true, message: t('validation.nameRequired') }, { max: 100, message: t('validation.nameMaxLength') }]}>
                            <Input prefix={<UserOutlined />} placeholder={t('register.namePlaceholder')} size="large" />
                        </Form.Item>
                        <Form.Item name="email" rules={[{ required: true, message: t('validation.emailRequired') }, { type: 'email', message: t('validation.emailInvalid') }]}>
                            <Input prefix={<MailOutlined />} placeholder={t('register.emailPlaceholder')} size="large" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: t('validation.passwordRequired') }, { min: 8, message: t('validation.passwordMinLength') }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder={t('register.passwordPlaceholder')} size="large" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" dependencies={['password']} rules={[
                            { required: true, message: t('validation.confirmPasswordRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('validation.passwordsDoNotMatch')));
                                },
                            }),
                        ]}>
                            <Input.Password prefix={<LockOutlined />} placeholder={t('register.confirmPasswordPlaceholder')} size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block>
                                {t('register.submit')}
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider><Text type="secondary">{t('login.or')}</Text></Divider>
                    <Button size="large" icon={<GoogleOutlined />} onClick={() => handleGoogleLogin()} block>
                        {t('login.continueWithGoogle')}
                    </Button>
                    <Text className={styles.footerText}>
                        {t('register.alreadyHaveAccount')} <Link to="/login">{t('login.title')}</Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
