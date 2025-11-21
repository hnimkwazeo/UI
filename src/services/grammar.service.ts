import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateGrammar, IGrammar, IUpdateGrammar } from "types/grammar.type";
import instance from "services/axios.customize";

export const fetchGrammarsAPI = (query: string) => {
    const url_backend = `/api/v1/admin/grammars?${query}`;
    return instance.get<IBackendRes<IGrammar[]>>(url_backend);
}

export const createGrammarAPI = (data: ICreateGrammar) => {
    const url_backend = `/api/v1/admin/grammars`;
    return instance.post<IResponse<IGrammar>>(url_backend, data);
}

export const updateGrammarAPI = (data: IUpdateGrammar) => {
    const url_backend = `/api/v1/admin/grammars/${data.id}`;
    return instance.put<IResponse<IGrammar>>(url_backend, data);
}

export const deleteGrammarAPI = (id: number) => {
    const url_backend = `/api/v1/admin/grammars/${id}`;
    return instance.delete<any>(url_backend);
}

export const fetchGrammarsClientAPI = (query: string) => {
    const url_backend = `/api/v1/grammars?size=100&${query}`;
    return instance.get<IBackendRes<IGrammar[]>>(url_backend);
}

export const fetchGrammarDetailClientAPI = (id: number) => {
    const url_backend = `/api/v1/grammars/${id}`;
    return instance.get<IResponse<IGrammar>>(url_backend);
}