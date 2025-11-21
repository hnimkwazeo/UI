import { Drawer, Descriptions, Badge, Divider } from 'antd';
import { formatCurrency, formatISODate } from 'utils/format.util';
import type { IPlan } from 'types/plan.type';

interface PlanDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    plan: IPlan | null;
}

const PlanDetailDrawer = ({ open, onClose, plan }: PlanDetailDrawerProps) => {
    if (!plan) {
        return null;
    }

    return (
        <Drawer
            width={400}
            placement="right"
            onClose={onClose}
            open={open}
            title={`${plan.name}`}
        >
            <Descriptions title="Plan Information" bordered column={1}>
                <Descriptions.Item label="ID">{plan.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{plan.name}</Descriptions.Item>
                <Descriptions.Item label="Price">{formatCurrency(plan.price)}</Descriptions.Item>
                <Descriptions.Item label="Duration">{plan.durationInDays} days</Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Badge status={plan.active ? 'success' : 'error'} text={plan.active ? 'Active' : 'Inactive'} />
                </Descriptions.Item>
                <Descriptions.Item label="Description">{plan.description}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="History" bordered column={1}>
                <Descriptions.Item label="Created at">{formatISODate(plan.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Created by">{plan.createdBy || ''}</Descriptions.Item>
                <Descriptions.Item label="Updated at">{formatISODate(plan.updatedAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated by">{plan.updatedBy || ''}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default PlanDetailDrawer;