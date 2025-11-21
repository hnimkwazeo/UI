import { useState } from 'react';
import { Form, Input, Button, Typography, message, Steps } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './auth.page.module.scss';
import { forgotPasswordAPI, resetPasswordAPI } from 'services/auth.service';
import loginIllustration from '@/assets/images/logo.png';
const { Title, Text, Paragraph } = Typography;

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (values: { email: string }) => {
        setIsLoading(true);
        try {
            await forgotPasswordAPI(values);
            message.success(t('forgotPassword.otpSent'));
            setEmail(values.email);
            setCurrentStep(1);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('errors.forgotPasswordError');
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (values: any) => {
        setIsLoading(true);
        try {
            const payload = {
                email: email,
                otp: values.otp,
                newPassword: values.newPassword,
            };
            await resetPasswordAPI(payload);
            message.success(t('forgotPassword.resetSuccess'));
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('errors.resetPasswordError');
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        {
            title: t('forgotPassword.step1Title'),
            content: (
                <Form form={form} onFinish={handleSendOtp} layout="vertical">
                    <Paragraph type="secondary">{t('forgotPassword.step1Desc')}</Paragraph>
                    <Form.Item name="email" rules={[{ required: true, message: t('validation.emailRequired') }, { type: 'email', message: t('validation.emailInvalid') }]}>
                        <Input prefix={<MailOutlined />} placeholder={t('register.emailPlaceholder')} size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                            {t('forgotPassword.sendOtpButton')}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: t('forgotPassword.step2Title'),
            content: (
                <Form form={form} onFinish={handleResetPassword} layout="vertical">
                    <Paragraph type="secondary">{t('forgotPassword.step2Desc', { email })}</Paragraph>
                    <Form.Item name="otp" rules={[{ required: true, message: t('validation.otpRequired') }]}>
                        <Input.OTP length={6} size="large" />
                    </Form.Item>
                    <Form.Item name="newPassword" rules={[{ required: true, message: t('validation.passwordRequired') }, { min: 8, message: t('validation.passwordMinLength') }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder={t('forgotPassword.newPasswordPlaceholder')} size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                            {t('forgotPassword.resetButton')}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.illustrationWrapper}>
                    <img src={loginIllustration} alt="Forgot Password Illustration" />
                </div>
                <div className={styles.formWrapper}>
                    <Title level={2} className={styles.title}>{t('forgotPassword.title')}</Title>
                    <Steps current={currentStep} className={styles.steps}>
                        {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div className={styles.stepContent}>{steps[currentStep].content}</div>
                    <Text className={styles.footerText}>
                        <Link to="/login"><ArrowLeftOutlined /> {t('forgotPassword.backToLogin')}</Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
