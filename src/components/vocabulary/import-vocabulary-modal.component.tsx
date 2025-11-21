import { useState } from 'react';
import { Modal, Upload, Button, message, Table, Divider, Steps, Space, notification } from 'antd';
import { InboxOutlined, CloudUploadOutlined, ProfileOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import type { UploadProps } from 'antd/es/upload/interface';
import type { IconType } from 'antd/es/notification/interface';
import type { ICreateVocabulary } from 'types/vocabulary.type';
import { bulkCreateVocabularyAPI } from 'services/vocabulary.service';

const { Dragger } = Upload;

interface ImportVocabularyModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null
}


const ImportVocabularyModal = ({ open, onClose, onFinish, categoryId }: ImportVocabularyModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [parsedData, setParsedData] = useState<ICreateVocabulary[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Import Vocabulary',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: ({ file, onSuccess, onError }) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json<ICreateVocabulary>(worksheet);

                    json.map((item) => {
                        item.categoryId = categoryId!;
                    });

                    setParsedData(json);
                    setCurrentStep(1);
                    if (onSuccess) onSuccess("ok");
                } catch (error) {
                    message.error("Failed to parse the file.");
                    if (onError) onError(new Error("Parsing failed"));
                }
            };
            reader.readAsArrayBuffer(file as Blob);
        },
        onRemove: () => {
            setParsedData([]);
        },
    };

    const handleFinalImport = async () => {
        setIsSubmitting(true);
        try {
            const res = await bulkCreateVocabularyAPI(parsedData);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || "Import successful.", 'success')();
                onFinish();
                handleClose();
            } else {
                openNotification(true, res.message || "Import failed.", 'error')();
            }
        } catch (error) {
            openNotification(true, "Import failed.", 'error')();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        setParsedData([]);
        onClose();
    };

    const previewColumns = [
        { title: 'Word', dataIndex: 'word' },
        { title: 'pronunciation', dataIndex: 'pronunciation' },
        { title: 'partOfSpeech', dataIndex: 'partOfSpeech' },
    ];

    return (
        <>
            <Modal
                title="Import Vocabulary from File"
                open={open}
                onCancel={handleClose}
                width={800}
                footer={
                    currentStep === 0
                        ? <Button onClick={handleClose}>Cancel</Button>
                        : (
                            <Space>
                                <Button onClick={() => setCurrentStep(0)}>Back to Upload</Button>
                                <Button type="primary" loading={isSubmitting} onClick={handleFinalImport}>
                                    Import {parsedData.length} rows
                                </Button>
                            </Space>
                        )
                }
                destroyOnClose
            >
                <Steps
                    current={currentStep}
                    items={[
                        { title: 'Upload File', icon: <CloudUploadOutlined /> },
                        { title: 'Preview Data', icon: <ProfileOutlined /> },
                    ]}
                />
                <Divider />
                {currentStep === 0 && (
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
                        <p className="ant-upload-hint">File should contain columns: word, definitionEn, meaningVi, exampleEn, exampleVi, partOfSpeech, pronunciation, image, audio.</p>
                        <a target='_blank' href="https://docs.google.com/spreadsheets/d/1wAasQU_KmTNAr35yDBIiyBono1IbGVDyo9rDPTv4FtA/edit?usp=sharing" download onClick={(e) => e.stopPropagation()}>
                            Download Template
                        </a>
                    </Dragger>
                )}
                {currentStep === 1 && (
                    <>
                        <h3>Preview Data:</h3>
                        <Table
                            dataSource={parsedData}
                            columns={previewColumns}
                            rowKey="word"
                            pagination={{ pageSize: 5 }}
                        />
                    </>
                )}
            </Modal>
            {contextHolder}
        </>
    );
};

export default ImportVocabularyModal;