import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Result, Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { getQuizAttemptResultAPI } from 'services/quiz.service';
import type { IQuizAttemptResult } from 'types/quiz.type';

const ResultPage = () => {
    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [result, setResult] = useState<IQuizAttemptResult | null>(null);

    useEffect(() => {
        if (!attemptId) return;
        const fetchResult = async () => {
            try {
                const res = await getQuizAttemptResultAPI(parseInt(attemptId));
                setResult(res.data);
            } catch (error) {
                console.error("Failed to fetch result", error);
            }
        };
        fetchResult();
    }, [attemptId]);

    if (!result) return <Spin size="large" fullscreen />;

    return (
        <Card style={{ height: '100%', minHeight: 'calc(100vh - 65px)' }}>
            <Result
                status="success"
                title={t('quiz.resultTitle')}
                subTitle={t('quiz.scoreResult', { score: result.score, totalPoints: result.totalPoints })}
                extra={[<Button key="console" onClick={() => navigate('/')}>{t('common.backToHome')}</Button>]}
            />
        </Card>
    );
};

export default ResultPage;