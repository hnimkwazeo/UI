import { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Statistic, message, Spin, Typography, Tag, Button } from 'antd';
import { HddOutlined, CodeOutlined, ApiOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchLogfileAPI, fetchMetricAPI } from 'services/monitoring.service';

const { Title, Text } = Typography;

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const LoggingPage = () => {
    const [logContent, setLogContent] = useState('');
    const [metrics, setMetrics] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [logRes, memRes, cpuRes, reqRes] = await Promise.all([
                fetchLogfileAPI(),
                fetchMetricAPI('jvm.memory.used'),
                fetchMetricAPI('process.cpu.usage'),
                fetchMetricAPI('http.server.requests')
            ]);

            const logData = (logRes as any)?.data || (logRes as string);
            setLogContent(logData);

            const newMetrics: Record<string, number> = {};
            if (memRes?.data) newMetrics.memory = memRes.data.measurements[0].value;
            if (cpuRes?.data) newMetrics.cpu = cpuRes.data.measurements[0].value * 100;
            if (reqRes?.data) newMetrics.requests = reqRes.data.measurements.find(m => m.statistic === 'COUNT')?.value ?? 0;

            setMetrics(newMetrics);

        } catch (error) {
            message.error("Failed to fetch system data.");
        } finally {
            setIsLoading(false);
            if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
            }
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logContent]);

    const renderHighlightedLog = (log: string) => {
        if (typeof log !== 'string') {
            return <span style={{ color: '#e06c75' }}>Log content is not a string.</span>;
        }

        return log.split('\n').map((line, index) => {
            let color = '#abb2bf';
            if (line.includes('INFO')) color = '#61afef';
            if (line.includes('WARN')) color = '#e5c07b';
            if (line.includes('ERROR')) color = '#e06c75';
            return (
                <span key={index} style={{ color, display: 'block', whiteSpace: 'pre-wrap' }}>
                    {line}
                </span>
            );
        });
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ background: '#323842', color: '#fff' }}>
                        <Statistic
                            title={<Text style={{ color: '#abb2bf' }}>Memory Usage</Text>}
                            value={metrics.memory ? formatBytes(metrics.memory) : 0}
                            loading={isLoading}
                            prefix={<HddOutlined />}
                            valueStyle={{ color: '#61afef' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ background: '#323842', color: '#fff' }}>
                        <Statistic
                            title={<Text style={{ color: '#abb2bf' }}>CPU Usage</Text>}
                            value={metrics.cpu ? metrics.cpu.toFixed(2) : 0}
                            loading={isLoading}
                            suffix="%"
                            prefix={<CodeOutlined />}
                            valueStyle={{ color: '#98c379' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ background: '#323842', color: '#fff' }}>
                        <Statistic
                            title={<Text style={{ color: '#abb2bf' }}>Total Requests</Text>}
                            value={metrics.requests ?? 0}
                            loading={isLoading}
                            prefix={<ApiOutlined />}
                            valueStyle={{ color: '#e5c07b' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title={<Title level={4} style={{ color: '#fff', margin: 0 }}>System Logs</Title>}
                bordered={false}
                style={{ background: '#21252b' }}
                extra={<Button icon={<ReloadOutlined />} onClick={fetchAllData} loading={isLoading}>Refresh</Button>}
            >
                <div ref={logContainerRef} style={{ height: '60vh', overflowY: 'scroll', background: '#21252b', padding: '10px', borderRadius: '4px' }}>
                    <pre style={{ marginLeft: '10px', fontFamily: 'Menlo, Monaco, "Courier New", monospace', fontSize: '14px', fontWeight: '500' }}>
                        {isLoading ? <Spin /> : renderHighlightedLog(logContent)}
                    </pre>
                </div>
            </Card>
        </div>
    );
};

export default LoggingPage;
