import { Row, Col, Card, Typography } from 'antd';
import type { IQuestion, IAnswerPayload } from 'types/quiz.type';
import styles from './question.module.scss';
const { Title } = Typography;

interface IMultipleChoiceImageQuestionProps {
    question: IQuestion;
    onAnswer: (answer: IAnswerPayload) => void;
}

const MultipleChoiceImageQuestion = ({ question, onAnswer }: IMultipleChoiceImageQuestionProps) => {

    const handleSelect = (choiceId: number) => {
        onAnswer({
            questionId: question.id,
            selectedChoiceId: choiceId
        });
    };

    return (
        <div className={`${styles.question} ${styles.multipleChoiceImage}`}>
            <Title level={4}>{question.prompt}</Title>
            <Row gutter={[32, 24]}>
                {question.choices.map(choice => (
                    <Col key={choice.id} xs={12} sm={12}>
                        <Card
                            hoverable
                            className={styles.choiceCard}
                            onClick={() => handleSelect(choice.id)}
                        >
                            <img alt="" src={choice.imageUrl!} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default MultipleChoiceImageQuestion;