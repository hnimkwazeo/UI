import { useRef, useState } from "react";
import type { IMeta } from "types/backend";
import { Button, notification, Popconfirm, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatISODate } from "utils/format.util";
import { deleteBadgeAPI, fetchBadgesAPI } from "services/badge.service";
import type { IBadge } from "types/badge.type";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import BadgeDetailDrawer from "components/badge/badge-detail-drawer.component";
import CreateBadgeModal from "components/badge/create-badge-modal.component";
import UpdateBadgeModal from "components/badge/update-badge-modal.component";
import type { IconType } from "antd/es/notification/interface";

const BadgePage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [selectedBadge, setSelectedBadge] = useState<IBadge | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Delete badge',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };
    const handleViewBadge = (plan: IBadge) => {
        setSelectedBadge(plan);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedBadge(null);
    };

    const handleFinishCreate = () => {
        setIsCreateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleOpenUpdateModal = (record: IBadge) => {
        setSelectedBadge(record);
        setIsUpdateModalOpen(true);
    };

    const handleFinishUpdate = () => {
        setIsUpdateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const res = await deleteBadgeAPI(id);
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


    const columns: ProColumns<IBadge>[] = [
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
                <a onClick={() => handleViewBadge(record)}>
                    {record.name}
                </a>
            )
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            hideInSearch: true,
            render: (_, record) => (
                <img src={`${import.meta.env.VITE_BACKEND_URL}${record.image}`} alt={record.name} style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: 'Point',
            dataIndex: 'point',
            key: 'point',
            hideInSearch: true,
            render: (_, record) => (
                <b>
                    {record.point}
                </b>
            )
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
                        title="Delete the badge"
                        description={`Are you sure to delete badge": ${record.name}?`}
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
            <ProTable<IBadge>
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

                    const res = await fetchBadgesAPI(query);

                    if (res && res.data) {
                        setMeta(res.data.meta);
                        return {
                            data: res.data.result,
                            page: 1,
                            success: true,
                            total: res.data.meta.total,
                        };
                    } else {
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
                headerTitle="Badge Management"
            />

            <BadgeDetailDrawer
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                badge={selectedBadge}
            />

            <CreateBadgeModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onFinish={handleFinishCreate}
            />

            <UpdateBadgeModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFinish={handleFinishUpdate}
                initialData={selectedBadge}
            />

            {contextHolder}
        </>
    )
}

export default BadgePage