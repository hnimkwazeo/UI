import { useEffect, useState } from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, notification, Upload } from 'antd';
import { uploadFileAPI } from 'services/file.service';
import type { IconType } from 'antd/es/notification/interface';
import type { UploadProps } from 'antd/lib';
import type { RcFile } from 'antd/es/upload';
import { UploadOutlined } from "@ant-design/icons";
import type { IUpdateVideo, IVideo } from 'types/video.type';
import { updateVideoAPI } from 'services/video.service';
import TiptapEditor from 'components/common/tiptap-editor/tiptap-editor.component';

interface UpdateVideoModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IVideo | null;
}

const UpdateVideoModal = ({ open, onClose, onFinish, initialData }: UpdateVideoModalProps) => {
    const [form] = Form.useForm<IUpdateVideo>();
    const [loadingSubtitle, setLoadingSubtitle] = useState(false);
    const [subTitleName, setSubtitleName] = useState<string>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Update video',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                ...initialData,
            });
            if (initialData.category) {
                form.setFieldsValue({
                    categoryId: initialData.category.id
                });
            }
            if (initialData.subtitle) {
                setSubtitleName(initialData.subtitle.split('/').pop());
            }
        }
    }, [initialData, open]);

    const handleFinish = async (values: IUpdateVideo) => {
        if (!initialData) return false;
        const dataToSubmit = { ...values, id: initialData.id, categoryId: initialData.category?.id };

        try {
            const res = await updateVideoAPI(dataToSubmit);
            if (res && res.statusCode === 200) {
                openNotification(true, res.message || 'Video updated successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to updated Video.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while updated Video.', 'error')();
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

    return (
        <>
            <ModalForm
                title="Update a new Video"
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

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter the content!' }]}
                >
                    <TiptapEditor onChange={(description) => form.setFieldsValue({ description })} value={form.getFieldValue('description')} />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default UpdateVideoModal;