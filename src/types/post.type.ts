import type { IAttachment, ICreateAttachment } from "types/attachment.type";
import type { IUser } from "types/user.type";

export interface IPost {
    id: number;
    caption: string;
    active: boolean;
    user: IUser;
    attachments: IAttachment[];
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string | null;
    likedByCurrentUser: boolean;
}

export interface ICreatePost {
    caption: string;
    attachments: ICreateAttachment[];
}

export interface ILikeUpdatePost {
    postId: number;
    totalLikes: number;
    isLikedByCurrentUser: boolean;
}