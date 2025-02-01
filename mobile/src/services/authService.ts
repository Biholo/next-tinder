import { api } from '@/services/interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    ApiResponse, 
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    RefreshTokenRequest,
    User
} from '@/models';

class AuthService {
    public async registerUser(user: RegisterCredentials): Promise<AuthResponse> {
        const response = await api.fetchRequest('/api/auth/register', 'POST', user);
        if (response.access_token) {
            await AsyncStorage.setItem('accessToken', response.access_token);
            await AsyncStorage.setItem('refreshToken', response.refresh_token);
        }
        return response;
    }

    public async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.fetchRequest('/api/auth/login', 'POST', credentials);
        console.log(response);
        if (response.access_token) {
            await AsyncStorage.setItem('accessToken', response.access_token);
            await AsyncStorage.setItem('refreshToken', response.refresh_token);
        }
        return response;
    }

    public async getUserByToken(accessToken: string): Promise<ApiResponse<User> | null> {
        if (!accessToken) {
            return null;
        }
        return api.fetchRequest('/api/auth/me', 'GET', null, true);
    }

    public async logout(refreshToken: string): Promise<ApiResponse<void>> {
        const request: RefreshTokenRequest = { token: refreshToken };
        return api.fetchRequest('/api/auth/logout', 'POST', request);
    }
}

export const authService = new AuthService();