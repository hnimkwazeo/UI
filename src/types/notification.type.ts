export interface INotification {
    id: number;
    actorId: number | null;
    type: string;
    message: string;
    link: string;
    createdAt: string;
    read: boolean;
}
