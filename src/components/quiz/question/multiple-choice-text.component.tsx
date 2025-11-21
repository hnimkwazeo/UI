import { Row, Col, Card, Typography } from 'antd';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';

const { Title } = Typography;

interface IMultipleChoiceTextQuestionProps {
    question: IQuestion;
    onAnswer: (answer: IAnswerPayload) => void;
}

const MultipleChoiceTextQuestion = ({ question, onAnswer }: IMultipleChoiceTextQuestionProps) => {

    const handleSelect = (choiceId: number) => {
        onAnswer({
            questionId: question.id,
            selectedChoiceId: choiceId
        });
    };

    return (
        <div className={`${styles.question} ${styles.multipleChoiceText}`}>
            <Title level={3}>{question.prompt}</Title>
            <Row gutter={[24, 24]}>
                {question.choices.map(choice => (
                    <Col key={choice.id} xs={12} sm={12}>
                        <Card
                            hoverable
                            className={styles.choiceCard}
                            onClick={() => handleSelect(choice.id)}
                        >
                            <div className={styles.choiceContent}>{choice.content}</div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default MultipleChoiceTextQuestion;