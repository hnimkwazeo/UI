import React, { useState } from 'react';
import { ModalForm, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { Form, Upload, notification, Input } from 'antd';
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { createBadgeAPI } from 'services/badge.service';
import { uploadFileAPI } from 'services/file.service';
import type { ICreateBadge } from 'types/badge.type';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import type { IconType } from 'antd/es/notification/interface';

interface CreateBadgeModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
}

const CreateBadgeModal = ({ open, onClose, onFinish }: CreateBadgeModalProps) => {
    const [form] = Form.useForm<ICreateBadge>();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create badge',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateBadge) => {
        try {
            const res = await createBadgeAPI(values);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Badge created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create badge.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while creating badge.', 'error')();
            return false;
        }
    };

    const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        try {
            const res = await uploadFileAPI(file as RcFile);
            console.log(res);
            if (res && res.data) {
                form.setFieldsValue({ image: res.data.fileUrl });
                setImageUrl(`${import.meta.env.VITE_BACKEND_URL}${res.data.fileUrl}`);
                console.log("imgurl: ", `${import.meta.env.VITE_BACKEND_URL}${res.data.fileUrl}`);
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
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <ModalForm
                title="Create a new Badge"
                form={form}
                open={open}
                onFinish={handleFinish}
                modalProps={{
                    destroyOnClose: true,
                }}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                        setImageUrl(undefined);
                        onClose();
                    }
                }}
            >
                <ProFormText name="name" label="Badge Name"
                    rules={[{ required: true, message: 'Please enter badge name!' }]} />
                <ProFormDigit name="point" label="Point"
                    rules={[{ required: true, message: 'Please enter point!' }]} />
                <ProFormTextArea name="description" label="Description"
                    rules={[{ required: true, message: 'Please enter description!' }]} />

                <Form.Item
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={handleUpload}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="image"
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <Input type="hidden" />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default CreateBadgeModal;