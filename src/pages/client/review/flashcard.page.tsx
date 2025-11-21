import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Progress, Typography, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, RetweetOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './flashcard.page.module.scss';
import type { IVocabulary } from 'types/vocabulary.type';
import Flashcard from 'components/vocabulary/flashcard.component';

const { Title, Text } = Typography;

const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const FlashcardPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const originalVocabularies = useMemo(() => location.state?.vocabularies || [], [location.state]);
    const [shuffledVocabularies, setShuffledVocabularies] = useState<IVocabulary[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (originalVocabularies.length === 0) {
            message.error(t('errors.noFlashcardData'));
            navigate(-1);
            return;
        }
        setShuffledVocabularies(shuffleArray(originalVocabularies));
    }, [originalVocabularies, navigate, t]);

    const goToNext = () => {
        if (currentIndex < shuffledVocabularies.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleShuffle = () => {
        setShuffledVocabularies(shuffleArray(shuffledVocabularies));
        setCurrentIndex(0);
        message.success(t('flashcard.shuffled'));
    };

    if (shuffledVocabularies.length === 0) {
        return null;
    }

    const progressPercent = ((currentIndex + 1) / shuffledVocabularies.length) * 100;
    const currentVocab = shuffledVocabularies[currentIndex];

    return (
        <Card className={styles.flashcardPage}>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                        {t('common.back')}
                    </Button>
                    <Title level={4} className={styles.pageTitle}>{t('flashcard.title')}</Title>
                    <Button type="text" icon={<RetweetOutlined />} onClick={handleShuffle}>
                        {t('flashcard.shuffle')}
                    </Button>
                </div>

                <Progress percent={progressPercent} showInfo={false} />
                <Text className={styles.progressText}>{currentIndex + 1} / {shuffledVocabularies.length}</Text>

                <div className={styles.flashcardWrapper}>
                    <Flashcard vocabulary={currentVocab} />
                </div>

                <div className={styles.navigation}>
                    <Button onClick={goToPrev} disabled={currentIndex === 0} icon={<ArrowLeftOutlined />} size="large">
                        {t('flashcard.previous')}
                    </Button>
                    <Button type="primary" onClick={goToNext} disabled={currentIndex === shuffledVocabularies.length - 1} icon={<ArrowRightOutlined />} size="large">
                        {t('flashcard.next')}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default FlashcardPage;
