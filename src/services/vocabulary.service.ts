import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateVocabulary, IUpdateVocabulary, IVocabulary } from "types/vocabulary.type";
import instance from "services/axios.customize";
import axios from "axios";

export const fetchVocabulariesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/vocabularies?${query}`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}

export const createVocabularyAPI = (data: ICreateVocabulary) => {
    const url_backend = `/api/v1/admin/vocabularies`;
    return instance.post<IResponse<IVocabulary>>(url_backend, data);
}

export const updateVocabularyAPI = (data: IUpdateVocabulary) => {
    const url_backend = `/api/v1/admin/vocabularies/${data.id}`;
    return instance.put<IResponse<IVocabulary>>(url_backend, data);
}

export const deleteVocabularyAPI = (id: number) => {
    const url_backend = `/api/v1/admin/vocabularies/${id}`;
    return instance.delete<any>(url_backend);
}

export const bulkCreateVocabularyAPI = (data: ICreateVocabulary[]) => {
    const url_backend = `/api/v1/admin/vocabularies/bulk`;
    return instance.post<IResponse<IVocabulary[]>>(url_backend, data);
}


export const fetchVocabulariesClientAPI = (query: string) => {
    const url_backend = `/api/v1/vocabularies?size=100&${query}`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}

export const fetchVocabularyDetailClientAPI = (id: number) => {
    const url_backend = `/api/v1/vocabularies/${id}`;
    return instance.get<IResponse<IVocabulary>>(url_backend);
}

const DATAMUSE_API_URL = 'https://api.datamuse.com/words';

export const fetchSynonymsAPI = async (word: string): Promise<{ word: string; score: number }[]> => {
    try {
        const response = await axios.get(`${DATAMUSE_API_URL}?rel_syn=${word}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching synonyms:", error);
        return [];
    }
};

export const fetchRelatedWordsAPI = async (word: string): Promise<{ word: string; score: number }[]> => {
    try {
        const response = await axios.get(`${DATAMUSE_API_URL}?rel_trg=${word}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching related words:", error);
        return [];
    }
};