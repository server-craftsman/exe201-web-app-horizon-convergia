export interface ChatMessage {
    id?: string;
    senderId: string;
    receiverId: string;
    content?: string;
    imageUrl?: string;
    createdAt?: string;
}

export interface ChatHistoryResponse {
    items: ChatMessage[];
    limit?: number;
}
