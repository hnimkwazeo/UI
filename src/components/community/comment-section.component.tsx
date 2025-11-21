import { useState, useEffect } from 'react';
import { List, Avatar, Input, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined, SendOutlined } from '@ant-design/icons';
import { Comment } from '@ant-design/compatible';
import { useTranslation } from 'react-i18next';
import { fetchCommentsByPostIdAPI, createCommentAPI, deleteCommentAPI } from 'services/comment.service';
import type { IComment } from 'types/comment.type';
import styles from 'pages/client/community/community.page.module.scss';
import dayjs from 'dayjs';
import { useAuthStore } from 'stores/auth.store';
import type { IUser } from 'types/user.type';
import { useWebSocket } from 'context/websocket.context';
import Accept from 'components/common/share/accept.component';

const CommentItem = ({
    comment,
    user,
    replyingTo,
    replyContent,
    onReplyClick,
    onReplyChange,
    onPostReply,
    onCancelReply,
    onDelete,
}: {
    comment: IComment;
    user: IUser | null;
    replyingTo: number | null;
    replyContent: string;
    onReplyClick: (id: number) => void;
    onReplyChange: (value: string) => void;
    onPostReply: (content: string, parentId: number) => void;
    onCancelReply: () => void;
    onDelete: (id: number) => void;
}) => {
    const { t } = useTranslation();
    const actions = [
        <Accept apiPath="/api/v1/comments" method="POST" hide>
            <Button type='text' key="reply-action" onClick={() => onReplyClick(comment.id)}>
                {t('community.reply')}
            </Button>
        </Accept>,
        user?.id === comment.user.id && (
            <Popconfirm
                key="delete-action"
                title={t('community.deleteCommentTitle')}
                description={t('community.deleteCommentConfirm')}
                onConfirm={() => onDelete(comment.id)}
                okText={t('common.yes')}
                okButtonProps={{ danger: true }}
                cancelText={t('common.no')}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
                <Button type="text" className={styles.deleteAction}>
                    <DeleteOutlined /> {t('common.delete')}
                </Button>
            </Popconfirm>
        ),
    ];

    return (
        <Comment
            className={styles.commentItem}
            actions={actions}
            author={<a className={styles.commentAuthor}>{comment.user.name}</a>}
            avatar={<Avatar style={{ backgroundColor: user?.id === comment.user.id ? '#1677ff' : 'default' }}>{comment.user.name.charAt(0)}</Avatar>}
            content={<p>{comment.content}</p>}
            datetime={<span className={styles.commentDatetime}>{dayjs(comment.createdAt).fromNow()}</span>}
            key={comment.id}
        >
            {replyingTo === comment.id && (
                <Comment
                    avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{user?.name?.charAt(0)}</Avatar>}
                    content={
                        <>
                            <Input.TextArea
                                rows={2}
                                onChange={e => onReplyChange(e.target.value)}
                                value={replyContent}
                                placeholder={`${t('community.replyTo')} ${comment.user.name}...`}
                            />
                            <div className={styles.replyActions}>
                                <Button variant="outlined" onClick={() => onPostReply(replyContent, comment.id)} size="small">
                                    {t('community.sendReply')} <SendOutlined />
                                </Button>
                                <Button onClick={onCancelReply} type="text" size="small">
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        </>
                    }
                />
            )}
            {comment.replies && comment.replies.map(reply =>
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    user={user}
                    replyingTo={replyingTo}
                    replyContent={replyContent}
                    onReplyClick={onReplyClick}
                    onReplyChange={onReplyChange}
                    onPostReply={onPostReply}
                    onCancelReply={onCancelReply}
                    onDelete={onDelete}
                />
            )}
        </Comment>
    );
};

interface CommentSectionProps {
    postId: number;
    onCommentPosted: () => void;
    onCommentDeleted: (count: number) => void;
}

const CommentSection = ({ postId, onCommentPosted, onCommentDeleted }: CommentSectionProps) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { stompClient, isConnected } = useWebSocket();

    const [comments, setComments] = useState<IComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchComments = async () => {
        try {
            const res = await fetchCommentsByPostIdAPI(postId);
            if (res && res.data) {
                setComments(res.data.result);
            }
        } catch (error) {
            message.error(t('errors.fetchCommentsError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchComments();
    }, [postId]);

    useEffect(() => {
        if (isConnected && stompClient) {
            const commentTopic = `/topic/posts/${postId}/comments`;
            const subscription = stompClient.subscribe(commentTopic, (message) => {
                const newComment: IComment = JSON.parse(message.body);
                fetchComments();
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnected, stompClient, t]);

    const handlePostComment = async (content: string, parentCommentId: number | null) => {
        if (!content.trim()) return;
        try {
            await createCommentAPI({ postId, content, parentCommentId, attachments: [] });
            if (parentCommentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewCommentContent('');
            }
            // onCommentPosted();
            fetchComments();
        } catch (error) {
            message.error(t('errors.createCommentError'));
        }
    };

    const handleDeleteComment = async (id: number) => {
        try {
            await deleteCommentAPI(id);
            message.success(t('community.deleteCommentSuccess'));
            const newComments = removeCommentById(comments, id);
            const deletedCount = calculateDeletedCount(comments, newComments);
            setComments(newComments);
            onCommentDeleted(deletedCount);
        } catch (error) {
            message.error(t('errors.deleteCommentError'));
        }
    }

    const removeCommentById = (allComments: IComment[], idToRemove: number): IComment[] => {
        return allComments
            .filter(comment => comment.id !== idToRemove)
            .map(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    return { ...comment, replies: removeCommentById(comment.replies, idToRemove) };
                }
                return comment;
            });
    };

    const countComments = (allComments: IComment[]): number => {
        let count = allComments.length;
        allComments.forEach(comment => {
            if (comment.replies) {
                count += countComments(comment.replies);
            }
        });
        return count;
    }

    const calculateDeletedCount = (oldComments: IComment[], newComments: IComment[]) => {
        return countComments(oldComments) - countComments(newComments);
    }

    return (
        <div className={styles.commentSection}>
            <List
                dataSource={comments}
                header={`${countComments(comments)} ${t('community.comments')}`}
                itemLayout="horizontal"
                renderItem={item => (
                    <CommentItem
                        comment={item}
                        user={user}
                        replyingTo={replyingTo}
                        replyContent={replyContent}
                        onReplyClick={(id) => { setReplyingTo(id); setReplyContent(''); }}
                        onReplyChange={setReplyContent}
                        onPostReply={handlePostComment}
                        onCancelReply={() => setReplyingTo(null)}
                        onDelete={handleDeleteComment}
                    />
                )}
                loading={isLoading}
            />
            <Accept apiPath="/api/v1/comments" method="POST" hide>
                <Comment
                    avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{user?.name?.charAt(0)}</Avatar>}
                    content={
                        <>
                            <Input.TextArea
                                rows={2}
                                onChange={e => setNewCommentContent(e.target.value)}
                                value={newCommentContent}
                            />
                            <Button variant="outlined" onClick={() => handlePostComment(newCommentContent, null)} style={{ marginTop: 8 }}>
                                {t('community.addComment')} <SendOutlined />
                            </Button>
                        </>
                    }
                />
            </Accept>
        </div>
    );
};

export default CommentSection;
