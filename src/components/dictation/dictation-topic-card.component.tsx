import { Card, Typography, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SoundOutlined } from '@ant-design/icons';
import type { IDictationTopic } from 'types/dictation.type';
import styles from './dictation-topic-card.module.scss';

const { Title, Paragraph } = Typography;

interface DictationTopicCardProps {
    dictation: IDictationTopic;
}

const DictationTopicCard = ({ dictation }: DictationTopicCardProps) => {
    const { t } = useTranslation();

    return (
        <Card hoverable className={styles.dictationCard}>
            <Title level={5} className={styles.title}>{dictation.title}</Title>
            <Paragraph ellipsis={{ rows: 2 }} className={styles.description}>
                {dictation.description}
            </Paragraph>
            <div className={styles.meta}>
                <Link to={`/dictations/${dictation.id}`}>
                    <Button type="primary" icon={<SoundOutlined />}>
                        {t('dictation.startPractice')}
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

export default DictationTopicCard;
