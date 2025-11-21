import { Drawer, Descriptions, Badge, Avatar, Divider, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { IUser } from 'types/user.type';
import { formatISODate } from 'utils/format.util';

interface UserDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    user: IUser | null;
}

const UserDetailDrawer = ({ open, onClose, user }: UserDetailDrawerProps) => {
    if (!user) {
        return null;
    }

    const badgeImageUrl = user.badge.image
        ? `${import.meta.env.VITE_BACKEND_URL}${user.badge.image}`
        : undefined;

    return (
        <Drawer
            width={600}
            placement="right"
            onClose={onClose}
            open={open}
            title={`${user.name}`}
        >
            <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 20 }}>
                <Avatar size={80} style={{ backgroundColor: '#4096FF', color: '#000', fontSize: 40 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                <Tag color="blue" style={{ fontSize: 16, padding: '5px 10px', marginLeft: '5px' }}>{user.name}</Tag>
            </Space>
            <Divider />
            <Descriptions title="Personal Information" bordered column={1}>
                <Descriptions.Item label="Rank">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Avatar size={40} src={badgeImageUrl} icon={<UserOutlined />} />
                        <h4 style={{ margin: '0px' }}>{user.badge.name}</h4>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Role">
                    <Tag color={user.role.name === 'ADMIN' ? 'red' : user.role.name === 'USER' ? 'blue' : 'green'}>
                        {user.role.name}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Badge status={user.active ? 'success' : 'error'} text={user.active ? 'Active' : 'Inactive'} />
                </Descriptions.Item>
                <Descriptions.Item label="Point"><b>{user.point}</b></Descriptions.Item>
                <Descriptions.Item label="Streak">{user.streakCount}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="History" bordered column={1}>
                <Descriptions.Item label="Created at">{formatISODate(user.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Created by">{user.createdBy || 'System'}</Descriptions.Item>
                <Descriptions.Item label="Updated at">{formatISODate(user.updatedAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated by">{user.updatedBy || 'System'}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default UserDetailDrawer;