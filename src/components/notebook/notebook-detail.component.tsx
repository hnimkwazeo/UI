import { Card, Typography, Button, Tag, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { IVocabulary } from 'types/vocabulary.type';
import styles from 'pages/client/notebook/notebook.page.module.scss';
import TextToSpeech from 'components/common/text-to-speech/text-to-speech.component';

const { Title, Text, Paragraph } = Typography;

interface NotebookDetailProps {
    vocabulary: IVocabulary;
    onDelete: (id: number) => Promise<void>;
}

const NotebookDetail = ({ vocabulary, onDelete }: NotebookDetailProps) => {
    const { t } = useTranslation();

    const handleDelete = async () => {
        await onDelete(vocabulary.id);
    };

    return (
        <Card className={styles.detailCard}>
            <div className={styles.detailHeader}>
                <Title level={3} className={styles.detailTitle}>
                    <Text className={styles.detailWord}>{vocabulary.word}</Text>
                    <Tag color={
                        vocabulary.partOfSpeech === 'noun' ? 'blue' :
                            vocabulary.partOfSpeech === 'verb' ? 'green' :
                                vocabulary.partOfSpeech === 'adjective' ? 'purple' :
                                    vocabulary.partOfSpeech === 'adverb' ? 'red' :
                                        'orange'
                    } className={styles.detailPartOfSpeech}>{vocabulary.partOfSpeech}</Tag>
                </Title>
                <Popconfirm
                    title={t('notebook.deleteConfirmTitle')}
                    description={t('notebook.deleteConfirmDesc')}
                    onConfirm={handleDelete}
                    okText={t('common.yes')}
                    cancelText={t('common.no')}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            </div>

            <Text className={styles.detailPhonetic}>{vocabulary.pronunciation}</Text>
            <TextToSpeech text={vocabulary.word} />

            <img
                src={vocabulary.image || 'https://placehold.co/600x400?text=No+Image'}
                alt={vocabulary.word}
                className={styles.detailImage}
            />

            <div className={styles.detailSection}>
                <Paragraph className={styles.detailMeaning}><strong>{t('dictionary.meaningVi')}:</strong> {vocabulary.meaningVi}</Paragraph>
                <Paragraph className={styles.detailMeaning}><strong>{t('dictionary.definitionEn')}:</strong> {vocabulary.definitionEn}</Paragraph>
            </div>

            <div className={styles.detailSection}>
                <Title level={5}>{t('vocabulary.exampleSentences')}</Title>
                <Paragraph className={styles.detailExample}>{vocabulary.exampleEn}</Paragraph>
                <Paragraph className={styles.detailExample}><em>{vocabulary.exampleVi}</em></Paragraph>
            </div>

            <Tag color='#130976' className={styles.detailCategory}>{vocabulary.category?.name || 'N/A'}</Tag>
        </Card>
    );
};

export default NotebookDetail;
