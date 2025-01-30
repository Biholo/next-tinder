import Cookies from 'js-cookie';
import api from './interceptor';

class AuthService {
    async login(email: string, password: string) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            Cookies.set('token', token, { expires: 7 });
            return response.data;
        } catch (error) {
            return { error: 'Une erreur est survenue' };
        }
    }

    async register(firstName: string, lastName: string, email: string, phone: string, password: string, dateOfBirth: string, gender: string, interestedIn: string ) {
        try {
            const response = await api.post('/auth/register', { firstName, lastName, email, phone, password, dateOfBirth, gender, interestedIn });
            const { token } = response.data;
            Cookies.set('token', token, { expires: 7 });
            return response.data;
        } catch (error) {
            return { error: 'Une erreur est survenue' };
        }
    }
}

export default AuthService;