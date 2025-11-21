import { ModalForm, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { Form, TreeSelect, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { createCategoryAPI } from 'services/category.service';
import type { ICreateCategory } from 'types/category.type';

interface CreateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    treeData: DataNode[];
    type: 'VIDEO' | 'ARTICLE' | 'GRAMMAR' | 'VOCABULARY' | 'DICTATION';
}

const CreateCategoryModal = ({ open, onClose, onFinish, treeData, type }: CreateCategoryModalProps) => {
    const [form] = Form.useForm<ICreateCategory>();

    const handleFinish = async (values: ICreateCategory) => {
        const dataToSubmit = { ...values, type: type };
        try {
            const res = await createCategoryAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                message.success('Category created successfully!');
                onFinish();
                return true;
            } else {
                message.error(res.message || 'Failed to create category.');
                return false;
            }
        } catch (error) {
            message.error('An error occurred.');
            return false;
        }
    };

    return (
        <ModalForm
            title="Create a new Category"
            form={form}
            open={open}
            onFinish={handleFinish}
            onOpenChange={(visible) => !visible && onClose()}
            modalProps={{ destroyOnClose: true }}
        >
            <ProFormText name="name" label="Category Name" rules={[{ required: true }]} />
            <ProFormTextArea name="description" label="Description" />
            <ProFormDigit name="orderIndex" label="Order Index" min={1} rules={[{ required: true }]} />

            <Form.Item name="parentId" label="Parent Category">
                <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    placeholder="Select a parent category (or leave blank for root)"
                    allowClear
                    treeLine={true}
                />
            </Form.Item>
        </ModalForm>
    );
};

export default CreateCategoryModal;