import { Drawer, Typography, Tag, Divider, Descriptions, Image } from 'antd';
import { formatISODate } from 'utils/format.util';
import TextToSpeech from '@/components/common/text-to-speech/text-to-speech.component';
import type { IVocabulary } from 'types/vocabulary.type';

const { Title, Paragraph, Text } = Typography;

interface VocabularyDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    vocabulary: IVocabulary | null;
}

const VocabularyDetailDrawer = ({ open, onClose, vocabulary }: VocabularyDetailDrawerProps) => {
    if (!vocabulary) return null;

    const imageUrl = vocabulary.image
        ? vocabulary.image
        : undefined;

    return (
        <Drawer
            width="45vw"
            placement="right"
            onClose={onClose}
            open={open}
            title="Vocabulary Details"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {imageUrl &&
                    <Image
                        width="200px"
                        height="200px"
                        src={imageUrl}
                        alt={vocabulary.word}
                        style={{ borderRadius: '8px', marginBottom: '24px' }}
                    />
                }
                <div>
                    <Title level={2} style={{ margin: '0 15px 0 0' }}>
                        {vocabulary.word} <TextToSpeech text={vocabulary.word} />
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16, fontStyle: 'italic' }}>
                        {vocabulary.pronunciation}
                    </Text>
                    <Paragraph>
                        <Tag
                            color={vocabulary.partOfSpeech === 'noun' ? 'blue' :
                                vocabulary.partOfSpeech === 'verb' ? 'green' :
                                    vocabulary.partOfSpeech === 'adjective' ? 'purple' :
                                        vocabulary.partOfSpeech === 'adverb' ? 'red' :
                                            'orange'
                            }
                        >
                            {vocabulary.partOfSpeech}
                        </Tag>
                    </Paragraph>
                </div>
            </div>
            <Divider />



            <Title level={5}>Definition</Title>
            <Paragraph>
                {vocabulary.definitionEn}
            </Paragraph>
            <Paragraph italic>
                {vocabulary.meaningVi}
            </Paragraph>

            <Title level={5}>Example</Title>
            <Paragraph>
                "{vocabulary.exampleEn}"
            </Paragraph>
            <Paragraph italic>
                "{vocabulary.exampleVi}"
            </Paragraph>


            <Divider />

            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="ID">{vocabulary.id}</Descriptions.Item>
                <Descriptions.Item label="Category">
                    <Tag color="geekblue">{vocabulary.category?.name ?? 'N/A'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">{formatISODate(vocabulary.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{formatISODate(vocabulary.updatedAt)}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default VocabularyDetailDrawer;