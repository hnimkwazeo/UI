import { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';

const { Title } = Typography;

interface IListeningTranscriptionProps {
    question: IQuestion;
    onAnswer: (answer: IAnswerPayload) => void;
}

const ListeningTranscriptionQuestion = ({ question, onAnswer }: IListeningTranscriptionProps) => {
    const { t } = useTranslation();
    const [userTranscription, setUserTranscription] = useState('');

    const handleSubmit = () => {
        if (!userTranscription.trim()) return;
        onAnswer({
            questionId: question.id,
            userAnswerText: userTranscription,
        });
    };

    return (
        <div className={`${styles.question} ${styles.listening}`}>
            <Title level={4}>{question.prompt}</Title>
            <Button
                className={styles.playButton}
                icon={<SoundOutlined />}
                onClick={() => new Audio(question.audioUrl!).play()}
                size="large"
            />
            <Input
                size="large"
                value={userTranscription}
                onChange={(e) => setUserTranscription(e.target.value)}
                onPressEnter={handleSubmit}
                placeholder={t('quiz.transcribeWhatYouHear')}
                className={styles.answerInput}
                style={{ textAlign: 'center' }}
            />
            <Button className={styles.submitButton} size="large" type="primary" onClick={handleSubmit}>
                {t('quiz.checkAnswer')}
            </Button>
        </div>
    );
};

export default ListeningTranscriptionQuestion;