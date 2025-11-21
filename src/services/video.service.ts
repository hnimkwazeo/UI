import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateVideo, IUpdateVideo, IVideo } from "types/video.type";
import instance from "services/axios.customize";

export const fetchVideosAPI = (query: string) => {
    const url_backend = `/api/v1/admin/videos?${query}`;
    return instance.get<IBackendRes<IVideo[]>>(url_backend);
}

export const createVideoAPI = (data: ICreateVideo) => {
    const url_backend = `/api/v1/admin/videos`;
    return instance.post<IResponse<IVideo>>(url_backend, data);
}

export const updateVideoAPI = (data: IUpdateVideo) => {
    const url_backend = `/api/v1/admin/videos/${data.id}`;
    return instance.put<IResponse<IVideo>>(url_backend, data);
}

export const deleteVideoAPI = (id: number) => {
    const url_backend = `/api/v1/admin/videos/${id}`;
    return instance.delete<any>(url_backend);
}

export const fetchVideosClientAPI = (query: string) => {
    const url_backend = `/api/v1/videos?size=100&${query}`;
    return instance.get<IBackendRes<IVideo[]>>(url_backend);
}

export const fetchVideoDetailClientAPI = (id: number) => {
    const url_backend = `/api/v1/videos/${id}`;
    return instance.get<IResponse<IVideo>>(url_backend);
}