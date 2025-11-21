import type { IResponse } from "types/backend";
import type { IDashboardData } from "types/dashboard.type";
import instance from "services/axios.customize";

export const fetchDashboardAPI = () => {
    const url_backend = '/api/v1/admin/dashboard';
    return instance.get<IResponse<IDashboardData>>(url_backend);
}