import { useEffect, useState } from 'react';
import { Card, Empty, Button, Collapse, Space, Tag, List, Radio, Image, message, Skeleton, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { IQuiz, IQuestion } from 'types/quiz.type';

import { 
    deleteQuizAPI, fetchQuizzesAPI, generateQuizAPI, 
    updateQuizAPI, createQuestionAPI, updateQuestionAPI, deleteQuestionAPI 
} from 'services/quiz.service';
import CreateQuizModal from 'components/quiz/create-quiz-modal.component';
import QuestionModal from 'components/quiz/question-modal.component'; 

const { Text } = Typography;

interface QuizDetailViewProps {
    categoryId: number | null;
    type: "VOCABULARY" | "GRAMMAR";
}

const QuizDetailView = ({ categoryId, type }: QuizDetailViewProps) => {
    const [quiz, setQuiz] = useState<IQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
    const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
    
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);

    const [messageApi, contextHolder] = message.useMessage();

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
                const sortedQuiz = res.data.result[0];
                if(sortedQuiz && sortedQuiz.questions) {
                    sortedQuiz.questions.sort((a, b) => (a.questionOrder || 0) - (b.questionOrder || 0));
                }
                setQuiz(sortedQuiz);
            } else {
                setQuiz(null);
            }
        } catch (error) {
            messageApi.error("Failed to fetch quiz details.");
            setQuiz(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddQuestion = () => {
        setEditingQuestion(null); 
        setIsQuestionModalOpen(true);
    };

    const handleOpenEditQuestion = (question: IQuestion) => {
        setEditingQuestion(question); 
        setIsQuestionModalOpen(true);
    };

    const handleFinishQuestionModal = async (values: any) => {
        if (!quiz) return false;
        try {
            if (editingQuestion) {
                const res = await updateQuestionAPI(editingQuestion.id, values);
                if (res.data) {
                    messageApi.success("Question updated!");
                    setIsQuestionModalOpen(false);
                    fetchQuiz();
                    return true;
                }
            } else {
                const res = await createQuestionAPI(values);
                if (res.data) {
                    messageApi.success("New question added!");
                    setIsQuestionModalOpen(false);
                    fetchQuiz();
                    return true;
                }
            }
        } catch (error) {
            messageApi.error("Failed to save question.");
        }
        return false;
    };

    const handleDeleteQuestion = async (questionId: number) => {
        try {
            const res: any = await deleteQuestionAPI(questionId);

            const isSuccess = 
                res?.status === 204 || 
                res?.statusCode === 204 || 
                res?.status === 200 || 
                res?.statusCode === 200 ||
                (res?.data && !res?.error);

            if (isSuccess) {
                messageApi.success("Question deleted.");

                setQuiz(prevQuiz => {
                    if (!prevQuiz) return null;
                    const newQuestions = prevQuiz.questions.filter(q => q.id != questionId);
                    return {
                        ...prevQuiz,
                        questions: newQuestions
                    };
                });
                
                fetchQuiz();
            } else {
                messageApi.error("Failed to delete.");
            }
        } catch (error) {
            messageApi.error("Error deleting question.");
        }
    };

    const handleUpdateQuizInfo = async (values: any) => {
        if (!quiz) return;
        try {
            const res = await updateQuizAPI(quiz.id, values);
            if (res.data) {
                messageApi.success("Quiz info updated!");
                setIsEditInfoModalOpen(false);
                fetchQuiz();
                return true;
            }
        } catch (error) {
            messageApi.error("Update failed.");
        }
        return false;
    };

    const handleDeleteQuiz = async () => {
        if (!quiz) return;
        try {
            await deleteQuizAPI(quiz.id);
            messageApi.success("Quiz deleted!");
            setQuiz(null);
        } catch (error) {
            messageApi.error("Delete failed.");
        }
    };

    const handleGenerateQuizVocabulary = async () => {
        if (!categoryId) return;
        setIsGenerating(true);
        try {
            const res = await generateQuizAPI(categoryId);
            if (res.data) {
                messageApi.success("Generated!");
                await fetchQuiz();
            }
        } catch (error) {
            messageApi.error("Generation failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) return <Skeleton active />;

    const QuestionDisplay = ({ question }: { question: IQuestion }) => {
         const questionTypeColor: Record<string, string> = {
            'FILL_IN_BLANK': 'yellow', 'LISTENING_COMPREHENSION': 'purple',
            'MULTIPLE_CHOICE_IMAGE': 'pink', 'MULTIPLE_CHOICE_TEXT': 'orange',
            'TRANSLATE_EN_TO_VI': 'blue', 'TRANSLATE_VI_TO_EN': 'cyan',
            'LISTENING_TRANSCRIPTION': 'geekblue', 'ARRANGE_WORDS': 'green'
        };
        return (
            <div>
                <Tag color={questionTypeColor[question.questionType]}>{question.questionType}</Tag>
                {question.correctSentence && <p style={{marginTop: 5}}><strong>Correct: </strong><Text code>{question.correctSentence}</Text></p>}
                {question.audioUrl && <audio key={question.audioUrl} controls src={question.audioUrl} style={{ height: 30, marginTop: 10 }} />}
                {question.imageUrl && <Image src={question.imageUrl} width={100} />}
                {question.choices?.length > 0 && (
                    <List size="small" bordered dataSource={question.choices}
                        renderItem={(choice) => (
                            <List.Item style={{ background: choice.isCorrect ? '#f6ffed' : 'inherit' }}>
                                <Radio checked={choice.isCorrect}>{choice.content || <Image src={choice.imageUrl ?? ""} width={50} />}</Radio>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        );
    };

    const collapseItems = quiz ? quiz.questions.map((q, index) => ({
        key: q.id,
        label: `Question ${index + 1}: ${q.prompt} (Points: ${q.points || 1})`,
        children: <QuestionDisplay question={q} />,
        extra: (
            <Space onClick={e => e.stopPropagation()}>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenEditQuestion(q)} />
                <Popconfirm title="Delete question?" onConfirm={() => handleDeleteQuestion(q.id)} okButtonProps={{ danger: true }}>
                    <div style={{ display: 'inline-block' }}><Button size="small" danger icon={<DeleteOutlined />} /></div>
                </Popconfirm>
            </Space>
        )
    })) : [];

    return (
        <>
            {contextHolder}
            {!quiz ? (
                <Card>
                    <Empty description="No quiz found">
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => type === "VOCABULARY" ? handleGenerateQuizVocabulary() : setIsCreateQuizModalOpen(true)} loading={isGenerating}>
                            Create Quiz
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <Card
                    title={quiz.title}
                    extra={
                        <Space>
                            <Button icon={<EditOutlined />} onClick={() => setIsEditInfoModalOpen(true)}>Edit Info</Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddQuestion}>Add Question</Button>
                            <Popconfirm title="Delete Quiz?" onConfirm={handleDeleteQuiz} okButtonProps={{ danger: true }}>
                                <div><Button danger icon={<DeleteOutlined />}>Delete Quiz</Button></div>
                            </Popconfirm>
                        </Space>
                    }
                >
                    <p>{quiz.description}</p>
                    <Collapse items={collapseItems} />
                </Card>
            )}

            <CreateQuizModal open={isCreateQuizModalOpen} onClose={() => setIsCreateQuizModalOpen(false)} onFinish={() => { setIsCreateQuizModalOpen(false); fetchQuiz(); }} categoryId={categoryId} />
            
            <ModalForm title="Edit Quiz Info" open={isEditInfoModalOpen} onOpenChange={setIsEditInfoModalOpen} onFinish={handleUpdateQuizInfo} initialValues={{ title: quiz?.title, description: quiz?.description }} modalProps={{ destroyOnHidden: true }}>
                <ProFormText name="title" label="Title" rules={[{ required: true }]} />
                <ProFormTextArea name="description" label="Description" />
            </ModalForm>

            {quiz && (
                <QuestionModal 
                    open={isQuestionModalOpen} 
                    onClose={() => setIsQuestionModalOpen(false)} 
                    onFinish={handleFinishQuestionModal} 
                    initialValues={editingQuestion} 
                    quizId={quiz.id} 
                />
            )}
        </>
    );
};

export default QuizDetailView;