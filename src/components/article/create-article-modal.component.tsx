import { useRef, useMemo, useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form, notification, Upload } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createArticleAPI } from 'services/article.service';
import { uploadFileAPI } from 'services/file.service';
import type { ICreateArticle } from 'types/article.type';
import type { IconType } from 'antd/es/notification/interface';
import type { UploadProps } from 'antd/lib';
import type { RcFile } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

interface CreateArticleModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateArticleModal = ({ open, onClose, onFinish, categoryId }: CreateArticleModalProps) => {
    const [form] = Form.useForm<ICreateArticle>();
    const quillRef = useRef<ReactQuill>(null);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>();
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [audioName, setAudioName] = useState<string>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create article',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateArticle) => {
        if (!categoryId) {
            openNotification(true, 'Please select a category.', 'error')();
            return false;
        }
        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createArticleAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Article created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create article.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while creating article.', 'error')();
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


    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                try {
                    const res = await uploadFileAPI(file);
                    if (res && res.data) {
                        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${res.data.fileUrl}`;
                        const editor = quillRef.current?.getEditor();
                        const range = editor?.getSelection();
                        if (range) {
                            editor?.insertEmbed(range.index, 'image', imageUrl);
                        }
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],

                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],

                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],

                ['link', 'image', 'video'],

                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    return (
        <>
            <ModalForm
                title="Create a new Article"
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

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please enter the content!' }]}
                >
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        modules={modules}
                        style={{ minHeight: '500px' }}
                    />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default CreateArticleModal;