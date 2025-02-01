import { api } from "@/services/interceptor";
import { ApiResponse, User } from "@/models";

class UserService {
    public async getUsersToSwipe(): Promise<ApiResponse<User[]>> {
        return api.fetchRequest('/api/users', 'GET', null, true);
    }

    public async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
        return api.fetchRequest('/api/users/me', 'PATCH', userData, true);
    }

    public async addUserPhotos(photos: FormData): Promise<ApiResponse<User>> {
        return api.fetchRequest('/api/users/photos', 'POST', photos, true);
    }
}

export default new UserService();