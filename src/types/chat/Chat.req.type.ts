export interface ChatSendRequest {
    senderId: string;
    receiverId: string;
    content?: string;
    image?: File | Blob;
}

export interface ChatHistoryQuery {
    a?: string; // as per swagger
    b?: string; // as per swagger
    limit?: number; // default 200
}
