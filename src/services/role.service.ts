import type { IBackendRes } from "types/backend";
import instance from "services/axios.customize";
import type { IRole, IUpdateRole } from "types/role.type";

export const fetchRolesAPI = () => {
    const url_backend = `/api/v1/admin/roles`;
    return instance.get<IBackendRes<IRole[]>>(url_backend);
}

export const updateRolePermissionsAPI = (data: IUpdateRole) => {
    const url_backend = `/api/v1/admin/roles/${data.id}`;
    return instance.put<IBackendRes<any>>(url_backend, data);
}
