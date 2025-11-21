import type { IBackendRes } from "types/backend";
import instance from "services/axios.customize";
import type { IPermission } from "types/permission.type";

export const fetchPermissionsAPI = (query: string) => {
    const url_backend = `/api/v1/admin/permissions?${query}`;
    return instance.get<IBackendRes<IPermission[]>>(url_backend);
}