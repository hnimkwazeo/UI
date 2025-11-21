import { useEffect } from 'react';
import { Result, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { INotification } from 'types/notification.type';
import { useWebSocket } from 'context/websocket.context';

const ProcessingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { subscribeToNotifications } = useWebSocket();
    const attemptId = location.state?.attemptId;

    useEffect(() => {
        if (!attemptId) {
            navigate('/');
            return;
        }

        const unsubscribe = subscribeToNotifications((notification: INotification) => {
            if (notification.link.includes(`/quiz/results/${attemptId}`)) {
                navigate(`/quiz/results/${attemptId}`);
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [attemptId, navigate, subscribeToNotifications]);

    return (
        <Result
            icon={<Spin size="large" />}
            title={t('quiz.processingTitle')}
            subTitle={t('quiz.processingSubtitle')}
        />
    );
};

export default ProcessingPage;
