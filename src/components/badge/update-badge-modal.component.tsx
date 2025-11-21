import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { Form, Upload, notification } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { updateBadgeAPI } from 'services/badge.service';
import { uploadFileAPI } from 'services/file.service';
import type { IBadge, IUpdateBadge } from 'types/badge.type';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import type { IconType } from 'antd/es/notification/interface';

interface UpdateBadgeModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IBadge | null;
}

const UpdateBadgeModal = ({ open, onClose, onFinish, initialData }: UpdateBadgeModalProps) => {
    const [form] = Form.useForm<IUpdateBadge>();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
            setImageUrl(`${import.meta.env.VITE_BACKEND_URL}${initialData.image}`);
        }
    }, [initialData, form, open]);


    const openNotification = (desc: string, type: IconType = 'success') => {
        api.open({ message: 'Update badge', description: desc, duration: 3, type });
    };

    const handleFinish = async (values: IUpdateBadge) => {
        if (!initialData) return false;

        const dataToUpdate: IUpdateBadge = {
            ...values,
            id: initialData.id,
        };

        try {
            const res = await updateBadgeAPI(dataToUpdate);
            if (res && res.statusCode === 200) {
                openNotification('Badge updated successfully!');
                onFinish();
                return true;
            } else {
                openNotification(res.message || 'Failed to update badge.', 'error');
                return false;
            }
        } catch (error) {
            openNotification('An error occurred.', 'error');
            return false;
        }
    };

    const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        try {
            const res = await uploadFileAPI(file as RcFile);
            if (res && res.data) {
                form.setFieldsValue({ image: res.data.fileUrl });
                setImageUrl(`${import.meta.env.VITE_BACKEND_URL}${res.data.fileUrl}`);
                if (onSuccess) onSuccess('ok');
            } else {
                if (onError) onError(new Error(res.message || 'Upload failed'));
            }
        } catch (error) {
            if (onError) onError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div> {loading ? <LoadingOutlined /> : <PlusOutlined />} <div style={{ marginTop: 8 }}>Upload</div> </div>
    );

    return (
        <>
            {contextHolder}
            <ModalForm
                title="Update Badge"
                form={form}
                open={open}
                onFinish={handleFinish}
                modalProps={{ destroyOnClose: true }}
                onOpenChange={(visible) => !visible && onClose()}
            >
                <ProFormText name="name" label="Badge Name"
                    rules={[{ required: true, message: 'Badge name is required' }]} />
                <ProFormDigit name="point" label="Point"
                    rules={[{ required: true, message: 'Point is required' }]} />
                <ProFormTextArea name="description" label="Description"
                    rules={[{ required: true, message: 'Description is required' }]} />

                <Form.Item label="Badge Image">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={handleUpload}
                    >
                        {imageUrl ? <img src={imageUrl} alt="badge" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>

                <ProFormText name="image" hidden />
            </ModalForm>
        </>
    );
};

export default UpdateBadgeModal;