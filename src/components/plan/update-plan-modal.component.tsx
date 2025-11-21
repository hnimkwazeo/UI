import { useEffect } from 'react';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Form, message, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';
import type { IPlan, IUpdatePlan } from 'types/plan.type';
import { updatePlanAPI } from 'services/plan.service';

interface UpdatePlanModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IPlan | null;
}

const UpdatePlanModal = ({ open, onClose, onFinish, initialData }: UpdatePlanModalProps) => {
    const [form] = Form.useForm<IUpdatePlan>();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                id: initialData.id,
                name: initialData.name,
                price: initialData.price,
                durationInDays: initialData.durationInDays,
                description: initialData.description,
                active: initialData.active
            });
        }
    }, [initialData, form]);


    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({ message: 'Update plan', description: desc, pauseOnHover, duration: 3, type });
    };

    const handleFinish = async (values: IUpdatePlan) => {
        if (!initialData) return false;

        const dataToUpdate: IUpdatePlan = {
            id: initialData.id,
            name: values.name,
            price: values.price,
            durationInDays: values.durationInDays,
            description: values.description,
            active: values.active
        };

        try {
            const res = await updatePlanAPI(dataToUpdate);
            if (res && res.statusCode === 200) {
                openNotification(true, res.message || 'Plan updated successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to update plan.', 'error')();
                return false;
            }
        } catch (error) {
            message.error('An error occurred.');
            return false;
        }
    };

    return (
        <>
            <ModalForm
                title="Update plan information"
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
                <ProFormText name="id" label="ID" disabled />
                <ProFormText name="name" label="Name" placeholder="Enter plan name"
                    rules={[{ required: true, message: 'Plan name is required' }]} />
                <ProFormText name="price" label="Price" placeholder="Enter plan price"
                    rules={[{ required: true, message: 'Plan price is required' }]} />
                <ProFormText name="durationInDays" label="Duration in days" placeholder="Enter plan duration in days"
                    rules={[{ required: true, message: 'Plan duration is required' }]} />
                <ProFormText name="description" label="Description" placeholder="Enter plan description"
                    rules={[{ required: true, message: 'Plan description is required' }]} />
                <ProFormSelect name="active" label="Active" placeholder="Select active status"
                    options={[
                        { label: 'Active', value: true },
                        { label: 'Inactive', value: false },
                    ]}
                    rules={[{ required: true, message: 'Active status is required' }]} />
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default UpdatePlanModal;