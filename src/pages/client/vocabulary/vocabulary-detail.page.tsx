import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, message, Skeleton, Row, Col, Image, Button, Tag, Empty } from 'antd';
import { ArrowLeftOutlined, LinkOutlined, PlusSquareFilled, TagOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './vocabulary-detail.page.module.scss';
import type { IVocabulary } from 'types/vocabulary.type';
import { fetchRelatedWordsAPI, fetchSynonymsAPI, fetchVocabularyDetailClientAPI } from 'services/vocabulary.service';
import TextToSpeech from '@/components/common/text-to-speech/text-to-speech.component';
import Logo from 'assets/images/logo.png';
import { addVocabularyToNotebookAPI } from 'services/notebook.service';
import Accept from 'components/common/share/accept.component';
import { useMediaQuery } from 'react-responsive';

const { Title, Text, Paragraph } = Typography;

const VocabularyDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [vocabulary, setVocabulary] = useState<IVocabulary | null>(null);
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [relatedWords, setRelatedWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const md = useMediaQuery({ maxWidth: 767.98 });


    useEffect(() => {
        if (!id) return;

        const getVocabularyDetail = async () => {
            setIsLoading(true);
            try {
                const res = await fetchVocabularyDetailClientAPI(parseInt(id));
                if (res && res.data) {
                    setVocabulary(res.data);
                } else {
                    message.error(t('errors.fetchVocabularyDetail'));
                }
            } catch (error) {
                message.error(t('errors.fetchVocabularyDetail'));
            } finally {
                setIsLoading(false);
            }
        };

        getVocabularyDetail();
    }, [id, t]);

    useEffect(() => {
        if (vocabulary && vocabulary.word) {
            const getExternalData = async () => {
                try {
                    const [synonymsRes, relatedWordsRes] = await Promise.all([
                        fetchSynonymsAPI(vocabulary.word),
                        fetchRelatedWordsAPI(vocabulary.word)
                    ]);

                    if (synonymsRes) {
                        setSynonyms(synonymsRes.map(item => item.word));
                    }
                    if (relatedWordsRes) {
                        setRelatedWords(relatedWordsRes.map(item => item.word));
                    }

                } catch (error) {
                    console.error("Failed to fetch external data", error);
                }
            };
            getExternalData();
        }
    }, [vocabulary]);

    const handleAddVocabularyToNotebook = async (id: number) => {
        try {
            await addVocabularyToNotebookAPI(id);
            message.success(t('notebook.addSuccess'));
        } catch (error) {
            message.error(t('errors.addError'));
        }
    };


    if (isLoading) {
        return <Card><Skeleton active paragraph={{ rows: 6 }} /></Card>;
    }

    if (!vocabulary) {
        return <Card className={styles.detailContainer}>
            <Empty
                className={styles.searchResultContainer}
                image={Logo}
                description={
                    <div className={styles.notFound}>
                        <Typography.Text strong className={styles.titleNotFound}>
                            {t('errors.vocabularyNotFound')}
                        </Typography.Text>
                    </div>
                }
            />;

        </Card>;
    }

    const renderTags = (title: string, icon: React.ReactNode, words: string[], type: 'synonyms' | 'relatedWords') => (
        words.length > 0 && (
            <div className={styles.tagSection}>
                <Title level={4}>{icon} {title}</Title>
                <div>
                    {words.slice(0, md ? 6 : 15).map((word, index) => (
                        <Tag key={index} className={type === 'synonyms' ? styles.synonymTag : styles.wordTag}>{word}</Tag>
                    ))}
                </div>
            </div>
        )
    );

    return (

        <Card bordered={false} className={styles.detailContainer}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className={styles.backButton}
            >
                {t('common.back')}
            </Button>
            <div className={styles.vocabContainer}>
                <Row gutter={[md ? 0 : 32, md ? 0 : 24]}>
                    <Col xs={24} md={10}>
                        <Image
                            src={vocabulary.image || 'https://placehold.co/600x400?text=No+Image'}
                            alt={vocabulary.word}
                            className={styles.vocabImage}
                        />
                    </Col>
                    <Col xs={24} md={14} className={styles.vocabInfo}>
                        <div>
                            <Tag color={
                                vocabulary.partOfSpeech === 'noun' ? 'blue' :
                                    vocabulary.partOfSpeech === 'verb' ? 'green' :
                                        vocabulary.partOfSpeech === 'adjective' ? 'purple' :
                                            vocabulary.partOfSpeech === 'adverb' ? 'red' :
                                                'orange'
                            } className={styles.posTag}>{vocabulary.partOfSpeech}</Tag>
                            <Title level={2} className={styles.wordTitle}>
                                {vocabulary.word}
                                <TextToSpeech text={vocabulary.word} />
                            </Title>
                            <Text className={styles.phonetic}>{vocabulary.pronunciation}</Text>
                            <br></br>
                            <Tag color="#0d47a1" className={styles.categoryTag}>{vocabulary.category.name}</Tag>
                        </div>

                        <Accept apiPath="/api/v1/notebook/add/{vocabularyId}" method='POST' hide>
                            <Button onClick={() => handleAddVocabularyToNotebook(vocabulary.id)} className={styles.addToNotebookButton}>
                                <PlusSquareFilled />{t('notebook.addToNotebook')}
                            </Button>
                        </Accept>

                        <div>
                            <Paragraph className={styles.meaning}>{vocabulary.meaningVi}</Paragraph>
                            <Paragraph className={styles.definition}>{vocabulary.definitionEn}</Paragraph>
                        </div>
                    </Col>
                </Row>
                <div className={styles.exampleSection}>
                    <Title level={4}>{t('vocabulary.exampleSentences')}</Title>
                    <Paragraph className={styles.example}>{vocabulary.exampleEn}</Paragraph>
                    <Paragraph className={styles.exampleItalic}>{vocabulary.exampleVi}</Paragraph>
                </div>
                <div className={styles.relatedSection}>
                    {renderTags(t('vocabulary.synonyms'), <TagOutlined />, synonyms, 'synonyms')}
                    {renderTags(t('vocabulary.relatedWords'), <LinkOutlined />, relatedWords, 'relatedWords')}
                </div>
            </div>
        </Card>
    );
};

export default VocabularyDetailPage;
