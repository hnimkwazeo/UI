import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import type { IMeta } from "types/backend";
import { Switch, Tag } from "antd";
import { formatISODate } from "utils/format.util";
import type { ISubscription } from "types/subscription.type";
import { fetchAllSubscriptionAPI } from "services/subscription.service";

const SubscriptionPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });

    const columns: ProColumns<ISubscription>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
        },
        {
            title: 'User',
            dataIndex: ['user', 'email'],
            key: 'user.email',
            search: false,
            sorter: true,
            copyable: true,
        },
        {
            title: 'Plan',
            dataIndex: ['plan', 'name'],
            key: 'plan.name',
            search: false,
            sorter: true,
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
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            filters: true,
            valueEnum: {
                PENDING: { text: 'Pending', color: 'blue' },
                PAID: { text: 'Paid', color: 'green' },
                FAILED: { text: 'Failed', color: 'red' },
            },
            render: (_, record) => (
                <Tag color={record.paymentStatus === 'PENDING' ? 'blue' : record.paymentStatus === 'PAID' ? 'green' : 'red'}>
                    {record.paymentStatus}
                </Tag>
            ),
        },
        {
            title: 'Transaction',
            dataIndex: 'transactionId',
            key: 'transactionId',
            search: false,
        },
        {
            title: 'Start date',
            dataIndex: 'startDate',
            key: 'startDate',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Start date',
            dataIndex: 'startDate',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        startDate: value[0],
                        endDate: value[1],
                    };
                },
            },
        },
        {
            title: 'End date',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
    ];

    return (
        <>
            <ProTable<ISubscription>
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

                    const res = await fetchAllSubscriptionAPI(query);

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

                ]}
                scroll={{ x: 'max-content' }}
                headerTitle="Subscription Management"
            />

        </>
    );
}

export default SubscriptionPage