import axios from "./axios.customize";

export interface ExplainRequest {
    questionContent: string;
    userAnswer: string | null;
    correctAnswer: string;
    explanation: string;
    type: "QUIZ" | "VOCABULARY" | "GRAMMAR";
}

// Dùng 'any' để tránh lỗi type checker với AxiosResponse
export const requestExplanation = async (data: ExplainRequest) => {
    return await axios.post<any>("/api/v1/chatbot/explain", data);
};