import type { IResponse } from "types/backend";
import type { IUserDashboard } from "types/user-dashboard.type";
import instance from "services/axios.customize";

export const fetchUserDashboardAPI = () => {
    const url_backend = `/api/v1/users/me/dashboard`;
    return instance.get<IResponse<IUserDashboard>>(url_backend);
}