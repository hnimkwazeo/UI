import type { IBackendRes } from "types/backend";
import type { IVocabulary } from "types/vocabulary.type";
import instance from "services/axios.customize";

export const fetchRecentNotebookAPI = () => {
    const url_backend = `/api/v1/notebook/recent`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}

export const fetchNotebookByLevelAPI = (level: number) => {
    const url_backend = `/api/v1/notebook/level/${level}?size=100`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}

export const removeNotebookItemAPI = (id: number) => {
    const url_backend = `/api/v1/notebook/remove/${id}`;
    return instance.delete<any>(url_backend);
}

export const addVocabularyToNotebookAPI = (id: number) => {
    const url_backend = `/api/v1/notebook/add/${id}`;
    return instance.post<IBackendRes<any>>(url_backend);
}
