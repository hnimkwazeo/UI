import type { IBackendRes, IResponse } from "types/backend";
import type { ISubscription } from "types/subscription.type";
import instance from "services/axios.customize";
import type { IRevenueStats } from "types/statistic.type";

export const fetchAllSubscriptionAPI = (query: string) => {
    const url_backend = `/api/v1/admin/subscriptions?${query}`;
    return instance.get<IBackendRes<ISubscription[]>>(url_backend);
}

export const fetchRevenueStatsAPI = (query: string) => {
    const url = `/api/v1/admin/statistics/revenue?${query}`;
    return instance.get<IResponse<IRevenueStats>>(url);
}

export const createSubscriptionAPI = (data: { planId: number }) => {
    const url_backend = '/api/v1/subscriptions';
    return instance.post<IResponse<ISubscription>>(url_backend, data);
}

