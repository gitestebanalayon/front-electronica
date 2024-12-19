import axios from "axios";
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = sessionStorage.getItem('token');

export const useAccountStore = defineStore('account', {
    state: () => ({
        isAuthenticated: !!token,
        loadingVerify: false,
        loadingButton: false,
        loadingRestore: false,
        isVerify: false,

        message: null,
        messageVisible: false,

        messageSuccessRestoreModal: false,
        messageSuccessModal: false,
        messageSuccessGmailModal: false,
        messageErrorModal: false,

        activeTimer: false,

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


        async filterUser(email, ci, birthdate) {
            try {
                // Mostrar la animación de carga
                this.loadingVerify = true;

                const response = await axios.get(`${BASE_URL}api/v1/auth/filter?email=${email}&ci=${ci}&birthdate=${birthdate}`);

                if (response.data.statusCode === 200) {
                    this.isVerify = true;
                    this.messageErrorModal = false;

                    // Mostrar mensaje de verificado
                    this.message = response.data.message;
                    this.messageSuccessModal = true;


                    // Reiniciar el temporizador si ya existe
                    if (this.cooldownTimer) {
                        clearTimeout(this.cooldownTimer);
                    }

                    // Activar el enfriamiento (cooldown)
                    this.isCooldown = true;

                    // Establecer un nuevo temporizador de 5 segundos
                    this.cooldownTimer = setTimeout(() => {
                        this.isCooldown = false;
                        this.messageSuccessModal = false;
                        this.cooldownTimer = null; // Limpia la referencia
                    }, 5000); // 5 segundos



                    return response.data;
                } else {
                    this.loadingVerify = false;
                    return false;
                }

            } catch (error) {
                this.loadingVerify = false;

                // Mostrar mensaje de error
                this.message = error.response.data.message;
                this.messageErrorModal = true;

                // Reiniciar el temporizador si ya existe
                if (this.cooldownTimer) {
                    clearTimeout(this.cooldownTimer);
                }

                // Activar el enfriamiento (cooldown)
                this.isCooldown = true;

                // Establecer un nuevo temporizador de 5 segundos
                this.cooldownTimer = setTimeout(() => {
                    this.isCooldown = false;
                    this.messageErrorModal = false;
                    this.cooldownTimer = null; // Limpia la referencia
                }, 5000); // 5 segundos

                return error.response?.data;
            } finally {
                this.loadingVerify = false;
            }
        },

        async sendCode(email, ci, birthdate) {
            try {
                this.messageErrorModal = false;
                this.messageSuccessModal = false;
                this.loadingButton = true;

                const response = await axios.put(`${BASE_URL}api/v1/auth/account/code`, { email, ci, birthdate });


                if (response.data.statusCode === 200) {
                    this.messageErrorModal = false;
                    this.activeTimer = true;

                    // Activar el enfriamiento (espera de 60 segundos)
                    this.isCooldown = true;
                    this.cooldownTime = 10; // Resetear los segundos de espera
                    this.message = `Código enviado exitosamente`;
                    this.messageSuccessGmailModal = true;

                    // Iniciar un temporizador para actualizar los segundos restantes en tiempo real
                    this.intervalId = setInterval(() => {
                        if (this.cooldownTime > 0) {
                            this.cooldownTime--;
                        }
                    }, 1000); // Actualiza cada segundo

                    // Iniciar un temporizador para restablecer el estado de cooldown después de 60 segundos
                    setTimeout(() => {
                        this.isCooldown = false;
                        clearInterval(this.intervalId); // Detener el intervalo
                        this.messageSuccessGmailModal = false;
                        this.activeTimer = false;
                    }, 10000); // 1 minuto (60,000 ms)

                    return response.data;
                }
            } catch (error) {
                this.loadingButton = false;

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
            } finally {
                this.loadingButton = false;
            }
        },

        async restorePassword(email, ci, birthdate, recovery_code) {
            this.messageSuccessGmailModal = false;

            try {
                this.loadingRestore = true;
                const response = await axios.put(`${BASE_URL}api/v1/auth/account/restore-password`, { email, ci, birthdate, recovery_code });

                if (response.data.statusCode === 200) {
                    this.messageErrorModal = false;
                    this.loadingRestore = false;

                    this.message = response.data.message;
                    this.messageSuccessRestoreModal = true;

                    return response.data
                }
            } catch (error) {

                if (error.response.data.statusCode === 400) {
                    this.messageSuccessModal = false;
                    this.messageErrorModal = true;
                    this.message = 'Cógido inválido';
                }

                if (error.response.data.statusCode === 401) {
                    this.messageSuccessModal = false;
                    this.messageErrorModal = true;
                    this.message = 'Cógido inválido';
                }

                this.loadingRestore = false;

                // Reiniciar el temporizador si ya existe
                if (this.cooldownTimer) {
                    clearTimeout(this.cooldownTimer);
                }

                // Activar el enfriamiento (cooldown)
                this.isCooldown = true;

                // Establecer un nuevo temporizador de 5 segundos
                this.cooldownTimer = setTimeout(() => {
                    this.isCooldown = false;
                    this.messageSuccessModal = false;
                    this.messageErrorModal = false;
                    this.cooldownTimer = null; // Limpia la referencia
                }, 5000); // 5 segundos


                if (error.status === 500) {
                    this.messageSuccessModal = false;
                    this.messageErrorModal = true;
                    this.message = error.response.data.message;
                }

                return error.response.data
            } finally {
                this.loadingRestore = false;
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
