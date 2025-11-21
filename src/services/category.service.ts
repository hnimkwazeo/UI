import type { IBackendRes, IResponse } from "types/backend";
import type { ICategory, ICreateCategory, IUpdateCategory } from "types/category.type";
import instance from "services/axios.customize";

export const fetchCategoriesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/categories/tree?size=100&${query}`;
    return instance.get<IBackendRes<ICategory[]>>(url_backend);
}

export const createCategoryAPI = (data: ICreateCategory) => {
    const url_backend = `/api/v1/admin/categories`;
    return instance.post<IResponse<ICategory>>(url_backend, data);
}

export const updateCategoryAPI = (data: IUpdateCategory) => {
    const url_backend = `/api/v1/admin/categories/${data.id}`;
    return instance.put<IResponse<ICategory>>(url_backend, data);
}

export const deleteCategoryAPI = (id: number) => {
    const url_backend = `/api/v1/admin/categories/${id}`;
    return instance.delete<IResponse<any>>(url_backend);
}

export const fetchCategoriesClientAPI = (query: string) => {
    const url_backend = `/api/v1/categories/tree?size=100&${query}`;
    return instance.get<IBackendRes<ICategory[]>>(url_backend);
}

export const fetchCategoryDetailClientAPI = (id: number) => {
    const url_backend = `/api/v1/categories/${id}`;
    return instance.get<IResponse<ICategory>>(url_backend);
}