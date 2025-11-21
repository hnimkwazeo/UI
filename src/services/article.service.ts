import type { IArticle, ICreateArticle, IUpdateArticle } from "types/article.type";
import type { IBackendRes, IResponse } from "types/backend";
import instance from "services/axios.customize";

export const fetchArticlesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/articles?${query}`;
    return instance.get<IBackendRes<IArticle[]>>(url_backend);
}

export const createArticleAPI = (data: ICreateArticle) => {
    const url_backend = `/api/v1/admin/articles`;
    return instance.post<IResponse<IArticle>>(url_backend, data);
}

export const updateArticleAPI = (data: IUpdateArticle) => {
    const url_backend = `/api/v1/admin/articles/${data.id}`;
    return instance.put<IBackendRes<IArticle>>(url_backend, data);
}

export const deleteArticleAPI = (id: number) => {
    const url_backend = `/api/v1/admin/articles/${id}`;
    return instance.delete<any>(url_backend);
}

export const fetchArticlesClientAPI = (query: string) => {
    const url_backend = `/api/v1/articles?size=100&${query}`;
    return instance.get<IBackendRes<IArticle[]>>(url_backend);
}

export const fetchArticleDetailClientAPI = (id: number) => {
    const url_backend = `/api/v1/articles/${id}`;
    return instance.get<IResponse<IArticle>>(url_backend);
}