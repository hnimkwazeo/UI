import type { IBackendRes } from "types/backend";
import type { IVocabulary } from "types/vocabulary.type";
import instance from "services/axios.customize";

export const searchDictionaryAPI = (word: string) => {
    const url_backend = `/api/v1/vocabularies?word=${word}`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}