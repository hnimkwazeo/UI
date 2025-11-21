import { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';

const { Title } = Typography;

interface IFillBankQuestionProps {
    question: IQuestion,
    onAnswer: (answer: IAnswerPayload) => void
}

const FillBlankQuestion = ({ question, onAnswer }: IFillBankQuestionProps) => {
    const { t } = useTranslation();
    const [answerText, setAnswerText] = useState('');

    const handleSubmit = () => {
        if (!answerText.trim()) return;
        onAnswer({
            questionId: question.id,
            userAnswerText: answerText
        });
        setAnswerText('');
    };

    return (
        <div className={`${styles.question} ${styles.fillBlank}`}>
            <Title level={3}>{question.prompt}</Title>
            <Input
                size="large"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                onPressEnter={handleSubmit}
                placeholder={t('quiz.enterAnswerPlaceholder')}
                allowClear
                className={styles.answerInput}
            />
            <Button className={styles.submitButton} size="large" onClick={handleSubmit} type="primary">{t('quiz.checkAnswer')}</Button>
        </div>
    );
};

export default FillBlankQuestion;