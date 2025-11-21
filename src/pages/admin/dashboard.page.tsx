import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, message, Spin, Typography } from 'antd';
import {
    UserOutlined,
    ArrowUpOutlined,
    DollarCircleOutlined,
    SolutionOutlined,
    ReadOutlined,
    PlaySquareOutlined,
    QuestionCircleOutlined,
    FontSizeOutlined
} from '@ant-design/icons';
import { Line, Area } from '@ant-design/charts';

import type { IDashboardData } from 'types/dashboard.type';
import { fetchDashboardAPI } from 'services/dashboard.service';
import { formatCurrency } from 'utils/format.util';

const DashboardPage = () => {
    const [data, setData] = useState<IDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const res = await fetchDashboardAPI();
                if (res && res.data) {
                    setData(res.data);
                }
            } catch (error) {
                message.error("Failed to fetch dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };
        getDashboardData();
    }, []);

    const commonLineConfig = {
        padding: 'auto',
        xField: 'date',
        yField: 'value',
        xAxis: { tickCount: 5 },
        smooth: true,
        point: {
            size: 4,
            shape: 'circle',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
    };

    const iconStyle: React.CSSProperties = {
        fontSize: '24px',
        color: '#fff',
        padding: '8px',
        borderRadius: '50%',
        marginRight: '16px'
    };

    return (
        <div >
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Users"
                            value={data ? data.totalUsers : 0}
                            loading={isLoading}
                            prefix={<UserOutlined style={{ ...iconStyle, background: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="New Users This Month"
                            value={data ? data.newUsersThisMonth : 0}
                            loading={isLoading}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined style={{ ...iconStyle, background: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Revenue"
                            value={data ? formatCurrency(data.totalRevenue) : '0 ₫'}
                            loading={isLoading}
                            prefix={<DollarCircleOutlined style={{ ...iconStyle, background: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="Active Subscriptions"
                            value={data ? data.totalActiveSubscriptions : 0}
                            loading={isLoading}
                            prefix={<SolutionOutlined style={{ ...iconStyle, background: '#13c2c2' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic title="Total Vocabularies" value={data?.contentCount.vocabularies} loading={isLoading} prefix={<FontSizeOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic title="Total Quizzes" value={data?.contentCount.quizzes} loading={isLoading} prefix={<QuestionCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic title="Total Articles" value={data?.contentCount.articles} loading={isLoading} prefix={<ReadOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic title="Total Posts" value={data?.contentCount.posts} loading={isLoading} prefix={<PlaySquareOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card hoverable title="New User Registrations (Last 30 Days)">
                        {isLoading ? <Spin /> : <Line {...commonLineConfig} data={data!.newUserRegistrationsChart} tooltip={{ title: 'Date', formatter: (datum: any) => ({ name: 'New Users', value: datum.value }) }} height={300} />}
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card hoverable title="Premium Upgrades (Last 30 Days)">
                        {isLoading ? <Spin /> : <Area {...commonLineConfig} data={data!.premiumUpgradesChart} colorField="l(270) 0:#ffffff 1:#52c41a" tooltip={{ title: 'Date', formatter: (datum: any) => ({ name: 'Upgrades', value: datum.value }) }} height={300} />}
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card hoverable title="Revenue (Last 30 Days)">
                        {isLoading ? <Spin /> : <Area {...commonLineConfig} data={data!.revenueChart} colorField="l(270) 0:#ffffff 1:#faad14" tooltip={{ title: 'Date', formatter: (datum: any) => ({ name: 'Revenue', value: formatCurrency(datum.value) }) }} height={300} />}
                    </Card>
                </Col>
            </Row>




        </div>
    );
};

export default DashboardPage;
