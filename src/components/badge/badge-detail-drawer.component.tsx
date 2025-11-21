import { Drawer, Descriptions, Divider, Space, Avatar } from 'antd';
import { formatCurrency, formatISODate } from 'utils/format.util';
import type { IBadge } from 'types/badge.type';

interface BadgeDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    badge: IBadge | null;
}

const BadgeDetailDrawer = ({ open, onClose, badge }: BadgeDetailDrawerProps) => {
    if (!badge) {
        return null;
    }

    return (
        <Drawer
            width={400}
            placement="right"
            onClose={onClose}
            open={open}
            title={`${badge.name}`}
        >
            <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 20 }}>
                <Avatar src={`${import.meta.env.VITE_BACKEND_URL}${badge.image}`} size={80} ></Avatar>
            </Space>
            <Descriptions title="Badge Information" bordered column={1}>
                <Descriptions.Item label="ID">{badge.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{badge.name}</Descriptions.Item>
                <Descriptions.Item label="Point">{badge.point}</Descriptions.Item>
                <Descriptions.Item label="Description">{badge.description}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="History" bordered column={1}>
                <Descriptions.Item label="Created at">{formatISODate(badge.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Created by">{badge.createdBy || ''}</Descriptions.Item>
                <Descriptions.Item label="Updated at">{formatISODate(badge.updatedAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated by">{badge.updatedBy || ''}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default BadgeDetailDrawer;