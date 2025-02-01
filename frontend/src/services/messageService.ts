import { api } from '@/services/interceptor'
import { ApiResponse, MatchResponse, Message } from '@/models';

class MessageService {
    public async getMessages(matchId: string): Promise<ApiResponse<MatchResponse>> {
        return api.fetchRequest(`/api/messages/${matchId}`, 'GET', null, true);
    }

    public async sendMessage(matchId: string, content: string): Promise<ApiResponse<Message>> {
        return api.fetchRequest(`/api/messages`, 'POST', {
            match_id: matchId,
            content
        }, true);
    }
}

export default new MessageService();