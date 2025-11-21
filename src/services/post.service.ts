import type { IBackendRes, IResponse } from "types/backend";
import type { ICreatePost, IPost } from "types/post.type";
import instance from "services/axios.customize";

export const fetchPostsAPI = (page: number = 1, size: number = 10) => {
    const url_backend = `/api/v1/posts?page=${page}&size=${size}&sort=createdAt,desc`;
    return instance.get<IBackendRes<IPost[]>>(url_backend);
}

export const fetchMyPostsAPI = (page: number = 1, size: number = 10) => {
    const url_backend = `/api/v1/posts/me?page=${page}&size=${size}&sort=createdAt,desc`;
    return instance.get<IBackendRes<IPost[]>>(url_backend);
}

export const fetchPostDetailAPI = (id: number) => {
    const url_backend = `/api/v1/posts/${id}`;
    return instance.get<IResponse<IPost>>(url_backend);
}

export const createPostAPI = (data: ICreatePost) => {
    const url_backend = `/api/v1/posts`;
    return instance.post<IResponse<IPost>>(url_backend, data);
}

export const deletePostAPI = (postId: number) => {
    const url_backend = `/api/v1/posts/${postId}`;
    return instance.delete<IResponse<any>>(url_backend);
}

export const likePostAPI = (postId: number) => {
    const url_backend = `/api/v1/posts/${postId}/like`;
    return instance.post<IResponse<any>>(url_backend);
}

export const unlikePostAPI = (postId: number) => {
    const url_backend = `/api/v1/posts/${postId}/like`;
    return instance.delete<IResponse<any>>(url_backend);
}