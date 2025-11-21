import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { IGrammar } from 'types/grammar.type';
import styles from './grammar-card.module.scss';

const { Title, Paragraph } = Typography;

interface GrammarCardProps {
    grammar: IGrammar;
}

const GrammarCard = ({ grammar }: GrammarCardProps) => {
    const contentSnippet = grammar.content.substring(0, 100) + '...';

    return (
        <Link to={`/grammars/${grammar.id}`}>
            <Card hoverable className={styles.grammarCard}>
                <Card.Meta
                    title={<Title level={5} className={styles.cardTitle}>{grammar.name}</Title>}
                    description={<Paragraph ellipsis={{ rows: 2 }} className={styles.cardDesc}>{contentSnippet}</Paragraph>}
                />
            </Card>
        </Link>
    );
};

export default GrammarCard;
