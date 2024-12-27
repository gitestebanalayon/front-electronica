import axios from "axios";
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
//import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const user = JSON.parse(sessionStorage.getItem("user") || "{}");


export const useAccountStore = defineStore('account', {
    state: () => ({
        isAuthenticated: !!user.token,

        loading: null,
        apiName: null,
        status: 0,
        message: null,
        showMessage: false,

        isCooldown: false, // Estado para controlar el tiempo de espera

        timeoutId: null,
        cooldownTime: 60, // 60 segundos
        intervalId: null, // ID para el setInterval
        isButtonDisabled: false, // Nuevo estado para el botón

    }),
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post(`${BASE_URL}api/v1/auth/login`, { 'email': email, 'password': password });

                if (response.data.statusCode === 200) {

                    const token = response.data.data.token;
                    const decodedToken = jwt_decode(token);

                    // Guardamos todos los datos en un solo item
                    sessionStorage.setItem("user", JSON.stringify({
                        token,
                        email: decodedToken.email,
                        first_name: decodedToken.first_name,
                        last_name: decodedToken.last_name,
                    }));

                    this.isAuthenticated = true;

                    return response.data;
                }

            } catch (error) {
                if (error.response.data.statusCode) {
                    this.message = error.response.data.message;
                    this.showMessage = true;

                    // Reinicia el temporizador si existe
                    if (this.timeoutId) {
                        clearTimeout(this.timeoutId);
                    }

                    // Configura un nuevo temporizador
                    this.timeoutId = setTimeout(() => {
                        this.showMessage = false;
                    }, 5000);

                    return error.response.data;
                }
            }
        },

        async verifyToken() {
            try {
                const response = await axios.get(`${BASE_URL}api/v1/auth/account/validate-token`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (response.data.statusCode === 200) {
                    this.isAuthenticated = true;
                    return true;
                }

                sessionStorage.clear();
                this.isAuthenticated = false;
                return false;

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



        async alertMessage(message, status, second) {
            // Mostrar mensaje de verificado
            this.message = message;

            // Reiniciar el temporizador si ya existe
            if (this.cooldownTimer) {
                clearTimeout(this.cooldownTimer);
            }

            // Activar el enfriamiento (cooldown)
            this.isCooldown = true;

            // Establecer un nuevo temporizador de 5 segundos
            this.cooldownTimer = setTimeout(() => {
                this.isCooldown = false;
                this.cooldownTimer = null; // Limpia la referencia
                this.message = null;
                this.apiName = null;
            }, second); // 5 segundos

            if (status === 200) {
                return true;
            }

            if (status === 409) {
                return false;
            }
        },

        async verifyAccount(email, ci, birthdate) {
            try {
                this.loading = 'verifyAccount';

                const simulateDelay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const response = await axios.get(`${BASE_URL}api/v1/auth/filter?email=${email}&ci=${Number(ci)}&birthdate=${birthdate}`);
                await simulateDelay(2000);

                if (response.data.statusCode === 200) {
                    this.status = 200;
                    return this.alertMessage(response.data.message, response.data.statusCode, 5000);
                }

                return false
            } catch (error) {
                this.loading = null;

                if (error.response.data.statusCode === 409) {
                    this.status = 409;
                    return this.alertMessage(error.response.data.message, error.response.data.statusCode, 5000);
                }

                return false;
            } finally {
                this.loading = null;
            }

        },

        async restorePassword(email, ci, birthdate, recovery_code) {
            try {
                this.loading = 'restorePassword';

                const simulateDelay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const response = await axios.put(`${BASE_URL}api/v1/auth/account/restore-password`, { email, ci, birthdate, recovery_code });
                await simulateDelay(2000);

                if (response.data.statusCode === 200) {
                    this.status === 200;
                    return this.alertMessage(response.data.message, response.data.statusCode, 5000);
                }

                this.loading = false;
                return false
            } catch (error) {
                this.loading = null;

                console.log(error.response.data);

                if (error.response.data.statusCode === 409) {
                    this.status = 409;
                    return this.alertMessage(error.response.data.message, error.response.data.statusCode, 5000);
                }

                if (error.response.data.statusCode === 401) {
                    this.status = 401;
                    return this.alertMessage(error.response.data.message, error.response.data.statusCode, 5000);
                }

                return false;

            } finally {
                this.loading = null;
            }
        },

        async startCooldown() {
            this.cooldownTime = 60; // Reinicia el temporizador
            this.intervalId = setInterval(() => {
                if (this.cooldownTime > 0) {
                    this.cooldownTime--;
                } else {
                    clearInterval(this.intervalId);
                    this.isButtonDisabled = false; // Reactiva el botón
                }
            }, 1000);
        },

        async sendCode(email, ci, birthdate) {
            try {
                this.loading = 'sendCode';
                // Desactiva el botón y comienza el temporizador
                this.isButtonDisabled = true;

                const simulateDelay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const response = await axios.put(`${BASE_URL}api/v1/auth/account/code`, { email, ci, birthdate });
                await simulateDelay(2000);

                if (response.data.statusCode === 200) {
                    this.status = 200;
                    this.startCooldown(); // Inicia el temporizador para reactivar el botón
                    return this.alertMessage(response.data.message, response.data.statusCode, 5000);
                }

                this.isButtonDisabled = false; // Reactiva el botón en caso de error
                this.loading = null;
                return false;
            } catch (error) {
                this.loading = null;

                this.isButtonDisabled = false; // Reactiva el botón en caso de error

                if (error.response.data.statusCode === 500) {
                    this.status = 500;
                    return this.alertMessage(error.response.data.message, error.response.data.statusCode, 5000);
                }

                console.log(error.response.data);


                return false;
            } finally {
                this.loading = null;
            }
        },


    },
    getters: {
        getIsAuthenticated: (state) => state.isAuthenticated,
    },
});

// Configura los interceptores de Axios para verificar el token automáticamente
axios.interceptors.request.use(
    (config) => {
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
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
