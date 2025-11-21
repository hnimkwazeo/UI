import { ModalForm, ProFormText, ProFormSelect, ProFormContext, ProFormTextArea } from '@ant-design/pro-form';
import { message, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';
import type { ICreatePlan } from 'types/plan.type';
import { createPlanAPI } from 'services/plan.service';

interface CreatePlanModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
}

const CreatePlanModal = ({ open, onClose, onFinish }: CreatePlanModalProps) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create plan',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (data: ICreatePlan) => {
        data.active = true;
        try {
            const res = await createPlanAPI(data);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Plan created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create plan.', 'error')();
                return false;
            }
        } catch (error) {
            message.error('Failed to create plan.');
            return false;
        }
    };


    return (
        <>
            <ModalForm
                title="Create a new plan"
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
                    label="Name"
                    placeholder="Enter name"
                    rules={[{ required: true, message: 'Please enter the name!' }]}
                />
                <ProFormText
                    name="price"
                    label="Price"
                    placeholder="Enter price"
                    rules={[
                        { required: true, message: 'Please enter price!' },
                    ]}
                />
                <ProFormText
                    name="durationInDays"
                    label="Duration in days"
                    placeholder="Enter duration in days"
                    rules={[
                        { required: true, message: 'Please enter duration in days!' },
                    ]}
                />
                <ProFormTextArea
                    name="description"
                    label="Description"
                    placeholder="Enter description"
                    rules={[
                        { required: true, message: 'Please enter description!' },
                    ]}
                />
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default CreatePlanModal;