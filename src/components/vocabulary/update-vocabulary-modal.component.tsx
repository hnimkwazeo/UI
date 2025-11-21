import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Form, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';
import type { IUpdateVocabulary, IVocabulary } from 'types/vocabulary.type';
import { updateVocabularyAPI } from 'services/vocabulary.service';
import { useEffect } from 'react';

interface UpdateVocabularyModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    initialData: IVocabulary | null;
}

const UpdateVocabularyModal = ({ open, onClose, onFinish, initialData }: UpdateVocabularyModalProps) => {
    const [form] = Form.useForm<IUpdateVocabulary>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Update vocabulary',
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

    const handleFinish = async (values: IUpdateVocabulary) => {
        if (!initialData) return false;
        const dataToSubmit = { ...values, id: initialData.id };

        try {
            const res = await updateVocabularyAPI(dataToSubmit);
            if (res && res.statusCode === 200) {
                openNotification(true, res.message || 'Vocabulary updated successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to update Vocabulary.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while updating Vocabulary.', 'error')();
            return false;
        }
    };

    return (
        <>
            <ModalForm
                title="Update a new Vocabulary"
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
                <ProFormText name="word" label="Word" rules={[{ required: true }]} />
                <ProFormText name="definitionEn" label="Definition(English)" rules={[{ required: true }]} />
                <ProFormText name="meaningVi" label="Meaning(Vietnamese)" rules={[{ required: true }]} />
                <ProFormText name="exampleEn" label="Example(English)" rules={[{ required: true }]} />
                <ProFormText name="exampleVi" label="Example(Vietnamese)" rules={[{ required: true }]} />
                <ProFormText name="partOfSpeech" label="partOfSpeech" rules={[{ required: true }]} />
                <ProFormText name="pronunciation" label="Pronunciation" rules={[{ required: true }]} />
                <ProFormText name="image" label="Image url" rules={[{ required: true }]} />
                <ProFormText name="audio" label="Audio url" rules={[{ required: true }]} />
                <ProFormText name="categoryId" hidden />
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default UpdateVocabularyModal;