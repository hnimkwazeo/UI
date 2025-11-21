import { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Card, Divider, message } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './premium.page.module.scss';
import featureCommunity from 'assets/images/premium/community.png';
import FeatureBlock from 'components/premium/feature-block.component';
import DetailedFeature from 'components/premium/detailed-feature.component';
import { Link, useNavigate } from 'react-router-dom';
import type { IPlan } from 'types/plan.type';
import { fetchPlansClientAPI } from 'services/plan.service';
import { formatCurrency } from 'utils/format.util';
import heroImage from 'assets/images/premium/hero-image.png';
import iconLearn from 'assets/images/premium/icon-learn.png';
import iconSearch from 'assets/images/premium/icon-search.png';
import iconCommunity from 'assets/images/premium/icon-community.png';
import featureLearn from 'assets/images/premium/review.png';
import featureSearch from 'assets/images/premium/dictionary.png';
import featureVideo from 'assets/images/premium/video.png';
import { useAuthStore } from 'stores/auth.store';
import { createSubscriptionAPI } from 'services/subscription.service';
import { createVNPayPaymentAPI } from 'services/payment.service';

const { Title, Paragraph, Text } = Typography;

const PremiumPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [isProcessingId, setIsProcessingId] = useState<number | null>(null);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await fetchPlansClientAPI('active=true');
                if (res && res.data) {
                    setPlans(res.data.result);
                }
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
            }
        };

        loadPlans();
    }, []);

    const handleSubscription = async (plan: IPlan) => {
        if (!isAuthenticated) {
            message.warning(t('errors.loginRequired'));
            navigate('/login');
            return;
        }

        setIsProcessingId(plan.id);
        try {
            message.loading({ content: t('payment.creatingSubscription'), key: 'payment' });
            const subRes = await createSubscriptionAPI({ planId: plan.id });

            if (subRes && subRes.data) {
                const subscriptionId = subRes.data.id;

                message.loading({ content: t('payment.creatingPaymentLink'), key: 'payment' });
                const paymentRes = await createVNPayPaymentAPI(subscriptionId);

                if (paymentRes && paymentRes.data.paymentUrl) {
                    message.success({ content: t('payment.redirecting'), key: 'payment' });
                    window.location.href = paymentRes.data.paymentUrl;
                } else {
                    throw new Error('Failed to get payment URL');
                }
            } else {
                throw new Error('Failed to create subscription');
            }
        } catch (error) {
            message.error({ content: t('errors.paymentProcessError'), key: 'payment', duration: 3 });
        } finally {
            setIsProcessingId(null);
        }
    };


    const featuresData = [
        { icon: iconLearn, title: t('premium.feature1.title'), description: t('premium.feature1.desc') },
        { icon: iconSearch, title: t('premium.feature2.title'), description: t('premium.feature2.desc') },
        { icon: iconCommunity, title: t('premium.feature3.title'), description: t('premium.feature3.desc') },
    ];

    const detailedFeaturesData = [
        { image: featureLearn, title: t('premium.detail1.title'), description: t('premium.detail1.desc'), features: [t('premium.detail1.f1'), t('premium.detail1.f2'), t('premium.detail1.f3')], imagePosition: 'left' },
        { image: featureSearch, title: t('premium.detail2.title'), description: t('premium.detail2.desc'), features: [t('premium.detail2.f1'), t('premium.detail2.f2'), t('premium.detail2.f3')], imagePosition: 'right' },
        { image: featureVideo, title: t('premium.detail3.title'), description: t('premium.detail3.desc'), features: [t('premium.detail3.f1'), t('premium.detail3.f2'), t('premium.detail3.f3')], imagePosition: 'left' },
        { image: featureCommunity, title: t('premium.detail4.title'), description: t('premium.detail4.desc'), features: [t('premium.detail4.f1'), t('premium.detail4.f2'), t('premium.detail4.f3')], imagePosition: 'right' },
    ];

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            const difference = endOfDay.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeBlock = ({ value, label }: { value: number, label: string }) => (
        <div className={styles.timeBlock}>
            <div className={styles.timeValue}>{String(value).padStart(2, '0')}</div>
            <div className={styles.timeLabel}>{label}</div>
        </div>
    );

    return (
        <div className={styles.premiumPage}>
            <div className={`${styles.section} ${styles.heroSection}`}>
                <Row align="middle">
                    <Col xs={24} md={12} className={styles.heroContent}>
                        <span className={styles.heroLogo}>4Stars</span>
                        <span className={styles.heroTag}>Premium</span>
                        <Title className={styles.heroTitle} level={1}>{t('premium.hero.title')}</Title>
                        <Paragraph className={styles.heroSubtitle}>{t('premium.hero.subtitle')}</Paragraph>
                        <Link to="/vocabularies" >
                            <Button type="primary" size="large" className={styles.heroButton}>{t('premium.hero.cta')}</Button>
                        </Link>
                    </Col>
                    <Col xs={24} md={12}>
                        <img src={heroImage} alt="Learning illustration" className={styles.heroImage} />
                    </Col>
                </Row>
            </div>

            <div className={`${styles.section} ${styles.featuresSection}`}>
                <Divider plain>
                    <Title level={2} className={styles.featuresTitle}>{t('premium.featuresTitle')}</Title>
                </Divider>
                <Row justify={'space-between'} className={styles.featuresRow}>
                    {featuresData.map(feature => (
                        <Col key={feature.title} xs={24} sm={12} md={7}>
                            <FeatureBlock {...feature} />
                        </Col>
                    ))}
                </Row>
            </div>

            {detailedFeaturesData.map((feature, index) => (
                <div key={index} className={`${styles.section} ${index % 2 !== 0 ? styles.lightBg : ''}`}>
                    <DetailedFeature {...feature} />
                </div>
            ))}

            <div className={`${styles.section} ${styles.pricingSection}`}>
                <Card className={styles.pricingCard}>
                    <Row align="middle" gutter={[32, 24]}>
                        <Col xs={24} md={12} className={styles.pricingContent}>
                            <Title level={3} className={styles.pricingTitle}>{t('premium.pricing.title')}</Title>
                            <div className={styles.countdown}>
                                <TimeBlock value={timeLeft.days} label={t('premium.pricing.days')} />
                                <TimeBlock value={timeLeft.hours} label={t('premium.pricing.hours')} />
                                <TimeBlock value={timeLeft.minutes} label={t('premium.pricing.minutes')} />
                                <TimeBlock value={timeLeft.seconds} label={t('premium.pricing.seconds')} />
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            {
                                plans.map((plan, index) => (
                                    <div key={index} className={styles.plan}>
                                        <Text className={styles.planName} strong>{plan.name}</Text>
                                        <Text strong className={styles.price}> {formatCurrency(plan.price)}</Text>
                                        <Button type="primary" className={styles.blueButton}
                                            onClick={() => handleSubscription(plan)}
                                            loading={isProcessingId === plan.id}>
                                            {t('premium.pricing.cta')}
                                        </Button>
                                    </div>
                                ))
                            }
                        </Col>
                    </Row>
                </Card>
            </div>


        </div>
    );
};

export default PremiumPage;
