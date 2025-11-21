import { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';

const { Title, Text } = Typography;

interface ITranslateViToEnProps {
    question: IQuestion;
    onAnswer: (answer: IAnswerPayload) => void;
}

const TranslateViToEnQuestion = ({ question, onAnswer }: ITranslateViToEnProps) => {
    const { t } = useTranslation();
    const [userTranslation, setUserTranslation] = useState('');

    const handleSubmit = () => {
        if (!userTranslation.trim()) return;
        onAnswer({
            questionId: question.id,
            userAnswerText: userTranslation,
        });
    };

    return (
        <div className={`${styles.question} ${styles.translation}`}>
            <Title level={3}>Translate Vietnamese to English</Title>
            <Text className={styles.sentenceToTranslate}>{question.prompt}</Text>
            <Input.TextArea
                rows={3}
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
                placeholder={t('quiz.enterEnglishTranslation')}
                className={styles.answerInput}
            />
            <Button className={styles.submitButton} size="large" type="primary" onClick={handleSubmit}>
                {t('quiz.checkAnswer')}
            </Button>
        </div>
    );
};

export default TranslateViToEnQuestion;