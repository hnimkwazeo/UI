import { Card, Typography, List, Tag } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { INlpAnalysis } from 'types/dictation.type';
import styles from './analysis-result.module.scss';

const { Title, Paragraph, Text } = Typography;

interface AnalysisResultProps {
    result: INlpAnalysis;
}

const AnalysisResult = ({ result }: AnalysisResultProps) => {
    const { t } = useTranslation();

    const getDiffTag = (type: 'equal' | 'insert' | 'delete') => {
        if (type === 'insert') return styles.insert;
        if (type === 'delete') return styles.delete;
        return styles.equal;
    };

    return (
        <Card className={styles.resultContainer}>
            <div className={styles.score}>
                <Text>{t('dictation.yourScore')}: </Text>
                <Tag color={result.score > 80 ? 'green' : result.score > 50 ? 'orange' : 'red'}>
                    {result.score} / 100
                </Tag>
            </div>

            <Paragraph className={styles.diffParagraph}>
                {result.diffs.map((diff, index) => (
                    <span key={index} className={getDiffTag(diff.type)}>
                        {diff.text}
                    </span>
                ))}
            </Paragraph>

            {result.score < 100 && result.explanations && result.explanations.length > 0 && (
                <div className={styles.explanationSection}>
                    <Title level={5}><InfoCircleOutlined /> {t('dictation.explanations')}</Title>
                    <List
                        size="small"
                        dataSource={result.explanations}
                        renderItem={item => <List.Item><CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} /> {item}</List.Item>}
                    />
                </div>
            )}
        </Card>
    );
};

export default AnalysisResult;
