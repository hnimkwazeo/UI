import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Typography, message, Progress, Tabs, List, Skeleton } from 'antd';
import { SoundOutlined, CheckOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './dictation-detail.page.module.scss';
import { fetchDictationDetailClientAPI, submitDictationSentenceAPI } from 'services/dictation.service';
import type { IDictationTopic, INlpAnalysis } from 'types/dictation.type';
import AnalysisResult from 'components/dictation/analysis-result.component';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DictationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [topic, setTopic] = useState<IDictationTopic | null>(null);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [analysis, setAnalysis] = useState<INlpAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (!id) return;
        const getTopic = async () => {
            try {
                const res = await fetchDictationDetailClientAPI(parseInt(id));
                if (res && res.data) {
                    setTopic(res.data);
                }
            } catch (error) {
                message.error(t('errors.fetchDataError'));
            } finally {
                setIsLoading(false);
            }
        };
        getTopic();
    }, [id, t]);

    const currentSentence = topic?.sentences[currentSentenceIndex];

    const playAudio = (speed = 1.0) => {
        if (audioRef.current && currentSentence) {
            audioRef.current.src = `${import.meta.env.VITE_BACKEND_URL}${currentSentence?.audioUrl}`;
            audioRef.current.playbackRate = speed;
            audioRef.current.play();
        }
    };

    const handleCheck = async () => {
        if (!userInput.trim() || !currentSentence) return;
        setIsChecking(true);
        try {
            const res = await submitDictationSentenceAPI({
                sentenceId: currentSentence.id,
                userText: userInput,
            });
            if (res && res.data) {
                setAnalysis(res.data);
            }
        } catch (error) {
            message.error(t('errors.submissionError'));
        } finally {
            setIsChecking(false);
        }
    };

    const goToNext = () => {
        if (topic && currentSentenceIndex < topic.sentences.length - 1) {
            setCurrentSentenceIndex(prev => prev + 1);
            setUserInput('');
            setAnalysis(null);
        }
    };

    if (isLoading) {
        return <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>;
    }

    if (!topic) {
        return <Card>{t('dictation.notFound')}</Card>;
    }

    return (
        <Card className={styles.pageContainer}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/dictations')} className={styles.backButton}>
                {t('common.back')}
            </Button>
            <Title level={2} className={styles.pageTitle}>{topic.title}</Title>

            <div className={styles.tabContainer}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={t('dictation.practiceTab')} key="1">
                        <div className={styles.practiceContainer}>
                            <Progress
                                type="circle"
                                percent={((currentSentenceIndex + 1) / topic.sentences.length) * 100}
                                format={() => `${currentSentenceIndex + 1}/${topic.sentences.length}`}
                            />
                            <div className={styles.audioControls}>
                                <Button type="primary" shape="circle" icon={<SoundOutlined />} size="large" onClick={() => playAudio(1.0)} />
                                <Button onClick={() => playAudio(0.75)}>{t('dictation.slow')}</Button>
                            </div>
                            <audio controls src={`${import.meta.env.VITE_BACKEND_URL}${currentSentence?.audioUrl}`} ref={audioRef} />
                            <Input.TextArea
                                rows={3}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={t('dictation.inputPlaceholder')}
                                disabled={!!analysis}
                            />
                            {analysis ? (
                                <AnalysisResult 
                                    result={analysis} 
                                    sentenceId={currentSentence?.id} 
                                    userText={userInput}    
                                />
                            ) : (
                                <Button type="primary" onClick={handleCheck} loading={isChecking} icon={<CheckOutlined />} block>
                                    {t('dictation.check')}
                                </Button>
                            )}
                            {currentSentenceIndex < topic.sentences.length - 1 && (
                                <Button onClick={goToNext} disabled={!analysis} block>
                                    {t('dictation.nextSentence')} <ArrowRightOutlined />
                                </Button>
                            )}
                        </div>
                    </TabPane>
                    <TabPane tab={t('dictation.transcriptTab')} key="2">
                        <List
                            dataSource={topic.sentences}
                            renderItem={(item) => (
                                <List.Item>
                                    <Text strong>{item.correctText}</Text>
                                </List.Item>
                            )}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </Card>
    );
};

export default DictationDetailPage;

