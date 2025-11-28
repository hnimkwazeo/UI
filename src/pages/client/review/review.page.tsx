import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Progress, Button, message, Spin, Drawer, Typography } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, HeartFilled, RobotOutlined } from '@ant-design/icons';
import { requestExplanation } from "@/services/chatbot.service";
import { useTranslation } from 'react-i18next';
import styles from './review.page.module.scss';
import type { IQuestion, IAnswerPayload, IChoice } from 'types/quiz.type';
import { startQuizAttemptAPI, submitQuizAPI } from 'services/quiz.service';
import MultipleChoiceImageQuestion from 'components/quiz/question/multiple-choice-image.component';
import ListeningQuestion from 'components/quiz/question/listening.component';
import FillBlankQuestion from 'components/quiz/question/fill-blank.component';
import MultipleChoiceTextQuestion from 'components/quiz/question/multiple-choice-text.component';
import TranslateEnToViQuestion from 'components/quiz/question/translate-en-to-vi.component';
import TranslateViToEnQuestion from 'components/quiz/question/translate-vi-to-en.component';
import ListeningTranscriptionQuestion from 'components/quiz/question/listening-transcript.component';
import ArrangeWordsQuestion from 'components/quiz/question/arrange-word.component';
import { useMediaQuery } from 'react-responsive';
import { useChatStore } from "stores/useChat.store";


const { Title, Text } = Typography;

const ReviewPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [quizData, setQuizData] = useState<any>(location.state?.quizData);
    const [attemptId, setAttemptId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<IAnswerPayload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<IChoice | string | null>(null);
    const [isExplaining, setIsExplaining] = useState(false);
    const { setIsOpen, addMessage } = useChatStore();

    const md = useMediaQuery({ maxWidth: 991.98 });

    // --- HÀM XỬ LÝ GỌI AI ---
    const handleExplainAI = async () => {
        if (!currentQuestion) return;
        setIsOpen(true);

        setIsExplaining(true);
        try {
            // ... (Giữ nguyên phần logic lấy text cũ của bạn ở trên) ...
            const userAnsObj = answers.find(a => a.questionId === currentQuestion.id);
            let userAnsText = "";
            if (userAnsObj) {
                if (userAnsObj.userAnswerText) userAnsText = userAnsObj.userAnswerText; 
                else if (userAnsObj.selectedChoiceId) {
                    const selectedChoice = currentQuestion.choices?.find(c => c.id === userAnsObj.selectedChoiceId);
                    userAnsText = selectedChoice?.content || "Image Choice";
                }
            }
            let correctAnsText = currentQuestion.correctSentence || "";
            if (!correctAnsText && currentQuestion.choices) {
                const correctChoice = currentQuestion.choices.find(c => c.isCorrect);
                correctAnsText = correctChoice?.content || "Image Choice";
            }
            // ... (Hết phần logic cũ) ...

            // GỌI API
            const res = await requestExplanation({
                questionContent: currentQuestion.prompt || "Question Content",
                userAnswer: userAnsText,
                correctAnswer: correctAnsText,
                explanation: "",
                type: "QUIZ"
            });

            // XỬ LÝ KẾT QUẢ
            // Kiểm tra an toàn: res có thể là response object hoặc data object tùy vào axios interceptor
            if (res) {

                // 2. Hiện câu trả lời
                const replyText = res.reply || (res.data && res.data.reply);
                if (replyText) {
                    addMessage({ role: 'assistant', content: replyText });
                }
            }

        } catch (error) {
            console.error(error);
            message.error(t('Lỗi kết nối AI'));
        } finally {
            setIsExplaining(false);
        }
    };

    useEffect(() => {
        if (!quizData) {
            message.error(t('errors.noQuizData'));
            navigate('/');
            return;
        }
        const startAttempt = async () => {
            try {
                const res = await startQuizAttemptAPI(quizData.id);
                if (res && res.data) {
                    setAttemptId(res.data.attemptId);
                    setQuestions(quizData.questions);
                }
            } catch (error) {
                message.error(t('errors.startQuizError'));
            } finally {
                setIsLoading(false);
            }
        };
        startAttempt();
    }, [quizData, navigate, t]);

    const handleAnswerSubmit = (answer: IAnswerPayload) => {
        if (answerStatus) return;
        setAnswers(prev => [...prev.filter(a => a.questionId !== answer.questionId), answer]);
        const currentQuestion = questions[currentQuestionIndex];
        const correctChoice = currentQuestion.choices?.find(c => c.isCorrect === true);

        if (currentQuestion.questionType.includes('MULTIPLE_CHOICE')) {
            if (answer.selectedChoiceId === correctChoice?.id) {
                setAnswerStatus('correct');
            } else {
                setAnswerStatus('incorrect');
                setCorrectAnswer(correctChoice || null);
            }
        } else {
            if (currentQuestion.correctSentence?.toLowerCase() === answer.userAnswerText?.toLowerCase()) {
                setAnswerStatus('correct');
            } else {
                setAnswerStatus('incorrect');
                setCorrectAnswer(currentQuestion.correctSentence || null);
            }
        }
    };

    const handleContinue = () => {
        setAnswerStatus(null);
        setCorrectAnswer(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handleSubmitQuiz = async () => {
        if (!attemptId) return;
        setIsSubmitting(true);
        try {
            await submitQuizAPI({ userQuizAttemptId: attemptId, answers });
            navigate('/review/processing', { state: { attemptId } });
        } catch (error) {
            message.error(t('errors.submitQuizError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Spin size="large" fullscreen />;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const renderQuestion = () => {
        if (!currentQuestion) return <p>{t('quiz.loadingQuestion')}</p>;
        switch (currentQuestion.questionType) {
            case 'MULTIPLE_CHOICE_IMAGE':
                return <MultipleChoiceImageQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'MULTIPLE_CHOICE_TEXT':
                return <MultipleChoiceTextQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'LISTENING_COMPREHENSION':
                return <ListeningQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'FILL_IN_BLANK':
                return <FillBlankQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'TRANSLATE_EN_TO_VI':
                return <TranslateEnToViQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'TRANSLATE_VI_TO_EN':
                return <TranslateViToEnQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'LISTENING_TRANSCRIPTION':
                return <ListeningTranscriptionQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            case 'ARRANGE_WORDS':
                return <ArrangeWordsQuestion question={currentQuestion} onAnswer={handleAnswerSubmit} />;
            default:
                return <p>{t('quiz.unsupportedQuestion', { type: currentQuestion.questionType })}</p>;
        }
    };

    return (
        <Card className={styles.reviewContainer} style={{ position: 'relative', overflow: 'hidden' }}>
            <div className={styles.header}>
                <Progress percent={progressPercent} showInfo={false} />
                <HeartFilled style={{ color: 'red', fontSize: '2rem' }} />
            </div>
            <div className={styles.questionContainer}>
                {renderQuestion()}
            </div>
            <Drawer
                placement="bottom"
                open={!!answerStatus}
                closable={false}
                mask={true}
                getContainer={false}
                style={{ position: 'absolute' }}
                height={md ? 250 : 300}
                className={answerStatus === 'correct' ? styles.correctDrawer : styles.incorrectDrawer}
            >
                {answerStatus === 'correct' && (
                    <div className={styles.drawerContent}>
                        <div>
                            <Title level={4} className={styles.drawerTitle}><CheckCircleFilled className={styles.drawerIcon} /> {t('quiz.correct')}</Title>
                        </div>
                    </div>
                )}
                {answerStatus === 'incorrect' && (
                    <div className={styles.drawerContent}>
                        <div>
                            <Title level={3} className={styles.drawerTitle}><CloseCircleFilled className={styles.drawerIcon} />{t('quiz.incorrect')}</Title>
                            {correctAnswer && (
                                <div className={styles.answerCorrect}>
                                    <div><b>{t('quiz.correctAnswerIs')}:</b></div>
                                    {typeof correctAnswer === 'string' ? correctAnswer : correctAnswer.content ? correctAnswer.content : <img className={styles.answerImage} src={correctAnswer.imageUrl!} alt={t('quiz.correctAnswerAlt')} />}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- BẮT ĐẦU SỬA: Thay thế nút Button cũ bằng khối div chứa 2 nút --- */}
                <div className={styles.continueButton} style={{ display: 'flex', gap: '12px' }}>
                    
                    {/* Nút 1: Giải thích AI */}
                    <Button 
                        size="large"
                        icon={<RobotOutlined />}
                        loading={isExplaining} // Biến state bạn đã thêm ở bước 2
                        onClick={handleExplainAI} // Hàm xử lý bạn đã thêm ở bước 2
                        style={{ 
                            flex: 1, 
                            borderColor: '#1890ff', 
                            color: '#1890ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                        }}
                    >
                        Giải thích AI
                    </Button>

                    {/* Nút 2: Tiếp tục (Logic cũ) */}
                    <Button 
                        type="primary" 
                        size="large" 
                        onClick={handleContinue} 
                        style={{ flex: 1 }}
                    >
                        {isLastQuestion ? t('quiz.finish') : t('quiz.continue')}
                    </Button>
                </div>
                {/* --- KẾT THÚC SỬA --- */}

            </Drawer>
        </Card>
    );
};

export default ReviewPage;