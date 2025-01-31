import { api } from '@/services/interceptor'

class MessageService {
    public async getMessages(matchId: string): Promise<any> {
        return api.fetchRequest(`/api/messages/${matchId}`, 'GET', null, true)
    }
}

export default new MessageService()