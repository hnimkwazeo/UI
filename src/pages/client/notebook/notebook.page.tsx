import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, message, Skeleton, Tabs, List, Empty, Tag, Popconfirm, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './notebook.page.module.scss';
import type { IVocabulary } from 'types/vocabulary.type';
import { fetchNotebookByLevelAPI, removeNotebookItemAPI } from 'services/notebook.service';
import TextToSpeech from 'components/common/text-to-speech/text-to-speech.component';
import NotebookDetail from 'components/notebook/notebook-detail.component';
import Logo from 'assets/images/logo.png';
import { useMediaQuery } from 'react-responsive';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotebookPage = () => {
    const { t } = useTranslation();
    const [activeLevel, setActiveLevel] = useState('1');
    const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
    const [selectedVocabulary, setSelectedVocabulary] = useState<IVocabulary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const sm = useMediaQuery({ maxWidth: 767.98 });

    useEffect(() => {
        const getNotebookData = async () => {
            setIsLoading(true);
            try {
                const res = await fetchNotebookByLevelAPI(parseInt(activeLevel));
                if (res && res.data) {
                    setVocabularies(res.data.result);
                    if (res.data.result.length > 0) {
                        setSelectedVocabulary(res.data.result[0]);
                    } else {
                        setSelectedVocabulary(null);
                    }
                }
            } catch (error) {
                message.error(t('errors.fetchDataError'));
            } finally {
                setIsLoading(false);
            }
        };
        getNotebookData();
    }, [activeLevel, t]);

    const handleTabChange = (key: string) => {
        setActiveLevel(key);
    };

    const handleSelectVocabulary = (vocab: IVocabulary) => {
        setSelectedVocabulary(vocab);
    };

    const handleRemoveVocabulary = async (id: number) => {
        try {
            await removeNotebookItemAPI(id);
            message.success(t('notebook.deleteSuccess'));

            const updatedVocabularies = vocabularies.filter(v => v.id !== id);
            setVocabularies(updatedVocabularies);

            if (selectedVocabulary?.id === id) {
                setSelectedVocabulary(updatedVocabularies.length > 0 ? updatedVocabularies[0] : null);
            }
        } catch (error) {
            message.error(t('errors.deleteError'));
        }
    };

    const tabItems = Array.from({ length: 5 }, (_, i) => ({
        key: String(i + 1),
        label: `${t('notebook.level')} ${i + 1}`,
    }));

    return (
        <Row gutter={[16, 16]} className={styles.pageContainer}>
            <Col xs={24} md={14} lg={14}>
                <Card className={styles.vocabCard}>
                    <Title level={2} className={styles.pageTitle}>{t('notebook.pageTitle')}</Title>
                    <Tabs centered defaultActiveKey="1" items={tabItems} onChange={handleTabChange} />
                    {isLoading ? (
                        <Skeleton active paragraph={{ rows: 5 }} />
                    ) : (
                        <List
                            className={styles.vocabList}
                            itemLayout="horizontal"
                            dataSource={vocabularies}
                            renderItem={item => (
                                <List.Item
                                    className={`${styles.vocabItem} ${selectedVocabulary?.id === item.id ? styles.selected : ''}`}
                                    onClick={() => handleSelectVocabulary(item)}
                                >
                                    <List.Item.Meta
                                        title={
                                            <>
                                                <Text className={styles.vocabWord} strong>{item.word}</Text>
                                                <Tag color={
                                                    item.partOfSpeech === 'noun' ? 'blue' :
                                                        item.partOfSpeech === 'verb' ? 'green' :
                                                            item.partOfSpeech === 'adjective' ? 'purple' :
                                                                item.partOfSpeech === 'adverb' ? 'red' :
                                                                    'orange'
                                                } className={styles.partOfSpeech}>{item.partOfSpeech}</Tag>
                                            </>
                                        }
                                        description={<span>{item.pronunciation} - <b>{item.meaningVi}</b></span>}
                                    />
                                    {
                                        sm &&
                                        <Popconfirm
                                            title={t('notebook.deleteConfirmTitle')}
                                            description={t('notebook.deleteConfirmDesc')}
                                            onConfirm={() => handleRemoveVocabulary(item.id)}
                                            okText={t('common.yes')}
                                            cancelText={t('common.no')}
                                        >
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    }
                                    <TextToSpeech text={item.word} />
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            </Col>

            {!sm &&
                <Col xs={24} md={10} lg={10}>
                    {selectedVocabulary ? (
                        <NotebookDetail vocabulary={selectedVocabulary} onDelete={handleRemoveVocabulary} />
                    ) : (
                        !isLoading && <Card style={{ height: '100%' }}>
                            <Empty
                                image={Logo}
                                imageStyle={{ height: 100 }}
                                description={t('notebook.noVocabSelected')}
                            />
                        </Card>
                    )}
                </Col>
            }
        </Row>
    );
};

export default NotebookPage;
