import { Card, Typography, List, Tag } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { INlpAnalysis } from 'types/dictation.type';
import styles from './analysis-result.module.scss';

const { Title, Paragraph, Text } = Typography;

interface AnalysisResultProps {
    result: INlpAnalysis | null;
}

const AnalysisResult = ({ result }: AnalysisResultProps) => {
    const { t } = useTranslation();

    // debug - remove later
    // console.log('AnalysisResult result:', result);

    // defensive defaults
    if (!result) {
        // optionally render placeholder instead of null
        return (
            <Card className={styles.resultContainer}>
                <div className={styles.score}>
                    <Text>{t('dictation.yourScore')}: </Text>
                    <Tag>-- / 100</Tag>
                </div>
                <Paragraph className={styles.diffParagraph}>
                    {/* no diffs yet */}
                </Paragraph>
            </Card>
        );
    }

    const score = typeof result.score === 'number' ? result.score : 0;
    const diffs = Array.isArray(result.diffs) ? result.diffs : [];
    const explanations = Array.isArray(result.explanations) ? result.explanations : [];

    const getDiffTag = (type: 'equal' | 'insert' | 'delete') => {
        if (type === 'insert') return styles.insert;
        if (type === 'delete') return styles.delete;
        return styles.equal;
    };

    return (
        <Card className={styles.resultContainer}>
            <div className={styles.score}>
                <Text>{t('dictation.yourScore')}: </Text>
                <Tag color={score > 80 ? 'green' : score > 50 ? 'orange' : 'red'}>
                    {score} / 100
                </Tag>
            </div>

            <Paragraph className={styles.diffParagraph}>
                {diffs.map((diff, index) => (
                    <span key={index} className={getDiffTag(diff.type)}>
                        {diff.text}
                    </span>
                ))}
            </Paragraph>

            {score < 100 && explanations.length > 0 && (
                <div className={styles.explanationSection}>
                    <Title level={5}><InfoCircleOutlined /> {t('dictation.explanations')}</Title>
                    <List
                        size="small"
                        dataSource={explanations}
                        renderItem={item => (
                            <List.Item>
                                <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} /> {item}
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </Card>
    );
};


export default AnalysisResult;
