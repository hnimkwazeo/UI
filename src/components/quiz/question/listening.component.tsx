import { useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';

const { Title } = Typography;

interface IListeningQuestionProps {
    question: IQuestion;
    onAnswer: (answer: IAnswerPayload) => void;
}

const ListeningQuestion = ({ question, onAnswer }: IListeningQuestionProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = (choiceId: number) => {
        setSelectedId(choiceId);
        onAnswer({
            questionId: question.id,
            selectedChoiceId: choiceId
        });
    };

    return (
        <div className={`${styles.question} ${styles.listening}`}>
            <Title level={3}>{question.prompt}</Title>
            <Button className={styles.playButton} icon={<SoundOutlined />} onClick={() => new Audio(question.audioUrl!).play()} size="large" />
            <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                {question.choices.map(choice => (
                    <Button
                        className={styles.choiceButton}
                        key={choice.id}
                        block
                        size="large"
                        type={selectedId === choice.id ? 'primary' : 'default'}
                        onClick={() => handleSelect(choice.id)}
                    >
                        {choice.content}
                    </Button>
                ))}
            </Space>
        </div>
    );
};

export default ListeningQuestion;