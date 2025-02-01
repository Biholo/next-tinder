import { api } from '@/services/interceptor';
import { ApiResponse, Match } from '@/models';

class MatcheService {
    public async getMatches(): Promise<ApiResponse<Match[]>> {
        return api.fetchRequest('/api/matches', 'GET', null, true);
    }
}

export default new MatcheService();