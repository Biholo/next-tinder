import Cookies from 'js-cookie';

class BackendApi {
    private url: string;

    constructor() {
        this.url = import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8000';
    }

    public getUrl(): string {
        return this.url;
    }

    private createHeaders(includeAuth: boolean = false, isFormData: boolean = false): HeadersInit {
        const headers: HeadersInit = {};
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        if (includeAuth) {
            const token = Cookies.get('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }

    // Gestion des erreurs 401 et retry
    private async handleUnauthorizedRequest(response: Response, retryRequest: () => Promise<Response>): Promise<Response> {
        if (response.status === 401) {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                const newToken = await this.getNewAccessToken(refreshToken);
                
                if (newToken && newToken.token) {
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

        let response = await fetch(fullUrl, options);
        
        response = await this.handleUnauthorizedRequest(response, () => 
            this.fetchRequest(endpoint, method, body, includeAuth)
        );

        if (!response.ok) {
            throw new Error(`${method} request failed: ${response.statusText}`);
        }

        if(method === 'DELETE' && response.status === 204) {
            return { success: true };
        }

        return response.json();
    }

    // Récupération d'un nouveau token via le refresh token
    public async getNewAccessToken(refresh_token: string): Promise<any> {
        const response = await this.fetchRequest('/api/token/refresh', 'POST', { refresh_token });

        if (response.token) {
            Cookies.set('accessToken', response.token, { expires: 1 }); // expire dans 1 jour
        }

        if (response.refresh_token) {
            Cookies.set('refreshToken', response.refresh_token, { expires: 7 }); // expire dans 7 jours
        }

        return response || null;
    }
}

export const api = new BackendApi();