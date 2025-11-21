import { useMemo } from 'react';
import { Drawer, Typography, Tag, Divider, Image } from 'antd';
import DOMPurify from 'dompurify';
import styles from './grammar-detail-drawer.module.scss';
import type { IGrammar } from 'types/grammar.type';

const { Title, Paragraph } = Typography;

interface GrammarDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    grammar: IGrammar | null;
}

const GrammarDetailDrawer = ({ open, onClose, grammar }: GrammarDetailDrawerProps) => {
    const sanitizedContent = useMemo(() => {
        if (grammar?.content) {
            return DOMPurify.sanitize(grammar.content);
        }
        return '';
    }, [grammar]);

    if (!grammar) return null;

    return (
        <Drawer width="60vw" placement="right" onClose={onClose} open={open}>
            <Title level={2} style={{ marginTop: 24 }}>{grammar.name}</Title>

            <Paragraph>
                <Tag color="blue">{grammar.category?.name || 'Uncategorized'}</Tag>
            </Paragraph>

            <Divider />

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </Drawer>
    );
};

export default GrammarDetailDrawer;