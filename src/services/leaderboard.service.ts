import type { IBackendRes } from "types/backend";
import type { IUser } from "types/user.type";
import instance from "services/axios.customize";

export const fetchLeaderboardAPI = (query?: string) => {
    const url_backend = `/api/v1/leaderboard?${query}`;
    return instance.get<IBackendRes<IUser[]>>(url_backend);
}