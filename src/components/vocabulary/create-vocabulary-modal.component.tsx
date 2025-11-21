import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Form, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';
import type { ICreateVocabulary } from 'types/vocabulary.type';
import { createVocabularyAPI } from 'services/vocabulary.service';

interface CreateVocabularyModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateVocabularyModal = ({ open, onClose, onFinish, categoryId }: CreateVocabularyModalProps) => {
    const [form] = Form.useForm<ICreateVocabulary>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create vocabulary',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateVocabulary) => {
        if (!categoryId) {
            openNotification(true, 'Please select a category.', 'error')();
            return false;
        }
        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createVocabularyAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Vocabulary created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create Vocabulary.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while creating Vocabulary.', 'error')();
            return false;
        }
    };

    return (
        <>
            <ModalForm
                title="Create a new Vocabulary"
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
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default CreateVocabularyModal;