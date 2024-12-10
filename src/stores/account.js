import axios from "axios";
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = sessionStorage.getItem('token');

export const useAccountStore = defineStore('account', {
    state: () => ({
        isAuthenticated: !!token,

        message: null,
        messageVisible: false,
        messageVisibleModal: false,
        messageErrorModal: false,
        timeoutId: null,
        isCooldown: false, // Estado para controlar el tiempo de espera
        cooldownTime: 60, // 60 segundos
        intervalId: null, // ID para el setInterval
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post(`${BASE_URL}api/v1/auth/login`, { 'email': email, 'password': password });

                if (response.data.statusCode === 200) {

                    sessionStorage.setItem("token", response.data.data.token); // Guardamos el token
                    const token = sessionStorage.getItem('token'); // Obtenemos el token
                    const decodedToken = jwt_decode(token); // Decodificamos el token

                    sessionStorage.setItem("email", decodedToken.email); // Guardamos el email
                    sessionStorage.setItem("first_name", decodedToken.first_name); // Guardamos el nombre
                    sessionStorage.setItem("last_name", decodedToken.last_name); // Guardamos el apellido

                    this.isAuthenticated = true;

                    return response.data;
                }

            } catch (error) {

                console.log("Error al loguearse");
                if (error.response.data.statusCode) {
                    this.message = error.response.data.message;
                    this.messageVisible = true;

                    // Reinicia el temporizador si existe
                    if (this.timeoutId) {
                        clearTimeout(this.timeoutId);
                    }

                    // Configura un nuevo temporizador
                    this.timeoutId = setTimeout(() => {
                        this.messageVisible = false;
                    }, 5000);

                    return error.response.data;


                }
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
                    sessionStorage.clear();
                    this.isAuthenticated = false;
                    return false;
                }

            } catch (error) {
                sessionStorage.clear();
                this.isAuthenticated = false;
                return false;
            }
        },

        async logout(router) {
            sessionStorage.clear();
            this.isAuthenticated = false;
            router.push('/')
        },

        async sendCode(email, ci, birthdate) {
            if (this.isCooldown) {
                this.message = 'Debe esperar 1 minuto antes de enviar otro código.';
                this.messageVisibleModal = true;
                return;
            }

            try {
                const response = await axios.put(`${BASE_URL}api/v1/auth/account/code`, { email, ci, birthdate });

                if (response.data.statusCode === 200) {
                    // Activar el enfriamiento (espera de 60 segundos)
                    this.isCooldown = true;
                    this.cooldownTime = 60; // Resetear los segundos de espera
                    this.message = `Código enviado exitosamente, ${this.cooldownTime} segundos para regenerar.`;
                    this.messageVisibleModal = true;

                    // Iniciar un temporizador para actualizar los segundos restantes en tiempo real
                    this.intervalId = setInterval(() => {
                        if (this.cooldownTime > 0) {
                            this.cooldownTime--;
                            this.message = `Código enviado exitosamente, ${this.cooldownTime} segundos para regenerar.`;
                        }
                    }, 1000); // Actualiza cada segundo

                    // Iniciar un temporizador para restablecer el estado de cooldown después de 60 segundos
                    setTimeout(() => {
                        this.isCooldown = false;
                        clearInterval(this.intervalId); // Detener el intervalo
                        this.messageVisibleModal = false;
                    }, 60000); // 1 minuto (60,000 ms)

                    return response.data;
                }
            } catch (error) {
                this.message = 'No se pudo enviar el código a su correo, por favor verifique su conexión';
                this.messageErrorModal = true;

                // Reinicia el temporizador si existe
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }

                // Configura un nuevo temporizador
                this.timeoutId = setTimeout(() => {
                    this.messageErrorModal = false;
                }, 5000);

                return error.response.data
            }
        },

        async restorePassword(email, ci, birthdate, recovery_code) {
            try {
                const response = await axios.put(`${BASE_URL}api/v1/auth/account/restore-password`, { email, ci, birthdate, recovery_code });

                if (response.data.statusCode === 200) {
                    return response.data
                }
            } catch (error) {
                return error.response.data
            }
        }

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
            sessionStorage.clear();

        }
        return Promise.reject(error);
    }
);
