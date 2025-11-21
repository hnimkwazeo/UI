import { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, List, Skeleton, Modal, Result } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './store.page.module.scss';
import img_banner from 'assets/images/banner_store.png';
import img_item_feature from 'assets/images/item_feature_store.png';
import img_feature from 'assets/images/feature_big_store.png';
import { formatCurrency, formatISODate } from 'utils/format.util';
import type { IPlan } from 'types/plan.type';
import { fetchPlansClientAPI } from 'services/plan.service';
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;

const StorePage = () => {
    const { t } = useTranslation();
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    const [searchParams] = useSearchParams();
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [isModalFailedOpen, setIsModalFailedOpen] = useState(false);
    const [hasModalBeenShown, setHasModalBeenShown] = useState(false);

    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const dayEnd = formatISODate(endOfMonth.toISOString(), 'dd/MM');

    const md = useMediaQuery({ maxWidth: 991.98 });

    useEffect(() => {
        const loadPlans = async () => {
            try {
                setIsLoadingPlans(true);
                const res = await fetchPlansClientAPI('active=true');
                if (res && res.data) {
                    setPlans(res.data.result);
                }
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
                setIsLoadingPlans(false);
            }
        };

        loadPlans();
    }, []);

    useEffect(() => {
        const status = searchParams.get('status');

        if (status === 'success' && !hasModalBeenShown) {
            setIsModalSuccessOpen(true);
            setHasModalBeenShown(true);
        } else if (status === 'failed' && !hasModalBeenShown) {
            setIsModalFailedOpen(true);
            setHasModalBeenShown(true);
        }

    }, [searchParams, hasModalBeenShown]);

    const premiumFeatures = [
        'learnVocabulary', 'notebookLimit', 'handbookAccess', 'advancedSearch',
        'premiumLessons', 'expertExercises', 'aiFeatures'
    ];

    const Digit = ({ value }: { value: number }) => {
        const numbers = Array.from(Array(10).keys());

        return (
            <div className={styles.digitBox}>
                <div
                    className={styles.digitStrip}
                    style={{
                        transform: `translateY(-${value * 10}%)`,
                    }}
                >
                    {numbers.map(num => (
                        <div key={num}>{num}</div>
                    ))}
                </div>
            </div>
        );
    };

    const padZero = (num: number): string => num.toString().padStart(2, '0');

    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });

    const [subscriber, setSubscriber] = useState('Đính Dương vừa đăng ký Premium');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            const difference = endOfDay.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({
                    days: padZero(days),
                    hours: padZero(hours),
                    minutes: padZero(minutes),
                    seconds: padZero(seconds),
                });
            } else {
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
            }
        }, 1000);

        const mockSubscribers = [
            'Trương Thị Diệu Vy vừa nâng cấp Premium',
            'Phạm Thị Hạnh vừa tham gia',
            'Đào Văn Nhật Hưng vừa đăng ký Premium',
            'Võ Minh Hùng vừa đăng ký Premium',
            'Nguyễn Văn Hội vừa nâng cấp Premium',
            'Trần Công Hoàng vừa tham gia',
            'Lê Hữu Anh Tú vừa đăng ký Premium',
            'Lê Trung Việt đăng ký Premium',
            'Lý Thành Long vừa nâng cấp Premium',
            'Bùi Đoàn Duy Lưu vừa tham gia',
            'Nguyễn Ngọc Tâm An vừa đăng ký Premium',
            'Nguyễn Thị Tuyết Ny vừa đăng ký Premium',
            'Nguyễn Thị Mai Linh vừa nâng cấp Premium',
            'Lê Đình Minh Hiếu vừa tham gia',
            'Nguyễn Thị Kiều Trinh vừa đăng ký Premium',
            'Hồ Công Hiếu vừa đăng ký Premium',
            'Trần Lê Bữu Tánh vừa nâng cấp Premium',
            'Phan Đức Thành Phát vừa tham gia',
            'Nguyễn Quang Thắng vừa đăng ký Premium',
            'Võ Minh Nhật vừa đăng ký Premium',
            'Nguyễn Văn Nam vừa nâng cấp Premium',
            'Nguyễn Đức Hải vừa tham gia',
            'Nguyễn Thị Ánh Nguyệt vừa đăng ký Premium',
            'Nguyễn Hoàng Mỹ Dung vừa đăng ký Premium',
            'Hồ Sỹ Bảo Nhân vừa nâng cấp Premium',
        ];

        let subIndex = 0;
        const subTimer = setInterval(() => {
            subIndex = (subIndex + 1) % mockSubscribers.length;
            setSubscriber(mockSubscribers[subIndex]);
        }, 5000);

        return () => {
            clearInterval(timer);
            clearInterval(subTimer);
        };
    }, []);

    const renderDigits = (timeValue: string) => {
        return timeValue.split('').map((digit, index) => (
            <Digit key={index} value={parseInt(digit, 10)} />
        ));
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.bannerContainer}>
                <img src={img_banner} alt="Premium Subscription Banner" className={styles.bannerImage} />
            </div>

            <Row gutter={[md ? 0 : 16, md ? 0 : 16]}>
                {
                    md &&
                    <Card className={styles.countCard}>
                        <div className={styles.title}>{t('store.subscriberCountTitle')}</div>
                        <div className={styles.countdownContainer}>
                            <div className={styles.timeBlock}>
                                <div className={styles.digitWrapper}>{renderDigits(timeLeft.days)}</div>
                                <div className={styles.label}>Ngày</div>
                            </div>
                            <div className={styles.timeBlock}>
                                <div className={styles.digitWrapper}>{renderDigits(timeLeft.hours)}</div>
                                <div className={styles.label}>Giờ</div>
                            </div>
                            <div className={styles.timeBlock}>
                                <div className={styles.digitWrapper}>{renderDigits(timeLeft.minutes)}</div>
                                <div className={styles.label}>Phút</div>
                            </div>
                            <div className={styles.timeBlock}>
                                <div className={styles.digitWrapper}>{renderDigits(timeLeft.seconds)}</div>
                                <div className={styles.label}>Giây</div>
                            </div>
                        </div>
                        <div className={styles.notification}>
                            <GiftOutlined className={styles.icon} />
                            {subscriber}
                        </div>
                    </Card>
                }
                <Col xs={24} lg={14}>
                    <Card className={styles.mainCard}>
                        <Title className={styles.premiumTitle} level={3} >{t('store.premiumTitle')}</Title>
                        <List
                            dataSource={premiumFeatures}
                            renderItem={item => (
                                <List.Item className={styles.featureItem}>
                                    <img src={img_item_feature} alt="Premium Feature" className={styles.featureIcon} />
                                    <Text className={styles.featureText}>{t(`store.features.${item}`)}</Text>
                                </List.Item>
                            )}
                        />
                        <div className={styles.promotion}>
                            <img src={img_feature} alt="Premium Feature" className={styles.promoIcon} />
                            <Text className={styles.promoText} strong>{t('store.promoText', { date: dayEnd })}</Text>
                        </div>
                        <Link to="/premium">
                            <button className={styles.ctaButton}>
                                {t('store.ctaButton')}
                            </button>
                        </Link>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    {
                        !md &&
                        <Card className={styles.countCard}>
                            <div className={styles.title}>{t('store.subscriberCountTitle')}</div>
                            <div className={styles.countdownContainer}>
                                <div className={styles.timeBlock}>
                                    <div className={styles.digitWrapper}>{renderDigits(timeLeft.days)}</div>
                                    <div className={styles.label}>Ngày</div>
                                </div>
                                <div className={styles.timeBlock}>
                                    <div className={styles.digitWrapper}>{renderDigits(timeLeft.hours)}</div>
                                    <div className={styles.label}>Giờ</div>
                                </div>
                                <div className={styles.timeBlock}>
                                    <div className={styles.digitWrapper}>{renderDigits(timeLeft.minutes)}</div>
                                    <div className={styles.label}>Phút</div>
                                </div>
                                <div className={styles.timeBlock}>
                                    <div className={styles.digitWrapper}>{renderDigits(timeLeft.seconds)}</div>
                                    <div className={styles.label}>Giây</div>
                                </div>
                            </div>
                            <div className={styles.notification}>
                                <GiftOutlined className={styles.icon} />
                                {subscriber}
                            </div>
                        </Card>
                    }

                    <Card className={styles.widgetCard}>
                        {isLoadingPlans ? (
                            <Skeleton active paragraph={{ rows: 3 }} />
                        ) : (
                            <List
                                dataSource={plans}
                                renderItem={item => (
                                    <List.Item className={styles.packageItem}>
                                        <Text className={styles.packageName}>{item.name}</Text>
                                        <Text className={styles.packagePrice} strong>
                                            {formatCurrency(item.price)}
                                        </Text>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Modal
                open={isModalSuccessOpen}
                onCancel={() => setIsModalSuccessOpen(false)}
                footer={
                    <></>
                }
            >
                <Result
                    status="success"
                    title="Success"
                    subTitle={<><h2>{t('store.successUpgradeMessage')}</h2></>}
                />
            </Modal>

            <Modal
                open={isModalFailedOpen}
                onCancel={() => setIsModalFailedOpen(false)}
                footer={
                    <></>
                }
            >
                <Result
                    status="error"
                    title="Error"
                    subTitle={<><h2>{t('store.failUpgradeMessage')}</h2></>}
                />
            </Modal>
        </div>
    );
};

export default StorePage;
