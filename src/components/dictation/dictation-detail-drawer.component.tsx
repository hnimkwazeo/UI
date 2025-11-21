import { Drawer, Typography, Divider, Table, Tag } from 'antd';
import type { IDictationTopic } from 'types/dictation.type';

interface Props {
    open: boolean;
    onClose: () => void;
    topic: IDictationTopic | null;
}

const DictationDetailDrawer = ({ open, onClose, topic }: Props) => {
    if (!topic) return null;

    const columns = [
        { title: 'Order', dataIndex: 'orderIndex', key: 'orderIndex' },
        { title: 'Correct Text', dataIndex: 'correctText', key: 'correctText' },
        {
            title: 'Audio', dataIndex: 'audioUrl', key: 'audioUrl',
            render: (url: string) => (
                <audio controls src={`${import.meta.env.VITE_BACKEND_URL}${url}`} style={{ height: 30 }} />
            )
        },
    ];

    return (
        <Drawer width="50vw" placement="right" onClose={onClose} open={open}>
            <Typography.Title level={3}>{topic.title}</Typography.Title>
            <Tag color="blue">{topic.category.name}</Tag>
            <Divider />
            <Typography.Paragraph>{topic.description}</Typography.Paragraph>
            <Divider />
            <Typography.Title level={4}>Sentences</Typography.Title>
            <Table dataSource={topic.sentences} columns={columns} rowKey="id" pagination={false} />
        </Drawer>
    );
};
export default DictationDetailDrawer;