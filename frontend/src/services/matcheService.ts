import { api } from '@/services/interceptor'

class MatcheService {
    public async getMatches(): Promise<any> {
        return api.fetchRequest('/api/matches', 'GET', null, true)
    }
}

export default new MatcheService()