import { useState, useEffect } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form, notification, Upload } from 'antd';
import 'react-quill/dist/quill.snow.css';
import { updateArticleAPI } from 'services/article.service';
import { uploadFileAPI } from 'services/file.service';
import type { IArticle, IUpdateArticle } from 'types/article.type';
import type { IconType } from 'antd/es/notification/interface';
import type { UploadProps } from 'antd/lib';
import type { RcFile } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import TiptapEditor from 'components/common/tiptap-editor/tiptap-editor.component';

interface UpdateArticleModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IArticle | null;
}

const UpdateArticleModal = ({ open, onClose, onFinish, initialData }: UpdateArticleModalProps) => {
    const [form] = Form.useForm<IUpdateArticle>();
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>();
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [audioName, setAudioName] = useState<string>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Update article',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    useEffect(() => {
        if (initialData) {
            console.log(initialData);
            form.setFieldsValue({
                ...initialData,
            });
            if (initialData.category) {
                form.setFieldsValue({
                    categoryId: initialData.category.id
                });
            }
            if (initialData.image) {
                setThumbnailUrl(`${import.meta.env.VITE_BACKEND_URL}${initialData.image}`);
            }
            if (initialData.audio) {
                setAudioName(initialData.audio.split('/').pop());
            }
        }
    }, [initialData, open]);


    const handleFinish = async (values: IUpdateArticle) => {
        if (!initialData) return false;
        const dataToSubmit = { ...values, id: initialData.id };

        try {
            const res = await updateArticleAPI(dataToSubmit);
            if (res && res.statusCode === 200) {
                openNotification(true, res.message || 'Article updated successfully!', 'success');
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to update article.', 'error');
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred.', 'error');
            return false;
        }
    };

    const handleThumbnailUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        setLoadingThumbnail(true);
        try {
            const res = await uploadFileAPI(file as RcFile);
            if (res && res.data) {
                form.setFieldsValue({ image: res.data.fileUrl });
                setThumbnailUrl(`${import.meta.env.VITE_BACKEND_URL}${res.data.fileUrl}`);
                if (onSuccess) onSuccess('ok');
            } else { if (onError) onError(new Error(res.message || 'Upload failed')); }
        } catch (error) { if (onError) onError(error as Error); }
        finally { setLoadingThumbnail(false); }
    };

    const handleAudioUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        setLoadingAudio(true);
        try {
            const res = await uploadFileAPI(file as RcFile);
            if (res && res.data) {
                form.setFieldsValue({ audio: res.data.fileUrl });
                setAudioName((file as RcFile).name);
                if (onSuccess) onSuccess('ok');
            } else { if (onError) onError(new Error(res.message || 'Upload failed')); }
        } catch (error) { if (onError) onError(error as Error); }
        finally { setLoadingAudio(false); }
    };

    return (
        <>
            <ModalForm
                title="Update a new Article"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                        setThumbnailUrl(undefined);
                        setAudioName(undefined);
                        onClose();
                    }
                }}
                modalProps={{ destroyOnClose: true, width: '60vw' }}
            >
                <ProFormText name="title" label="Article Title" rules={[{ required: true }]} />
                <Form.Item label="Thumbnail Image">
                    <Upload
                        name="thumbnail"
                        listType="picture-card"
                        showUploadList={false}
                        customRequest={handleThumbnailUpload}
                    >
                        {thumbnailUrl ? <img src={thumbnailUrl} alt="thumbnail" style={{ width: '100%' }} /> : (
                            <div> {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />} <div style={{ marginTop: 8 }}>Upload</div> </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item label="Audio File">
                    <Upload name="audio" customRequest={handleAudioUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={loadingAudio}>Click to Upload</Button>
                    </Upload>
                    {audioName && <span style={{ marginLeft: '10px' }}>{audioName}</span>}
                </Form.Item>

                <ProFormText name="image" hidden />
                <ProFormText name="audio" hidden />
                <ProFormText name="categoryId" hidden />

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please enter the content!' }]}
                >
                    <TiptapEditor onChange={(content) => form.setFieldsValue({ content })} value={form.getFieldValue('content')} />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default UpdateArticleModal;