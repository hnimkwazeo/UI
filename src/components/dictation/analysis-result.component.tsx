import { useState } from 'react';
import { Card, Typography, List, Tag, Button, message } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { INlpAnalysis } from 'types/dictation.type';
import styles from './analysis-result.module.scss';
import { useChatStore } from '../../stores/useChat.store';
import { chatbotService } from '../../services/chatbot.service';

const { Title, Paragraph, Text } = Typography;

interface AnalysisResultProps {
    result: INlpAnalysis | null;
    sentenceId?: number;
    userText?: string;
    // --- UPDATE: Thêm loại bài tập để tái sử dụng component ---
    type?: 'dictation' | 'grammar' | 'vocab'; 
}

const AnalysisResult = ({ result, sentenceId, userText, type = 'dictation' }: AnalysisResultProps) => {
    const { t } = useTranslation();
    
    // Hook gọi Store
    const addMessage = useChatStore((state) => state.addMessage);
    const setChatbotOpen = useChatStore((state) => state.setIsOpen);
    const [isExplaining, setIsExplaining] = useState(false);

    // --- HÀM XỬ LÝ KHI BẤM NÚT (ĐÃ NÂNG CẤP) ---
    const handleExplain = async () => {
        // 1. Validate dữ liệu đầu vào tùy theo loại
        if (type === 'dictation' && !sentenceId) {
            message.warning("Không tìm thấy ID câu hỏi để giải thích.");
            return;
        }

        try {
            setIsExplaining(true);
            let response: any;

            // 2. Gọi API tương ứng với từng loại bài tập
            if (type === 'dictation') {
                // Gọi API giải thích chính tả (như cũ)
                response = await chatbotService.explainDictation(sentenceId!, userText || "");
            } else if (type === 'grammar') {
                // --- TODO: Sau này bạn thêm hàm explainGrammar vào chatbotService thì mở comment này ra ---
                // response = await chatbotService.explainGrammar(userText || "");
                message.info("Tính năng giải thích ngữ pháp đang được phát triển.");
                setIsExplaining(false);
                return;
            } else {
                // Dành cho Vocab hoặc các loại khác
                message.info(`Tính năng giải thích cho ${type} đang cập nhật.`);
                setIsExplaining(false);
                return;
            }
            
            console.log(`>>> FULL RESPONSE (${type}):`, response); 

            // 3. Xử lý dữ liệu trả về (Logic chung cho các loại)
            // Lấy dữ liệu thật sự bên trong key 'data' hoặc fallback chính response
            const realData = response?.data || response; 

            if (realData && realData.assistantResponse) {
                addMessage({ role: 'assistant', content: realData.assistantResponse });
                setChatbotOpen(true); // Mở cửa sổ chat lên
            } else {
                console.error("Vẫn không tìm thấy assistantResponse. RealData đang là:", realData);
                message.warning("Dữ liệu từ AI trả về không đúng định dạng mong đợi.");
            }

        } catch (error) {
            console.error("Lỗi gọi API Chatbot:", error);
            message.error("Lỗi khi nhờ AI giải thích.");
        } finally {
            setIsExplaining(false);
        }
    };

    if (!result) {
        return (
            <Card className={styles.resultContainer}>
                <div className={styles.score}>
                    <Text>{t('dictation.yourScore')}: </Text>
                    <Tag>-- / 100</Tag>
                </div>
                <Paragraph className={styles.diffParagraph}>
                    {/* Placeholder khi chưa có kết quả */}
                </Paragraph>
            </Card>
        );
    }

    const score = typeof result.score === 'number' ? result.score : 0;
    const diffs = Array.isArray(result.diffs) ? result.diffs : [];
    const explanations = Array.isArray(result.explanations) ? result.explanations : [];

    const getDiffTag = (diffType: 'equal' | 'insert' | 'delete') => {
        if (diffType === 'insert') return styles.insert;
        if (diffType === 'delete') return styles.delete;
        return styles.equal;
    };

    return (
        <Card className={styles.resultContainer}>
            <div className={styles.score}>
                <Text>{t('dictation.yourScore')}: </Text>
                <Tag color={score > 80 ? 'green' : score > 50 ? 'orange' : 'red'}>
                    {score} / 100
                </Tag>
            </div>

            <Paragraph className={styles.diffParagraph}>
                {diffs.map((diff, index) => (
                    <span key={index} className={getDiffTag(diff.type)}>
                        {diff.text}
                    </span>
                ))}
            </Paragraph>

            {/* Phần giải thích tĩnh có sẵn (Rule-based engines trả về) */}
            {score < 100 && explanations.length > 0 && (
                <div className={styles.explanationSection}>
                    <Title level={5}><InfoCircleOutlined /> {t('dictation.explanations')}</Title>
                    <List
                        size="small"
                        dataSource={explanations}
                        renderItem={item => (
                            <List.Item>
                                <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} /> {item}
                            </List.Item>
                        )}
                    />
                </div>
            )}

            {/* --- NÚT BẤM GỌI AI --- */}
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}>
                <Button 
                    type="default"
                    icon={<QuestionCircleOutlined />} 
                    loading={isExplaining}
                    onClick={handleExplain}
                    style={{ 
                        borderColor: '#faad14', 
                        color: '#faad14', 
                        fontWeight: 600 
                    }}
                >
                    {/* Có thể đổi text dựa vào type nếu muốn, ví dụ: "Giải thích ngữ pháp" */}
                    Hỏi AI giải thích chi tiết
                </Button>
            </div>
        </Card>
    );
};

export default AnalysisResult;