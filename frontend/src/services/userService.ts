import { api } from "@/services/interceptor"

class UserService {
    public async getUsersToSwipe(): Promise<any> {
        return api.fetchRequest('/api/users', 'GET', null, true)
    }

    public async updateUser(user: any): Promise<any> {
        return api.fetchRequest('/api/users/me', 'PATCH', user, true)
    }

    public async addUserPhotos(photos: any): Promise<any> {
        return api.fetchRequest('/api/users/photos', 'POST', photos, true)
    }
}

export default new UserService()
