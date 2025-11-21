import { useMemo, useState } from 'react';
import { Button, Typography, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';

const { Title, Text } = Typography;

interface IArrangeWordsProps {
    question: IQuestion;
    onAnswer: (answer: IAnswerPayload) => void;
}

const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const ArrangeWordsQuestion = ({ question, onAnswer }: IArrangeWordsProps) => {
    const { t } = useTranslation();
    const initialShuffledWords = useMemo(() =>
        shuffleArray(question.prompt!.split(' ')),
        [question.prompt]
    );

    const [availableWords, setAvailableWords] = useState(initialShuffledWords.map((word, index) => ({ id: index, word })));
    const [selectedWords, setSelectedWords] = useState<{ id: number, word: string }[]>([]);

    const handleSelectWord = (wordObj: { id: number, word: string }) => {
        setSelectedWords(prev => [...prev, wordObj]);
        setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id));
    };

    const handleDeselectWord = (wordObj: { id: number, word: string }) => {
        setAvailableWords(prev => [...prev, wordObj]);
        setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
    };

    const handleSubmit = () => {
        if (selectedWords.length === 0) return;
        const userAnswer = selectedWords.map(w => w.word).join(' ');
        onAnswer({
            questionId: question.id,
            userAnswerText: userAnswer,
        });
    };

    return (
        <div className={`${styles.question} ${styles.arrangeWords}`}>
            <Title level={3}>{t('quiz.arrangeWordsPrompt')}</Title>
            <div className={styles.sentenceArea}>
                {selectedWords.length > 0 ? (
                    selectedWords.map(wordObj => (
                        <Tag
                            key={wordObj.id}
                            className={styles.wordTag}
                            onClick={() => handleDeselectWord(wordObj)}
                        >
                            {wordObj.word}
                        </Tag>
                    ))
                ) : (
                    <Text type="secondary">__ __ __ __ __ __</Text>
                )}
            </div>
            <div className={styles.wordBank}>
                <Space wrap size={[8, 16]}>
                    {availableWords.map(wordObj => (
                        <Tag
                            key={wordObj.id}
                            className={styles.wordTag}
                            onClick={() => handleSelectWord(wordObj)}
                        >
                            {wordObj.word}
                        </Tag>
                    ))}
                </Space>
            </div>
            <Button
                className={styles.submitButton}
                size="large"
                type="primary"
                onClick={handleSubmit}
                disabled={availableWords.length > 0}
            >
                {t('quiz.checkAnswer')}
            </Button>
        </div>
    );
};

export default ArrangeWordsQuestion;