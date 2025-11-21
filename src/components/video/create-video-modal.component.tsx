import { useMemo, useRef, useState } from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, notification, Upload } from 'antd';
import { uploadFileAPI } from 'services/file.service';
import type { IconType } from 'antd/es/notification/interface';
import type { UploadProps } from 'antd/lib';
import type { RcFile } from 'antd/es/upload';
import { UploadOutlined } from "@ant-design/icons";
import type { ICreateVideo } from 'types/video.type';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createVideoAPI } from 'services/video.service';

interface CreateVideoModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateVideoModal = ({ open, onClose, onFinish, categoryId }: CreateVideoModalProps) => {
    const [form] = Form.useForm<ICreateVideo>();
    const [loadingSubtitle, setLoadingSubtitle] = useState(false);
    const [subTitleName, setSubtitleName] = useState<string>();
    const quillRef = useRef<ReactQuill>(null);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create video',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateVideo
    ) => {
        if (!categoryId) {
            openNotification(true, 'Please select a category.', 'error')();
            return false;
        }
        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createVideoAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Video created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create Video.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while creating Video.', 'error')();
            return false;
        }
    };

    const handleAudioUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        setLoadingSubtitle(true);
        try {
            const res = await uploadFileAPI(file as RcFile);
            if (res && res.data) {
                form.setFieldsValue({ subtitle: res.data.fileUrl });
                setSubtitleName((file as RcFile).name);
                if (onSuccess) onSuccess('ok');
            } else { if (onError) onError(new Error(res.message || 'Upload failed')); }
        } catch (error) { if (onError) onError(error as Error); }
        finally { setLoadingSubtitle(false); }
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
                title="Create a new Video"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                        setSubtitleName(undefined);
                        onClose();
                    }
                }}
                modalProps={{ destroyOnClose: true, width: '60vw' }}
            >
                <ProFormText name="title" label="Video Title" rules={[{ required: true }]} />
                <ProFormText name="url" label="Url" rules={[{ required: true }]} />
                <Form.Item label="SubTitle File">
                    <Upload name="subtitle" customRequest={handleAudioUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={loadingSubtitle}>Click to Upload</Button>
                    </Upload>
                    {subTitleName && <span style={{ marginLeft: '10px' }}>{subTitleName}</span>}
                </Form.Item>

                <ProFormText name="subtitle" hidden />

                {/* <ProFormTextArea name="description" label="Description"
                    rules={[{ required: true, message: 'Please enter description!' }]} /> */}

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter the description!' }]}
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

export default CreateVideoModal;