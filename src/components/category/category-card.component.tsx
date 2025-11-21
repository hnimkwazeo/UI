import { message, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { ICategory } from 'types/category.type';
import styles from './category-card.module.scss';
import icon_category from 'assets/icons/category/vocabulary.png';
import { useEffect, useState } from 'react';
import type { IGrammar } from 'types/grammar.type';
import { useTranslation } from 'react-i18next';
import { fetchGrammarsClientAPI } from 'services/grammar.service';

const { Title, Paragraph } = Typography;

interface CategoryCardProps {
    category: ICategory;
    basePath: 'vocabularies' | 'grammars' | 'articles' | 'videos' | 'dictations';
}

const CategoryCard = ({ category, basePath }: CategoryCardProps) => {
    const { t } = useTranslation();
    const [grammar, setGrammar] = useState<IGrammar | null>(null);

    useEffect(() => {
        const getCategoryDetail = async () => {
            try {
                const query = `categoryId=${category.id}`;
                const res = await fetchGrammarsClientAPI(query);
                if (res && res.data) {
                    setGrammar(res.data.result[0]);
                }
            } catch (error) {
                message.error(t('errors.fetchDataError'));
            }
        };
        getCategoryDetail();
    }, [category]);

    return (
        <Link to={
            basePath === 'vocabularies' ? `/vocabularies/category/${category.id}` :
                basePath === 'articles' ? `/articles/category/${category.id}` :
                    basePath === 'videos' ? `/videos/category/${category.id}` :
                        basePath === 'dictations' ? `/dictations/category/${category.id}` :
                            category.subCategories.length > 0 ? `/grammars/category/${category.id}` : `/grammars/${grammar?.id}`
        }>
            <div className={styles.categoryCard}>
                <div className={styles.categoryImage}>
                    <img src={icon_category} alt={category.name} />
                </div>
                <div className={styles.categoryMeta}>
                    <Title level={4} className={styles.categoryTitle}>{category.name}</Title>
                    <Paragraph ellipsis={{ rows: 1 }} className={styles.categoryDesc}>{category.description || ''}</Paragraph>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
