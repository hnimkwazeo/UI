import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useRef, useState } from "react";
import type { IMeta } from "types/backend";
import type { IPlan } from "types/plan.type";
import { Button, notification, Popconfirm, Space, Switch } from "antd";
import { formatCurrency, formatISODate } from "utils/format.util";
import { deletePlanAPI, fetchPlansAPI } from "services/plan.service";
import CreatePlanModal from "components/plan/create-plan-modal.component";
import PlanDetailDrawer from "components/plan/plan-detail-drawer.component";
import UpdatePlanModal from "components/plan/update-plan-modal.component";
import type { IconType } from "antd/es/notification/interface";

const PlanPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [currentPageData, setCurrentPageData] = useState<IPlan[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Delete plan',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinishCreate = () => {
        setIsCreateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleViewPlan = (plan: IPlan) => {
        setSelectedPlan(plan);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedPlan(null);
    };

    const handleOpenUpdateModal = (record: IPlan) => {
        setSelectedPlan(record);
        setIsUpdateModalOpen(true);
    };

    const handleFinishUpdate = () => {
        setIsUpdateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const res = await deletePlanAPI(id);
            if (res.status === 204) {
                openNotification(true, res.message || 'Plan deleted successfully!', 'success')();
                actionRef.current?.reload();
            } else {
                openNotification(true, res.message || 'Failed to delete plan.', 'error')();
            }
        } catch (error) {
            openNotification(true, 'An error occurred while deleting user.', 'error')();
        }
    };

    const columns: ProColumns<IPlan>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (_, record) => (
                <a onClick={() => handleViewPlan(record)}>
                    {record.name}
                </a>
            )
        },
        {
            title: 'Duration',
            dataIndex: 'durationInDays',
            key: 'durationInDays',
            sorter: true,
            hideInSearch: true,
            render: (_, record) => (
                <b> {record.durationInDays} days</b>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'durationInDays',
            valueType: 'digitRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        minDuration: value[0],
                        maxDuration: value[1],
                    };
                },
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            hideInSearch: true,
            render: (_, record) => (
                <b> {formatCurrency(record.price)}</b>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            valueType: 'digitRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        minPrice: value[0],
                        maxPrice: value[1],
                    };
                },
            },
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            filters: true,
            valueEnum: {
                true: { text: 'Active', status: 'Success' },
                false: { text: 'Inactive', status: 'Error' },
            },
            render: (_, record) => (
                <Switch defaultChecked={record.active} disabled />
            ),
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        startCreatedAt: value[0],
                        endCreatedAt: value[1],
                    };
                },
            },
        },
        {
            title: 'Updated at',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Action',
            key: 'action',
            search: false,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} color="primary"
                        onClick={() => handleOpenUpdateModal(record)}>
                    </Button>
                    <Popconfirm
                        title="Delete the plan"
                        description={`Are you sure to delete plan: ${record.name}?`}
                        onConfirm={() => handleDeleteUser(record.id)}
                        icon={<QuestionCircleOutlined />}
                        okText="Yes"
                        cancelText="No"
                        placement="leftTop"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <ProTable<IPlan>
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    const queryParts: string[] = [];
                    queryParts.push(`page=${params.current}`);
                    queryParts.push(`size=${params.pageSize}`);

                    for (const key in filter) {
                        if (filter[key]) {
                            queryParts.push(`${key}=${filter[key]}`);
                        }
                    }

                    const searchParams = { ...params };
                    delete searchParams.current;
                    delete searchParams.pageSize;

                    for (const key in searchParams) {
                        if (searchParams[key]) {
                            queryParts.push(`${key}=${searchParams[key]}`);
                        }
                    }

                    if (sort) {
                        for (const key in sort) {
                            const value = sort[key];
                            queryParts.push(`sort=${key},${value === 'ascend' ? 'asc' : 'desc'}`);
                        }
                    }

                    const query = queryParts.join('&');

                    const res = await fetchPlansAPI(query);

                    if (res && res.data) {
                        setMeta(res.data.meta);
                        setCurrentPageData(res.data.result);
                        return {
                            data: res.data.result,
                            page: 1,
                            success: true,
                            total: res.data.meta.total,
                        };
                    } else {
                        setCurrentPageData([]);
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }
                }}
                rowKey="id"
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total
                }}
                toolBarRender={() => [
                    <Button type="primary" key="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create
                    </Button>,
                ]}
                scroll={{ x: 'max-content' }}
                headerTitle="Plan Management"
            />

            <CreatePlanModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onFinish={handleFinishCreate}
            />

            <PlanDetailDrawer
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                plan={selectedPlan}
            />

            <UpdatePlanModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFinish={handleFinishUpdate}
                initialData={selectedPlan}
            />

            {contextHolder}
        </>
    );
}

export default PlanPage