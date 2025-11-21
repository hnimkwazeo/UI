import type { IBackendRes, IResponse } from "types/backend";
import type { IDictationTopic, ICreateDictationTopic, IUpdateDictationTopic, INlpAnalysis, ISubmissionPayload } from "types/dictation.type";
import instance from "services/axios.customize";

export const fetchDictationsAPI = (query: string) => {
    const url_backend = `/api/v1/admin/dictations?${query}`;
    return instance.get<IBackendRes<IDictationTopic[]>>(url_backend);
}

export const createDictationAPI = (data: ICreateDictationTopic) => {
    const url_backend = '/api/v1/admin/dictations';
    return instance.post<IResponse<IDictationTopic>>(url_backend, data);
}

export const updateDictationAPI = (data: IUpdateDictationTopic) => {
    const url_backend = `/api/v1/admin/dictations/${data.id}`;
    return instance.put<IResponse<IDictationTopic>>(url_backend, data);
}

export const deleteDictationAPI = (id: number) => {
    const url_backend = `/api/v1/admin/dictations/${id}`;
    return instance.delete(url_backend);
}

export const fetchDictationsClientAPI = (query: string) => {
    const url_backend = `/api/v1/dictations?size=100&${query}`;
    return instance.get<IBackendRes<IDictationTopic[]>>(url_backend);
}

export const fetchDictationDetailClientAPI = (id: number) => {
    const url_backend = `/api/v1/dictations/${id}`;
    return instance.get<IResponse<IDictationTopic>>(url_backend);
}

export const submitDictationSentenceAPI = (data: ISubmissionPayload) => {
    const url_backend = '/api/v1/dictations/submit';
    return instance.post<IResponse<INlpAnalysis>>(url_backend, data);
}