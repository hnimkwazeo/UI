import { useEffect, useState } from 'react';
import { Card, Empty, Button, Collapse, Space, Tag, List, Radio, Image, message, Skeleton, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { IQuiz, IQuestion } from 'types/quiz.type';
import { deleteQuizAPI, fetchQuizzesAPI, generateQuizAPI } from 'services/quiz.service';
import CreateQuizModal from 'components/quiz/create-quiz-modal.component';
const { Text } = Typography;
const { Panel } = Collapse;

interface QuizDetailViewProps {
    categoryId: number | null;
    type: "VOCABULARY" | "GRAMMAR";
}

const QuizDetailView = ({ categoryId, type }: QuizDetailViewProps) => {
    const [quiz, setQuiz] = useState<IQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [categoryId]);

    const fetchQuiz = async () => {
        if (!categoryId) {
            setQuiz(null);
            return;
        };
        setIsLoading(true);
        try {
            const res = await fetchQuizzesAPI(`categoryId=${categoryId}`);
            if (res && res.data) {
                setQuiz(res.data.result[0]);
            } else {
                setQuiz(null);
            }
        } catch (error) {
            message.error("Failed to fetch quiz details.");
            setQuiz(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateQuizVocabulary = async () => {
        if (!categoryId) return;

        setIsGenerating(true);
        try {
            const res = await generateQuizAPI(categoryId);
            if (res && res.data) {
                message.success("Quiz generated successfully!");
                await fetchQuiz();
            } else {
                message.error(res.message || "Failed to generate quiz.");
            }
        } catch (error) {
            message.error("An error occurred during quiz generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteQuiz = async () => {
        if (!quiz) return;

        try {
            const res = await deleteQuizAPI(quiz.id);
            if (res) {
                message.success("Quiz deleted successfully!");
                setQuiz(null);
            } else {
                message.error(res.data?.message || "Failed to delete quiz.");
            }
        } catch (error) {
            message.error("An error occurred while deleting the quiz.");
        }
    };

    const handleFinishCreateQuiz = () => {
        setIsCreateQuizModalOpen(false);
        fetchQuiz();
    }

    if (isLoading) {
        return (
            <Card title={<Skeleton.Input active style={{ width: '200px' }} />} extra={<Skeleton.Button active />}>
                <Skeleton.name />
                <br />
                <Skeleton.Input active block style={{ marginBottom: '16px' }} />
                <Skeleton.Input active block style={{ marginBottom: '16px' }} />
                <Skeleton.Input active block />
            </Card>
        );
    }

    const QuestionDisplay = ({ question }: { question: IQuestion }) => {
        const questionTypeColor = {
            'FILL_IN_BLANK': 'yellow',
            'LISTENING_COMPREHENSION': 'purple',
            'MULTIPLE_CHOICE_IMAGE': 'pink',
            'MULTIPLE_CHOICE_TEXT': 'orange',
            'TRANSLATE_EN_TO_VI': 'blue',
            'TRANSLATE_VI_TO_EN': 'cyan',
            'LISTENING_TRANSCRIPTION': 'geekblue',
            'ARRANGE_WORDS': 'green'
        };

        return (
            <div>
                <Tag color={questionTypeColor[question.questionType] || 'default'}>
                    {question.questionType}
                </Tag>

                {question.correctSentence && (
                    <p style={{ marginTop: 8 }}>
                        <strong>Correct Answer: </strong>
                        <Text code>{question.correctSentence}</Text>
                    </p>
                )}

                {question.audioUrl && <audio controls src={question.audioUrl} style={{ height: '30px', margin: '10px 0' }} />}
                {question.imageUrl && <Image src={question.imageUrl} width={100} />}

                {question.choices && question.choices.length > 0 && (
                    <List
                        size="small"
                        header={<div>Choices</div>}
                        bordered
                        dataSource={question.choices}
                        renderItem={(choice) => (
                            <List.Item style={{ background: choice.isCorrect ? '#CCEFB2' : 'inherit' }}>
                                <Radio checked={choice.isCorrect}>{choice.content || <Image src={choice.imageUrl ?? ''} width={80} />}</Radio>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        );
    };

    return (
        <>
            {
                !quiz ? (
                    <Card>
                        <Empty description="No quiz found for this category.">
                            <Button type="primary" icon={<PlusOutlined />}
                                onClick={() => {
                                    if (type === "VOCABULARY") {
                                        handleGenerateQuizVocabulary();
                                    } else {
                                        setIsCreateQuizModalOpen(true);
                                    }
                                }}
                                loading={isGenerating}
                            >
                                Create New Quiz
                            </Button>
                        </Empty>
                    </Card>
                ) : (
                    <Card
                        title={quiz.title}
                        extra={
                            <Space>
                                <Button icon={<EditOutlined />}>Edit Quiz Info</Button>
                                <Button type="primary" icon={<PlusOutlined />}>Add Question</Button>
                                <Popconfirm
                                    title="Delete this quiz"
                                    description="Are you sure? This will delete the quiz and all its questions."
                                    onConfirm={handleDeleteQuiz}
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                    okText="Yes, Delete"
                                    okButtonProps={{ danger: true }}
                                    cancelText="No"
                                >
                                    <Button danger icon={<DeleteOutlined />}>Delete Quiz</Button>
                                </Popconfirm>
                            </Space>
                        }
                    >
                        <p>{quiz.description}</p>
                        <Collapse>
                            {quiz.questions.map((q, index) => (
                                <Panel
                                    header={`Question ${index + 1}: ${q.prompt}`}
                                    key={q.id}
                                    extra={
                                        <Space onClick={e => e.stopPropagation()}>
                                            <Button size="small" icon={<EditOutlined />} />
                                            <Button size="small" danger icon={<DeleteOutlined />} />
                                        </Space>
                                    }
                                >
                                    <QuestionDisplay question={q} />
                                </Panel>
                            ))}
                        </Collapse>
                    </Card>
                )
            }

            <CreateQuizModal
                open={isCreateQuizModalOpen}
                onClose={() => setIsCreateQuizModalOpen(false)}
                onFinish={handleFinishCreateQuiz}
                categoryId={categoryId}
            />
        </>
    );
};

export default QuizDetailView;