import { api } from '@/services/interceptor';
import { ApiResponse, Swipe, SwipeResponse } from '@/models';

class SwipeService {
    public async swipe(swipe: Swipe): Promise<ApiResponse<SwipeResponse>> {
        return api.fetchRequest('/api/swipes', 'POST', swipe, true);
    }
}

export default new SwipeService();