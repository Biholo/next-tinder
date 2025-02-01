import Cookies from 'js-cookie';
import { api } from '@/services/interceptor';
import { 
    ApiResponse, 
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    RefreshTokenRequest,
    User
} from '@/models';

class AuthService {
    public async registerUser(user: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await api.fetchRequest('/api/auth/register', 'POST', user);
        if (response.data.access_token) {
            Cookies.set('accessToken', response.data.access_token, { expires: 1 });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: 7 });
        }
        return response;
    }

    public async loginUser(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await api.fetchRequest('/api/auth/login', 'POST', credentials);

        if (response.data.access_token) {
            Cookies.set('accessToken', response.data.access_token, { expires: 1 });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: 7 });
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

export default new AuthService();