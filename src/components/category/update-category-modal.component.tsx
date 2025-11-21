import { useEffect, useMemo } from 'react';
import { ModalForm, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { Button, Form, Popconfirm, TreeSelect, notification } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { deleteCategoryAPI, updateCategoryAPI } from 'services/category.service';
import type { ICategory, IUpdateCategory } from 'types/category.type';
import type { IconType } from 'antd/es/notification/interface';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface UpdateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    treeData: DataNode[];
    initialData: ICategory | null;
}

const UpdateCategoryModal = ({ open, onClose, onFinish, treeData, initialData }: UpdateCategoryModalProps) => {
    const [form] = Form.useForm<IUpdateCategory>();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, message: string, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: message,
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
                id: initialData.id,
                name: initialData.name,
                parentId: initialData.parentId,
                type: initialData.type,
                description: initialData.description,
                orderIndex: initialData.orderIndex
            });
        }
    }, [initialData, form, open]);

    const handleFinish = async (values: IUpdateCategory) => {
        if (!initialData) return false;
        const dataToSubmit = {
            ...values,
            id: initialData.id,
            type: initialData.type
        };
        try {
            const res = await updateCategoryAPI(dataToSubmit);
            if (res && res.statusCode === 200) {
                openNotification(true, 'Update Category', res.message || 'Category updated successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, 'Update Category', res.message || 'Failed to update category.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'Update Category', 'Failed to update category.', 'error')();
            return false;
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        try {
            const res = await deleteCategoryAPI(initialData.id);
            if (res) {
                openNotification(true, 'Delete Category', res.message || 'Category deleted successfully!', 'success')();
                onFinish();
                onClose();
            } else {
                openNotification(true, 'Delete Category', 'Failed to delete category.', 'error')();
            }
        } catch (error) {
            openNotification(true, 'Delete Category', 'Failed to delete category.', 'error')();
        }
    };

    const disableNodeAndDescendants = (nodes: DataNode[], selfId: number): DataNode[] => {
        return nodes.map(node => {
            const isDisabled = node.key === selfId;
            return {
                ...node,
                disabled: isDisabled,
                children: node.children ? disableNodeAndDescendants(node.children, selfId) : [],
            };
        });
    };

    const memoizedTreeData = useMemo(() => {
        if (initialData?.id) {
            return disableNodeAndDescendants(treeData, initialData.id);
        }
        return treeData;
    }, [treeData, initialData]);


    return (
        <>
            <ModalForm
                title="Update Category"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => !visible && onClose()}
                modalProps={{ destroyOnClose: true }}
                submitter={{
                    render: (props, defaultDoms) => [
                        <Popconfirm
                            key="delete"
                            title="Delete the category"
                            description={`Are you sure to delete "${initialData?.name}"? This action cannot be undone.`}
                            onConfirm={handleDelete}
                            okText="Yes"
                            okButtonProps={{ danger: true }}
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>,

                        ...defaultDoms,
                    ],
                }}
            >
                <ProFormText name="name" label="Category Name" rules={[{ required: true }]} />
                <ProFormTextArea name="description" label="Description" />
                <ProFormDigit name="orderIndex" label="Order Index" min={1} rules={[{ required: true }]} />

                <Form.Item name="parentId" label="Parent Category">
                    <TreeSelect
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={memoizedTreeData}
                        placeholder="Select a parent category (or leave blank for root)"
                        allowClear
                        treeLine={true}
                    />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default UpdateCategoryModal;