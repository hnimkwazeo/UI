import { useEffect } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Form, notification } from 'antd';
import 'react-quill/dist/quill.snow.css';
import type { IconType } from 'antd/es/notification/interface';
import TiptapEditor from 'components/common/tiptap-editor/tiptap-editor.component';
import type { IGrammar, IUpdateGrammar } from 'types/grammar.type';
import { updateGrammarAPI } from 'services/grammar.service';

interface UpdateGrammarModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IGrammar | null;
}

const UpdateGrammarModal = ({ open, onClose, onFinish, initialData }: UpdateGrammarModalProps) => {
    const [form] = Form.useForm<IUpdateGrammar>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Update grammar',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    useEffect(() => {
        if (initialData) {
            console.log(initialData);
            form.setFieldsValue({
                ...initialData,
            });
            if (initialData.category) {
                form.setFieldsValue({
                    categoryId: initialData.category.id
                });
            }
        }
    }, [initialData, open]);


    const handleFinish = async (values: IUpdateGrammar) => {
        if (!initialData) return false;
        const dataToSubmit = { ...values, id: initialData.id };

        try {
            const res = await updateGrammarAPI(dataToSubmit);
            if (res && res.statusCode === 200) {
                openNotification(true, res.message || 'Grammar updated successfully!', 'success');
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to update Grammar.', 'error');
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred.', 'error');
            return false;
        }
    };

    return (
        <>
            <ModalForm
                title="Update a new Grammar"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                        onClose();
                    }
                }}
                modalProps={{ destroyOnClose: true, width: '60vw' }}
            >
                <ProFormText name="name" label="Grammar name" rules={[{ required: true }]} />

                <ProFormText name="categoryId" hidden />

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please enter the content!' }]}
                >
                    <TiptapEditor onChange={(content) => form.setFieldsValue({ content })} value={form.getFieldValue('content')} />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default UpdateGrammarModal;