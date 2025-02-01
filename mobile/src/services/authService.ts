import { api } from '@/services/interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    id: string;
    pseudo: string;
    email: string;
    avatar?: string;
    role?: string;
    userType: string;
    externalId?: string;
    languageMovies?: string;
    password?: string;
    isPublic?: boolean;
}

export interface Login {
    email: string;
    password: string;
}

export interface UserCreation {
    email: string;
    pseudo: string;
    password: string;
    avatar?: string;
}


class AuthService {

    public async registerUser(user: UserCreation): Promise<any> {

        const response = await api.fetchRequest(`/api/auth/register`, 'POST', user);

        if (response.access_token) {
            await AsyncStorage.setItem('accessToken', response.access_token);
        }
        if (response.refresh_token) {
            await AsyncStorage.setItem('refreshToken', response.refresh_token);
        }

        return response;
    }

    public async loginUser(user: Login): Promise<any> {
        console.log('Tentative de connexion avec:', {
            ...user,
            password: user.password ? '[HIDDEN]' : undefined
        });
        
        const response = await api.fetchRequest(`/api/auth/login`, 'POST', {
            email: user.email,
            password: user.password
        });

        console.log('Réponse de connexion:', {
            ...response,
            access_token: response.access_token ? '[TOKEN]' : undefined,
            refresh_token: response.refresh_token ? '[TOKEN]' : undefined
        });

        if (response.access_token) {
            await AsyncStorage.setItem('accessToken', response.access_token);
        }
        if (response.refresh_token) {
            await AsyncStorage.setItem('refreshToken', response.refresh_token);
        }

        return response;
    }

    public async getUserByToken(accessToken: string): Promise<any | null> {
        if (!accessToken) {
            return null;
        }

        return api.fetchRequest(`/api/auth/me`, 'GET', null, true);
    }

    public async logout(refreshToken: string): Promise<any> {
        return api.fetchRequest(`/api/auth/logout`, 'POST', { token: refreshToken });
    }
}

export default AuthService;