import axios from "axios";
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
const router = useRouter();
import jwt_decode from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = sessionStorage.getItem('token');

export const useAccountStore = defineStore('account', {
    state: () => ({
        isAuthenticated: !!token,
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post(`${BASE_URL}api/v1/auth/login`, { email, password });

                if (response.data.statusCode === 200) {

                    sessionStorage.setItem("token", response.data.data.token); // Guardamos el token
                    const token = sessionStorage.getItem('token'); // Obtenemos el token
                    const decodedToken = jwt_decode(token); // Decodificamos el token

                    sessionStorage.setItem("email", decodedToken.email); // Guardamos el email
                    sessionStorage.setItem("first_name", decodedToken.first_name); // Guardamos el nombre
                    sessionStorage.setItem("last_name", decodedToken.last_name); // Guardamos el apellido

                    this.isAuthenticated = true;

                    return true;
                }

            } catch (error) {
                console.log("Error al loguearse:", error);
                return null;
            }
        },

        async verifyToken() {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/auth/account/validate-token`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.statusCode === 200) {
                    this.isAuthenticated = true;
                    return true;
                } else {
                    this.logout(router);
                    return false;
                }

            } catch (error) {
                this.logout(router);
                return false;
            }
        },

        async logout(router) {
            sessionStorage.clear();
            this.isAuthenticated = false;
            router.push('/');
        },
    },
    getters: {
        getIsAuthenticated: (state) => state.isAuthenticated,
    },
});

// Configura los interceptores de Axios para verificar el token automáticamente
axios.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Manejo de respuestas con error 401 (token expirado o no válido)
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Si la respuesta tiene un error 401, deslogueamos al usuario
        if (error.response && error.response.status === 401) {
            const accountStore = useAccountStore();
            await accountStore.logout();
            router.push('/');  // Redirige al login o a donde sea necesario
        }
        return Promise.reject(error);
    }
);
