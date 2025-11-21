import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, Upload, Col, Row, Card, Input, notification } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { createDictationAPI } from 'services/dictation.service';
import { uploadFileAPI } from 'services/file.service';
import type { ICreateDictationTopic } from 'types/dictation.type';
import type { RcFile } from 'antd/es/upload';
import type { IconType } from 'antd/es/notification/interface';

interface Props {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateDictationModal = ({ open, onClose, onFinish, categoryId }: Props) => {
    const [form] = Form.useForm<ICreateDictationTopic>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create dictation topic',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateDictationTopic) => {
        if (!categoryId) {
            openNotification(true, 'Please select a category.', 'error')();
            return false;
        }

        const sentencesWithOrder = values.sentences.map((sentence, index) => ({
            ...sentence,
            orderIndex: index + 1,
        }));

        const dataToSubmit = {
            ...values,
            categoryId,
            sentences: sentencesWithOrder
        };

        try {
            await createDictationAPI(dataToSubmit);
            openNotification(true, 'Dictation topic created successfully!', 'success')();
            onFinish();
            return true;
        } catch (error) {
            openNotification(true, 'Failed to create dictation topic.', 'error')();
            return false;
        }
    };

    return (
        <>
            <ModalForm
                title="Create a new Dictation Topic"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => !visible && onClose()}
                modalProps={{ destroyOnClose: true, width: '60vw' }}
            >
                <ProFormText name="title" label="Topic Title" rules={[{ required: true }]} />
                <ProFormTextArea name="description" label="Description" />

                <Form.List
                    name="sentences"
                    rules={[{
                        validator: async (_, sentences) => {
                            if (!sentences || sentences.length < 1) {
                                return Promise.reject(new Error('Please add at least one sentence'));
                            }
                        },
                    }]}
                >
                    {(fields, { add, remove }) => (
                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                            {fields.map((field) => (
                                <Card
                                    key={field.key}
                                    size="small"
                                    extra={<MinusCircleOutlined onClick={() => remove(field.name)} />}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                {...field}
                                                label={`Sentence ${field.name + 1}`}
                                                name={[field.name, 'correctText']}
                                                rules={[{ required: true, message: 'Please enter text!' }]}
                                            >
                                                <Input placeholder="Correct Text" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Audio File"
                                                help={form.getFieldValue(['sentences', field.name, 'audioUrl'])?.split('/').pop()}
                                            >
                                                <Upload
                                                    customRequest={async ({ file, onSuccess, onError }) => {
                                                        try {
                                                            const res = await uploadFileAPI(file as RcFile);
                                                            if (res && res.data) {
                                                                const sentences = form.getFieldValue('sentences') || [];
                                                                sentences[field.name] = {
                                                                    ...sentences[field.name],
                                                                    audioUrl: res.data.fileUrl,
                                                                };
                                                                form.setFieldsValue({ sentences });
                                                                onSuccess?.('ok');
                                                            }
                                                        } catch (err) { onError?.(err as Error); }
                                                    }}
                                                    showUploadList={false}
                                                >
                                                    <Button icon={<UploadOutlined />}>Upload Audio</Button>
                                                </Upload>
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'audioUrl']}
                                                rules={[{ required: true, message: 'Please upload audio!' }]}
                                                noStyle
                                            >
                                                <Input type="hidden" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}

                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add Sentence
                            </Button>
                        </div>
                    )}
                </Form.List>
            </ModalForm>
            {contextHolder}
        </>
    );
};
export default CreateDictationModal;