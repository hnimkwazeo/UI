import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, DatePicker, Spin, Alert, Typography, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarCircleOutlined, TransactionOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import type { IRevenueStats } from 'types/statistic.type';
import { formatCurrency } from 'utils/format.util';
import { fetchRevenueStatsAPI } from 'services/subscription.service';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RevenueStatisticPage = () => {
    const [statsData, setStatsData] = useState<IRevenueStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().startOf('year'),
        dayjs()
    ]);

    useEffect(() => {
        const fetchData = async () => {
            if (!dateRange || !dateRange[0] || !dateRange[1]) return;
            setLoading(true);
            setError(null);
            try {
                const startDate = dateRange[0].format('YYYY-MM-DD');
                const endDate = dateRange[1].format('YYYY-MM-DD');
                const query = `startDate=${startDate}&endDate=${endDate}`;
                const res = await fetchRevenueStatsAPI(query);
                if (res && res.data) {
                    setStatsData(res.data);
                }
            } catch (err) {
                setError("Failed to fetch revenue stats.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange]);

    const columns: ColumnsType<any> = [
        {
            title: 'Tên gói',
            dataIndex: 'planName',
            key: 'planName',
        },
        {
            title: 'Doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            sorter: (a, b) => a.totalRevenue - b.totalRevenue,
            render: (value: number) => formatCurrency(value),
            align: 'right',
        },
        {
            title: 'Số giao dịch',
            dataIndex: 'transactionCount',
            key: 'transactionCount',
            sorter: (a, b) => a.transactionCount - b.transactionCount,
            align: 'right',
        },
    ];

    if (loading) {
        return <Spin size="large" style={{ display: 'block', marginTop: 50 }} />;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Title level={3}>Statistic Revenue</Title>
            <RangePicker
                value={dateRange}
                onChange={(dates) => {
                    if (dates) {
                        setDateRange([dates[0]!, dates[1]!]);
                    }
                }}
                style={{ marginBottom: 24 }}
            />

            {statsData && (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title="Revenue total"
                                value={statsData.totalRevenue}
                                precision={0}
                                formatter={(value) => formatCurrency(Number(value))}
                                prefix={<DollarCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title="Tranactions count"
                                value={statsData.totalTransactions}
                                prefix={<TransactionOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card title="Transaction by plan ">
                            <Table
                                dataSource={statsData.revenueByPlan}
                                columns={columns}
                                rowKey="planId"
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default RevenueStatisticPage;