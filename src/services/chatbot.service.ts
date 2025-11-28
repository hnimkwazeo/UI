import axios from "./axios.customize";


export interface ExplainRequest {
    questionContent: string;
    userAnswer: string | null;
    correctAnswer: string;
    explanation: string;
    type: "QUIZ" | "VOCABULARY" | "GRAMMAR";
}

export const chatbotService = {
    /**
     * API cũ dành cho phần Dictation (Giữ lại để tương thích ngược)
     * URL: /api/v1/chatbot/explain-dictation
     */
    explainDictation: async (sentenceId: number, userText: string) => {
        return await axios.post('/api/v1/chatbot/explain-dictation', { sentenceId, userText });
    },

    /**
     * API mới đa năng dành cho Quiz, Grammar, Vocab
     * URL: /api/v1/chatbot/explain
     */
    requestExplanation: async (data: ExplainRequest) => {
        return await axios.post<any>("/api/v1/chatbot/explain", data);
    }
};
export const requestExplanation = chatbotService.requestExplanation;