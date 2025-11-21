import type { IBackendRes } from "types/backend";
import type { ICreatePlan, IPlan, IUpdatePlan } from "types/plan.type";
import instance from "services/axios.customize";

export const fetchPlansAPI = (query: string) => {
    const url_backend = `/api/v1/admin/plans?${query}`;
    return instance.get<IBackendRes<IPlan[]>>(url_backend);
}

export const createPlanAPI = (data: ICreatePlan) => {
    const url_backend = '/api/v1/admin/plans';
    return instance.post<IBackendRes<IPlan>>(url_backend, data);
}

export const updatePlanAPI = (data: IUpdatePlan) => {
    const url_backend = `/api/v1/admin/plans/${data.id}`;
    return instance.put<IBackendRes<IPlan>>(url_backend, data);
}

export const deletePlanAPI = (id: number) => {
    const url_backend = `/api/v1/admin/plans/${id}`;
    return instance.delete<any>(url_backend);
}

export const fetchPlansClientAPI = (query: string) => {
    const url_backend = `/api/v1/plans?${query}`;
    return instance.get<IBackendRes<IPlan[]>>(url_backend);
}