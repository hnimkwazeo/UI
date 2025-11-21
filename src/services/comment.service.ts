import type { IBackendRes, IResponse } from "types/backend";
import type { IComment, ICreateComment } from "types/comment.type";
import instance from "services/axios.customize";


export const fetchCommentsByPostIdAPI = (postId: number) => {
    const url_backend = `/api/v1/comments/post/${postId}?size=1000`;
    return instance.get<IBackendRes<IComment[]>>(url_backend);
}

export const createCommentAPI = (data: ICreateComment) => {
    const url_backend = `/api/v1/comments`;
    return instance.post<IResponse<IComment>>(url_backend, data);
}

export const deleteCommentAPI = (commentId: number) => {
    const url_backend = `/api/v1/comments/${commentId}`;
    return instance.delete<IResponse<any>>(url_backend);
}