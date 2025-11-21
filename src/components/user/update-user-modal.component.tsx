import { useEffect } from 'react';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Form, message, notification } from 'antd';
import { updateUserAPI } from 'services/user.service';
import type { IUser, IUpdateUser } from 'types/user.type';
import type { IconType } from 'antd/es/notification/interface';

interface UpdateUserModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IUser | null;
}

const UpdateUserModal = ({ open, onClose, onFinish, initialData }: UpdateUserModalProps) => {
    const [form] = Form.useForm<IUpdateUser>();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                id: initialData.id,
                email: initialData.email,
                name: initialData.name,
                roleId: initialData.role.id,
                active: initialData.active
            });
        }
    }, [initialData, form]);


    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({ message: 'Update user', description: desc, pauseOnHover, duration: 3, type });
    };

    const handleFinish = async (values: IUpdateUser) => {
        if (!initialData) return false;

        const dataToUpdate: IUpdateUser = {
            id: initialData.id,
            name: values.name,
            roleId: values.roleId,
            active: values.active,
            password: values.password
        };

        try {
            const res = await updateUserAPI(dataToUpdate);
            if (res && res.statusCode === 200) {
                openNotification(true, res.message || 'User updated successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to update user.', 'error')();
                return false;
            }
        } catch (error) {
            message.error('An error occurred.');
            return false;
        }
    };

    return (
        <>
            {contextHolder}
            <ModalForm
                title="Update user information"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => {
                    if (!visible) {
                        onClose();
                    }
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
            >
                <ProFormText name="email" label="Email" placeholder="Enter email" disabled />
                <ProFormText name="name" label="Full Name"
                    placeholder="Enter full name"
                    rules={[{ required: true, message: 'Please enter the name!' }]} />
                <ProFormSelect
                    name="roleId"
                    label="Role"
                    placeholder="Select a role"
                    rules={[{ required: true }]}
                    options={[
                        { label: 'ADMIN', value: 1 },
                        { label: 'USER', value: 3 },
                        { label: 'PREMIUM', value: 2 },
                    ]}
                />
                <ProFormText.Password name="password" label="Password"
                    placeholder="Enter password if you want to change" />
                <ProFormSelect
                    name="active"
                    label="Active"
                    placeholder="Select active"
                    rules={[{ required: true }]}
                    options={[
                        { label: 'Active', value: true },
                        { label: 'Inactive', value: false },
                    ]}
                />
            </ModalForm>
        </>
    );
};

export default UpdateUserModal;