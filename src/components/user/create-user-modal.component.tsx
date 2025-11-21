import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';
import { createUserAPI } from 'services/user.service';
import type { ICreateUser } from 'types/user.type';

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
}

const CreateUserModal = ({ open, onClose, onFinish }: CreateUserModalProps) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create user',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (data: ICreateUser) => {
        data.badgeId = 1;
        try {
            const res = await createUserAPI(data);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'User created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create user.', 'error')();
                return false;
            }
        } catch (error) {
            message.error('Failed to create user.');
            return false;
        }
    };


    return (
        <>
            {contextHolder}
            <ModalForm
                title="Create a new user"
                open={open}
                onFinish={handleFinish}
                modalProps={{
                    destroyOnClose: true,
                }}
                onOpenChange={(visible) => {
                    if (!visible) {
                        onClose();
                    }
                }}
            >
                <ProFormText
                    name="name"
                    label="Full Name"
                    placeholder="Enter full name"
                    rules={[{ required: true, message: 'Please enter the name!' }]}
                />
                <ProFormText
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    rules={[
                        { required: true, message: 'Please enter the email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    rules={[{ required: true, message: 'Please enter the password!' }]}
                />
                <ProFormSelect
                    name="roleId"
                    label="Role"
                    placeholder="Select a role"
                    rules={[{ required: true, message: 'Please select a role!' }]}
                    options={[
                        { label: 'ADMIN', value: 1 },
                        { label: 'USER', value: 3 },
                        { label: 'PREMIUM', value: 2 }
                    ]}
                />
            </ModalForm>
        </>
    );
};

export default CreateUserModal;