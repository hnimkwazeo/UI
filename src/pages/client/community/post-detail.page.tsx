import { useState, useEffect } from 'react';
import { Row, Col, message, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './community.page.module.scss';
import type { IPost } from 'types/post.type';
import { fetchPostDetailAPI } from 'services/post.service';
import PostCard from 'components/community/post-card.component';
import AccountCard from 'components/community/account-card.component';
import ConnectCard from 'components/community/connect-card.component';
import { useParams } from 'react-router-dom';
import Logo from 'assets/images/logo.png';
import { useMediaQuery } from 'react-responsive';

const PostDetailPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<IPost | null>(null);

    const md = useMediaQuery({ maxWidth: 991.98 });

    const fetchPost = async () => {
        try {
            const res = await fetchPostDetailAPI(parseInt(id!));
            if (res && res.data) {
                setPost(res.data);
            }
        } catch (error) {
            setPost(null);
            message.error(t('errors.fetchPostsError'));
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    if (!post) {
        return (
            <Empty
                image={Logo}
                imageStyle={{ height: 100 }}
                description={t('common.noData')}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={16}>
                    <PostCard key={post.id} post={post} onDelete={() => void 0} />
                </Col>

                {
                    !md &&
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <AccountCard />
                        <ConnectCard />
                    </Col>
                }
            </Row>
        </div>
    );
};

export default PostDetailPage;
