import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Card, Button, message, Checkbox, Divider, Select, Input, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { createQuizAPI } from 'services/quiz.service';
import type { ICreateQuiz } from 'types/quiz.type';

const DynamicQuestionFields = ({ questionIndex }: { questionIndex: number }) => {
    const form = Form.useFormInstance();
    const questionType = Form.useWatch(['questions', questionIndex, 'questionType'], form);

    switch (questionType) {
        case 'TRANSLATE_EN_TO_VI':
        case 'TRANSLATE_VI_TO_EN':
        case 'ARRANGE_WORDS':
        case 'FILL_IN_BLANK':
        case 'LISTENING_TRANSCRIPTION':
            return (
                <>
                    <Form.Item label="Correct Sentence" name={[questionIndex, 'correctSentence']} rules={[{ required: true }]}>
                        <Input.TextArea placeholder="Enter the correct sentence" />
                    </Form.Item>
                    {questionType === 'LISTENING_TRANSCRIPTION' && (
                        <Form.Item label="Audio URL" name={[questionIndex, 'audioUrl']} rules={[{ required: true }]}>
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
                        <Form.Item label="Audio URL" name={[questionIndex, 'audioUrl']} rules={[{ required: true }]}>
                            <Input placeholder="Enter audio URL" />
                        </Form.Item>
                    )}
                    <Form.Item label="Choices">
                        <Form.List name={[questionIndex, 'choices']}>
                            {(subFields, { add, remove }) => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {subFields.map(({ key, name, ...restField }) => (
                                        <Space key={key} align="baseline">
                                            <Form.Item {...restField} name={[name, 'content']}><Input placeholder="Choice content" /></Form.Item>
                                            <Form.Item {...restField} name={[name, 'imageUrl']}><Input placeholder="Image URL (optional)" /></Form.Item>
                                            <Form.Item {...restField} name={[name, 'isCorrect']} valuePropName="checked" initialValue={false}><Checkbox /></Form.Item>
                                            <DeleteOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Choice</Button>
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

interface CreateQuizModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateQuizModal = ({ open, onClose, onFinish, categoryId }: CreateQuizModalProps) => {
    const [form] = Form.useForm<ICreateQuiz>();

    const handleFinish = async (values: ICreateQuiz) => {
        if (!categoryId) {
            message.error("Category not selected!");
            return false;
        }

        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createQuizAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                message.success("Quiz created successfully!");
                onFinish();
                return true;
            } else {
                message.error(res.message || "Failed to create quiz.");
                return false;
            }
        } catch (error) {
            message.error("An error occurred.");
            return false;
        }
    };

    return (
        <ModalForm
            title="Create a New Quiz"
            form={form}
            open={open}
            onFinish={handleFinish}
            onOpenChange={(visible) => !visible && onClose()}
            modalProps={{ destroyOnClose: true, width: '70vw' }}
        >
            <ProFormText name="title" label="Quiz Title" rules={[{ required: true }]} />
            <ProFormTextArea name="description" label="Description" />

            <Divider>Questions</Divider>

            <Form.List name="questions">
                {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card key={key} title={`Question ${name + 1}`}
                                extra={<Button icon={<DeleteOutlined />} type="text" danger onClick={() => remove(name)} />}
                            >
                                <Form.Item
                                    {...restField}
                                    label="Question Type"
                                    name={[name, 'questionType']}
                                    rules={[{ required: true }]}
                                >
                                    <Select options={[
                                        { label: 'Fill in the Blank', value: 'FILL_IN_BLANK' },
                                        { label: 'Listening Comprehension', value: 'LISTENING_COMPREHENSION' },
                                        { label: 'Multiple Choice (Image)', value: 'MULTIPLE_CHOICE_IMAGE' },
                                        { label: 'Multiple Choice (Text)', value: 'MULTIPLE_CHOICE_TEXT' },
                                        { label: 'Translate EN to VI', value: 'TRANSLATE_EN_TO_VI' },
                                        { label: 'Translate VI to EN', value: 'TRANSLATE_VI_TO_EN' },
                                        { label: 'Listening & Transcribe', value: 'LISTENING_TRANSCRIPTION' },
                                        { label: 'Arrange Words', value: 'ARRANGE_WORDS' },
                                    ]} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    label="Prompt"
                                    name={[name, 'prompt']}
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea rows={2} />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Points"
                                    name={[name, 'points']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Question Order"
                                    name={[name, 'questionOrder']}
                                >
                                    <Input />
                                </Form.Item>

                                <DynamicQuestionFields questionIndex={name} />
                            </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Question
                        </Button>
                    </div>
                )}
            </Form.List>
        </ModalForm>
    );
};

export default CreateQuizModal;