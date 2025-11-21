import { Card, Typography } from 'antd';
import styles from 'pages/client/premium/premium.page.module.scss';

const { Title, Text } = Typography;

interface FeatureBlockProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureBlock = ({ icon, title, description }: FeatureBlockProps) => {
    return (
        <Card className={styles.featureBlock}>
            <img src={icon} alt={title} className={styles.featureBlockIcon} />
            <Title level={4}>{title}</Title>
            <Text className={styles.description} >{description}</Text>
        </Card>
    );
};

export default FeatureBlock;
