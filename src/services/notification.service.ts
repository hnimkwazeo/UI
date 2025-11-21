import type { IBackendRes, IResponse } from "types/backend";
import type { INotification } from "types/notification.type";
import instance from "services/axios.customize";

export const fetchNotificationsAPI = () => {
    const url_backend = `/api/v1/notifications?size=100`;
    return instance.get<IBackendRes<INotification[]>>(url_backend);
}

export const fetchUnreadCountAPI = () => {
    const url_backend = `/api/v1/notifications/unread-count`;
    return instance.get<IResponse<{ unreadCount: number }>>(url_backend);
}

export const markNotificationAsReadAPI = (id: number) => {
    const url_backend = `/api/v1/notifications/${id}/read`;
    return instance.post<IResponse<any>>(url_backend);
}