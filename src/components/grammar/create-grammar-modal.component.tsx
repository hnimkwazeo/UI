import { useRef, useMemo } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Form, notification } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadFileAPI } from 'services/file.service';
import type { IconType } from 'antd/es/notification/interface';
import type { ICreateGrammar } from 'types/grammar.type';
import { createGrammarAPI } from 'services/grammar.service';

interface CreateGrammarModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateGrammarModal = ({ open, onClose, onFinish, categoryId }: CreateGrammarModalProps) => {
    const [form] = Form.useForm<ICreateGrammar>();
    const quillRef = useRef<ReactQuill>(null);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create grammar',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateGrammar) => {
        if (!categoryId) {
            openNotification(true, 'Please select a category.', 'error')();
            return false;
        }
        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createGrammarAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Grammar created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create Grammar.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while creating Grammar.', 'error')();
            return false;
        }
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                try {
                    const res = await uploadFileAPI(file);
                    if (res && res.data) {
                        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${res.data.fileUrl}`;
                        const editor = quillRef.current?.getEditor();
                        const range = editor?.getSelection();
                        if (range) {
                            editor?.insertEmbed(range.index, 'image', imageUrl);
                        }
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],

                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],

                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],

                ['link', 'image', 'video'],

                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    return (
        <>
            <ModalForm
                title="Create a new Grammar"
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

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please enter the content!' }]}
                >
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        modules={modules}
                        style={{ minHeight: '500px' }}
                    />
                </Form.Item>
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default CreateGrammarModal;