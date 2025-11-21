import { Image, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styles from './article-card.module.scss';
import type { IArticle } from 'types/article.type';
import { formatISODate } from 'utils/format.util';

const { Title, Paragraph } = Typography;

interface ArticleCardProps {
    article: IArticle;
}

const ArticleCard = ({ article }: ArticleCardProps) => {

    return (
        <Link to={`/articles/${article.id}`}>
            <div className={styles.articleCard}>
                <Image className={styles.cardImage} width="100%" preview={false} height={150} src={`${import.meta.env.VITE_BACKEND_URL}${article.image}`} />
                <Title ellipsis={{ rows: 2 }} level={5} className={styles.cardTitle}>{article.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }} className={styles.cardDesc}>
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </Paragraph>
                <Paragraph className={styles.cardTime}>{formatISODate(article.createdAt)}</Paragraph>
            </div>
        </Link>
    );
};

export default ArticleCard;
