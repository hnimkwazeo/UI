import instance from "services/axios.customize";
import type { ICreateUser, IUpdatePasswordUser, IUpdateUser, IUser } from "types/user.type";
import type { IBackendRes, IResponse } from "types/backend";

export const fetchUsersAPI = (query: string) => {
    const url_backend = `/api/v1/admin/users?${query}`;
    return instance.get<IBackendRes<IUser[]>>(url_backend);
}

export const createUserAPI = (data: ICreateUser) => {
    const url_backend = '/api/v1/admin/users';
    return instance.post<IBackendRes<IUser>>(url_backend, data);
}

export const updateUserAPI = (data: IUpdateUser) => {
    const url_backend = `/api/v1/admin/users/${data.id}`;
    return instance.put<IBackendRes<IUser>>(url_backend, data);
}

export const deleteUserAPI = (id: number) => {
    const url_backend = `/api/v1/admin/users/${id}`;
    return instance.delete(url_backend);
}

export const bulkCreateUsersAPI = (data: ICreateUser[]) => {
    const url_backend = `/api/v1/admin/users/bulk`;
    return instance.post<IBackendRes<IUser[]>>(url_backend, data);
}

export const updatePasswordAPI = (data: IUpdatePasswordUser) => {
    const url_backend = `/api/v1/users/me/password`;
    return instance.put<IResponse<any>>(url_backend, data);
}