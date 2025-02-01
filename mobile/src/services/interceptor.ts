import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '@/models/auth.types';

class BackendApi {
    private url: string;

    constructor() {
        this.url = process.env.VITE_API_BASE_URL as string || 'http://192.168.186.92:3000';
    }


    public getUrl(): string {
        return this.url;
    }

    private async createHeaders(includeAuth: boolean = false, isFormData: boolean = false): Promise<HeadersInit> {
        const headers: HeadersInit = {};
        

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        if (includeAuth) {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }

    // Gestion des erreurs 401 et retry
    private async handleUnauthorizedRequest(response: Response, retryRequest: () => Promise<Response>): Promise<Response> {
        if (response.status === 401) {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                const newToken = await this.getNewAccessToken(refreshToken);
                
                if (newToken && newToken.access_token) {
                    return retryRequest();
                }
            }
        }
        return response;
    }

    // Fonction générique pour gérer toutes les requêtes HTTP
    public async fetchRequest(
        endpoint: string, 
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
        body: any = null, 
        includeAuth: boolean = false
    ): Promise<any> {
        const isFormData = body instanceof FormData;
        const fullUrl = `${this.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        const options: RequestInit = {
            method,
            headers: this.createHeaders(includeAuth, isFormData),
        };

        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        try {
            // console.log('Request URL:', fullUrl);
            // console.log('Request options:', {
            //     ...options,
            //     headers: Object.fromEntries(Object.entries(options.headers || {}))
            // });
            // console.log('Request body:', body);

            console.log(options);
            
            let response = await fetch(fullUrl, options);
            
            // console.log('Response status:', response.status);
            // const responseData = await response.clone().json().catch(() => null);
            // console.log('Response data:', responseData);
            
            response = await this.handleUnauthorizedRequest(response, () => 
                this.fetchRequest(endpoint, method, body, includeAuth)
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Response error:', errorData);
                throw new Error(errorData.message || `${method} request failed: ${response.statusText}`);
            }

            if(method === 'DELETE' && response.status === 204) {
                return { success: true };
            }

            return response.json();
        } catch (error: any) {
            console.error('Request error:', error);
            throw new Error(error.message || 'Une erreur est survenue lors de la requête');
        }
    }

    // Récupération d'un nouveau token via le refresh token
    public async getNewAccessToken(refresh_token: string): Promise<AuthResponse | null> {
        const response = await this.fetchRequest('/api/auth/refresh', 'POST', { token: refresh_token });

        if (response.token) {
            AsyncStorage.setItem('accessToken', response.token);
        }


        if (response.refresh_token) {
            AsyncStorage.setItem('refreshToken', response.refresh_token);
        }


        return response || null;
    }
}

export const api = new BackendApi();