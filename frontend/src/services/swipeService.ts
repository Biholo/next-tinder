import { api } from '@/services/interceptor'

interface Swipe {
    target_user_id: string;
    type: 'LIKE' | 'DISLIKE'
}

class SwipeService {
    public async swipe(swipe: Swipe): Promise<any> {
        return api.fetchRequest(`/api/swipes`, 'POST', swipe, true)
    }
}

export default new SwipeService()