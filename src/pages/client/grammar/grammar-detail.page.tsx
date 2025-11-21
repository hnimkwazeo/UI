import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, message, Skeleton, Button, Empty } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './grammar-detail.page.module.scss';
import { fetchGrammarDetailClientAPI } from 'services/grammar.service';
import type { IGrammar } from 'types/grammar.type';
import Logo from 'assets/images/logo.png';
import { fetchQuizzesClientAPI } from 'services/quiz.service';
import Accept from 'components/common/share/accept.component';

const { Title } = Typography;

const GrammarDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [grammar, setGrammar] = useState<IGrammar | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

    useEffect(() => {
        if (!id) return;

        const getGrammarDetail = async () => {
            setIsLoading(true);
            try {
                const res = await fetchGrammarDetailClientAPI(parseInt(id));
                if (res && res.data) {
                    setGrammar(res.data);
                } else {
                    message.error(t('errors.fetchGrammarDetail'));
                }
            } catch (error) {
                message.error(t('errors.fetchGrammarDetail'));
            } finally {
                setIsLoading(false);
            }
        };

        getGrammarDetail();
    }, [id, t]);

    const handleStartQuiz = async () => {
        if (!grammar) return;

        setIsGeneratingQuiz(true);
        try {
            const res = await fetchQuizzesClientAPI(grammar.category.id);
            if (res && res.data) {
                navigate('/review/quiz', { state: { quizData: res.data.result[0] } });
            } else {
                message.info(t('grammar.noQuizAvailable'));
            }
        } catch (error) {
            message.error(t('errors.generateQuizError'));
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    if (isLoading) {
        return <Card className={styles.detailContainer}><Skeleton active paragraph={{ rows: 10 }} /></Card>;
    }

    if (!grammar) {
        return <Card bordered={false} className={styles.detailContainer}>
            <Empty
                image={Logo}
                imageStyle={{ height: 100 }}
                description={t('errors.grammarNotFound')}
            />
        </Card>;
    }

    return (
        <Card bordered={false} className={styles.detailContainer}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className={styles.backButton}
            >
                {t('common.back')}
            </Button>

            <div className={styles.grammarDetail}>
                <Title level={2} className={styles.grammarTitle}>{grammar.name}</Title>

                <div
                    className={styles.grammarContent}
                    dangerouslySetInnerHTML={{ __html: grammar.content }}
                />

                <div className={styles.actionsContainer}>
                    <Accept apiPath="/api/v1/quizzes/{id}/start" method="POST">
                        <Button
                            type="primary"
                            size="large"
                            icon={<EditOutlined />}
                            onClick={handleStartQuiz}
                            loading={isGeneratingQuiz}
                        >
                            {t('grammar.doExercise')}
                        </Button>
                    </Accept>
                </div>
            </div>
        </Card>
    );
};

export default GrammarDetailPage;
