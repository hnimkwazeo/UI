import { useState } from 'react';
import { Modal, Input, Button, Upload, message, Avatar, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'stores/auth.store';
import { createPostAPI } from 'services/post.service';
import { uploadFileAPI } from 'services/file.service';
import styles from 'pages/client/community/community.page.module.scss';
import type { IPost } from 'types/post.type';
import { type IAttachmentType } from 'types/attachment.type';

const { Text } = Typography;
const { TextArea } = Input;

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    onPostCreated: (newPost: IPost) => void;
}

const CreatePostModal = ({ open, onClose, onPostCreated }: CreatePostModalProps) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [caption, setCaption] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const customUploadRequest = async (options: any) => {
        const { file, onSuccess, onError } = options;

        try {
            const res = await uploadFileAPI(file as RcFile);
            if (res && res.data) {
                onSuccess(res.data);
                message.success(t('community.uploadSuccess', { fileName: file.name }));
            } else {
                throw new Error(t('errors.uploadFailed'));
            }
        } catch (error) {
            onError(error);
            message.error(t('errors.uploadFailedWithMessage', { fileName: file.name }));
        }
    };

    const handleCreatePost = async () => {
        if (!caption.trim() && fileList.length === 0) {
            message.warning(t('community.postEmptyWarning'));
            return;
        }

        if (fileList.some(file => file.status === 'uploading')) {
            message.warning(t('community.uploadInProgressWarning'));
            return;
        }

        setIsSubmitting(true);
        try {
            const attachments = fileList
                .filter(file => file.status === 'done' && file.response)
                .map(file => {
                    const response = file.response;
                    return {
                        fileUrl: response.fileUrl,
                        fileType: "IMAGE" as IAttachmentType,
                        originalFileName: response.originalFileName,
                        fileSize: response.fileSize,
                    };
                });

            const res = await createPostAPI({ caption, attachments });
            if (res && res.data) {
                message.success(t('community.postCreateSuccess'));
                onPostCreated(res.data);
                setCaption('');
                setFileList([]);
                onClose();
            }
        } catch (error) {
            message.error(t('errors.postCreateError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="submit" type="primary" loading={isSubmitting} onClick={handleCreatePost} block>
                    {t('community.post')}
                </Button>
            ]}
        >
            <div className={styles.modalHeader}>
                <Avatar size="large">{user?.name?.charAt(0)}</Avatar>
                <Text className={styles.userName} strong>{user?.name}</Text>
            </div>
            <TextArea
                className={styles.textArea}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={t('community.postPlaceholder')}
                autoSize={{ minRows: 4, maxRows: 8 }}
                bordered={false}
            />
            <Upload
                customRequest={customUploadRequest}
                listType="picture"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                onRemove={(file) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    setFileList(newFileList);
                    return true;
                }}
                multiple
            >
                <Button icon={<PictureOutlined />}></Button>
            </Upload>
        </Modal>
    );
};

export default CreatePostModal;
