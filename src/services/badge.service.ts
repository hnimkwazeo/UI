import type { IBackendRes } from "types/backend";
import type { IBadge, ICreateBadge, IUpdateBadge } from "types/badge.type";
import instance from "services/axios.customize";

export const fetchBadgesAPI = (query: string) => {
    return instance.get<IBackendRes<IBadge[]>>(`/api/v1/admin/badges?${query}`);
}

export const createBadgeAPI = (data: ICreateBadge) => {
    const url_backend = '/api/v1/admin/badges';
    return instance.post<IBackendRes<IBadge>>(url_backend, data);
}

export const updateBadgeAPI = (data: IUpdateBadge) => {
    const url_backend = `/api/v1/admin/badges/${data.id}`;
    return instance.put<IBackendRes<IBadge>>(url_backend, data);
}

export const deleteBadgeAPI = (id: number) => {
    return instance.delete<any>(`/api/v1/admin/badges/${id}`);
}

export const fetchBadgesClientAPI = (query: string) => {
    return instance.get<IBackendRes<IBadge[]>>(`/api/v1/badges?${query}`);
}