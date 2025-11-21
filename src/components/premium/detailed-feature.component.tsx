import { Row, Col, Typography, List } from 'antd';
import styles from 'pages/client/premium/premium.page.module.scss';
import img_item_feature from 'assets/images/item_feature_store.png';

const { Title, Paragraph, Text } = Typography;

interface DetailedFeatureProps {
    image: string;
    title: string;
    description: string;
    features: string[];
    imagePosition?: string;
}

const DetailedFeature = ({ image, title, description, features, imagePosition = 'left' }: DetailedFeatureProps) => {
    const imageCol = (
        <Col xs={24} md={12}>
            <img src={image} alt={title} className={styles.detailedFeatureImage} />
        </Col>
    );

    const textCol = (
        <Col xs={24} md={12}>
            <Title className={styles.title} level={3}>{title}</Title>
            <Paragraph className={styles.description} type="secondary">{description}</Paragraph>
            <List
                dataSource={features}
                renderItem={item => (
                    <List.Item>
                        <Text className={styles.feature}>
                            <img src={img_item_feature} alt="Premium Feature" className={styles.featureIcon} />
                            {item}
                        </Text>
                    </List.Item>
                )}
            />
        </Col>
    );

    return (
        <div className={styles.detailedFeatureSection}>
            <Row gutter={[48, 24]} align="middle">
                {imagePosition === 'left' ? [imageCol, textCol] : [textCol, imageCol]}
            </Row>
        </div>
    );
};

export default DetailedFeature;
