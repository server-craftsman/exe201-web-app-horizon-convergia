import { BaseService } from '@app/api/base.service';
import { API_PATH } from '@consts/api.path.const';
import type { ApiResponse } from '@app/interface/apiResponse.interface';
import type { ChatHistoryQuery, ChatSendRequest } from '../../types/chat/Chat.req.type';
import type { ChatMessage, ChatHistoryResponse } from '../../types/chat/Chat.res.type';

export const ChatService = {
    send(payload: ChatSendRequest) {
        const form = new FormData();
        if (payload.senderId) form.append('senderId', payload.senderId);
        if (payload.receiverId) form.append('receiverId', payload.receiverId);
        if (payload.content) form.append('content', payload.content);
        if (payload.image) form.append('image', payload.image);
        return BaseService.post<ApiResponse<ChatMessage>>({
            url: API_PATH.CHAT.SEND,
            payload: form,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    history(query: ChatHistoryQuery) {
        return BaseService.get<ApiResponse<ChatHistoryResponse>>({
            url: API_PATH.CHAT.HISTORY,
            payload: query as any,
        });
    }
};
