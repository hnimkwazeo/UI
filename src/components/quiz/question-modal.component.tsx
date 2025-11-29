import { ModalForm, ProFormTextArea, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import { Form, Input, Checkbox, Space, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { IQuestion } from 'types/quiz.type';

// Component con hiển thị các trường nhập liệu tùy theo loại câu hỏi
const DynamicFields = () => {
    const form = Form.useFormInstance();
    const questionType = Form.useWatch('questionType', form);

    switch (questionType) {
        case 'TRANSLATE_EN_TO_VI':
        case 'TRANSLATE_VI_TO_EN':
        case 'ARRANGE_WORDS':
        case 'FILL_IN_BLANK':
        case 'LISTENING_TRANSCRIPTION':
            return (
                <>
                    <Form.Item label="Correct Sentence" name="correctSentence" rules={[{ required: true }]}>
                        <Input.TextArea placeholder="Enter the correct sentence" />
                    </Form.Item>
                    {questionType === 'LISTENING_TRANSCRIPTION' && (
                        <Form.Item label="Audio URL" name="audioUrl" rules={[{ required: true }]}>
                            <Input placeholder="Enter audio URL" />
                        </Form.Item>
                    )}
                </>
            );

        case 'MULTIPLE_CHOICE_TEXT':
        case 'MULTIPLE_CHOICE_IMAGE':
        case 'LISTENING_COMPREHENSION':
            return (
                <>
                    {questionType === 'LISTENING_COMPREHENSION' && (
                        <Form.Item label="Audio URL" name="audioUrl" rules={[{ required: true }]}>
                            <Input placeholder="Enter audio URL" />
                        </Form.Item>
                    )}
                    <Form.Item label="Choices">
                        <Form.List name="choices">
                            {(subFields, { add, remove }) => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {subFields.map(({ key, name, ...restField }) => (
                                        <Space key={key} align="baseline" style={{ display: 'flex', width: '100%' }}>
                                            <Form.Item {...restField} name={[name, 'id']} hidden>
                                                <Input />
                                            </Form.Item>

                                            <Form.Item {...restField} name={[name, 'content']} style={{ flex: 1 }}><Input placeholder="Content" /></Form.Item>
                                            <Form.Item {...restField} name={[name, 'imageUrl']} style={{ flex: 1 }}><Input placeholder="Image URL" /></Form.Item>
                                            <Form.Item {...restField} name={[name, 'isCorrect']} valuePropName="checked"><Checkbox /></Form.Item>
                                            <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red', cursor: 'pointer' }} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add({ isCorrect: false, content: '' })} block icon={<PlusOutlined />}>Add Choice</Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>
                </>
            );
        default:
            return null;
    }
}

interface QuestionModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: (values: any) => Promise<boolean | void>;
    initialValues?: IQuestion | null; 
    quizId: number;
}

const QuestionModal = ({ open, onClose, onFinish, initialValues, quizId }: QuestionModalProps) => {
    const [form] = Form.useForm();

    return (
        <ModalForm
            title={initialValues ? "Edit Question" : "Add New Question"}
            form={form}
            open={open}
            onOpenChange={(visible) => !visible && onClose()}
            onFinish={async (values) => {
                const submitData = { ...values, quizId };
                return onFinish(submitData);
            }}
            initialValues={initialValues || { questionType: 'MULTIPLE_CHOICE_TEXT', points: 1 }}
            modalProps={{ destroyOnHidden: true, width: '60vw' }}
        >
            <ProFormSelect
                name="questionType"
                label="Question Type"
                options={[
                    { label: 'Multiple Choice (Text)', value: 'MULTIPLE_CHOICE_TEXT' },
                    { label: 'Multiple Choice (Image)', value: 'MULTIPLE_CHOICE_IMAGE' },
                    { label: 'Fill in the Blank', value: 'FILL_IN_BLANK' },
                    { label: 'Listening Comprehension', value: 'LISTENING_COMPREHENSION' },
                    { label: 'Translate EN to VI', value: 'TRANSLATE_EN_TO_VI' },
                    { label: 'Translate VI to EN', value: 'TRANSLATE_VI_TO_EN' },
                    { label: 'Listening & Transcribe', value: 'LISTENING_TRANSCRIPTION' },
                    { label: 'Arrange Words', value: 'ARRANGE_WORDS' },
                ]}
                rules={[{ required: true }]}
                disabled={!!initialValues} 
            />

            <ProFormTextArea name="prompt" label="Question Prompt" rules={[{ required: true }]} />
            
            <Space>
                <ProFormDigit name="points" label="Points" width="xs" min={1} fieldProps={{ precision: 0 }} />
                <ProFormDigit name="questionOrder" label="Order" width="xs" fieldProps={{ precision: 0 }} />
            </Space>

            <DynamicFields />
        </ModalForm>
    );
};

export default QuestionModal;