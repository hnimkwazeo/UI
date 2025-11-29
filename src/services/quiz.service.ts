import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateQuiz, IGeneratedQuiz, IQuiz, IQuizAttemptResult, IQuizAttemptStart, ISubmitPayload, IQuestion } from "types/quiz.type";
import instance from "services/axios.customize";

export const fetchQuizzesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/quizzes?${query}`;
    return instance.get<IBackendRes<IQuiz[]>>(url_backend);
}

export const generateQuizAPI = (categoryId: number) => {
    const url_backend = `/api/v1/admin/quizzes/generate-from-category?categoryId=${categoryId}`;
    return instance.post<IBackendRes<IQuiz>>(url_backend);
}

export const deleteQuizAPI = (id: number) => {
    const url_backend = `/api/v1/admin/quizzes/${id}`;
    return instance.delete(url_backend);
}

export const createQuizAPI = (data: ICreateQuiz) => {
    const url_backend = `/api/v1/admin/quizzes`;
    return instance.post<IResponse<IQuiz>>(url_backend, data);
}

export const fetchQuizzesClientAPI = (categoryId: number) => {
    const url_backend = `/api/v1/quizzes?size=100&categoryId=${categoryId}`;
    return instance.get<IBackendRes<IQuiz[]>>(url_backend);
}

export const generateReviewQuizAPI = () => {
    const url_backend = `/api/v1/vocabularies/review/generate-quiz`;
    return instance.post<IResponse<IGeneratedQuiz>>(url_backend);
}

export const startQuizAttemptAPI = (quizId: number) => {
    const url_backend = `/api/v1/quizzes/${quizId}/start`;
    return instance.post<IResponse<IQuizAttemptStart>>(url_backend);
}

export const submitQuizAPI = (payload: ISubmitPayload) => {
    const url_backend = `/api/v1/quizzes/submit`;
    return instance.post<IResponse<{ message: string }>>(url_backend, payload);
}

export const getQuizAttemptResultAPI = (attemptId: number) => {
    const url_backend = `/api/v1/quizzes/attempts/${attemptId}`;
    return instance.get<IResponse<IQuizAttemptResult>>(url_backend);
}


export const updateQuizAPI = (id: number, data: { title: string; description?: string }) => {
    const url_backend = `/api/v1/admin/quizzes/${id}`;
    return instance.patch<IResponse<IQuiz>>(url_backend, data);
}

export const createQuestionAPI = (data: any) => {
    const url_backend = `/api/v1/admin/questions`;
    return instance.post<IResponse<IQuestion>>(url_backend, data);
}

export const updateQuestionAPI = (questionId: number, data: any) => {
    const url_backend = `/api/v1/admin/questions/${questionId}`;
    return instance.patch<IResponse<IQuestion>>(url_backend, data);
}

export const deleteQuestionAPI = (questionId: number) => {
    const url_backend = `/api/v1/admin/questions/${questionId}`;
    return instance.delete<IBackendRes<any>>(url_backend);
}