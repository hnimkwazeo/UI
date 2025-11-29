import axios from "./axios.customize";


export interface ExplainRequest {
    questionContent: string;
    userAnswer: string | null;
    correctAnswer: string;
    explanation: string;
    type: "QUIZ" | "VOCABULARY" | "GRAMMAR";
}

export const chatbotService = {
    explainDictation: async (sentenceId: number, userText: string) => {
        return await axios.post('/api/v1/chatbot/explain-dictation', { sentenceId, userText });
    },

    requestExplanation: async (data: ExplainRequest) => {
        return await axios.post<any>("/api/v1/chatbot/explain", data);
    }
};
export const requestExplanation = chatbotService.requestExplanation;