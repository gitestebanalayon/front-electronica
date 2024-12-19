<script setup>
import { ref, onMounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useAccountStore } from '@/stores/account';
const storeAccount = useAccountStore()

const schema = ref(
    yup.object().shape({
        email: yup
            .string()
            .email('Debe ser un correo válido')
            .required('El correo es obligatorio'),
        ci: yup
            .number()
            .typeError('La cédula debe ser tipo numérico')
            .required('La cédula es obligatoria')
            .test(
                'len',
                'La cédula debe tener entre 6 y 8 dígitos',
                value => String(value).length >= 6 && String(value).length <= 8
            ),
        birthdate: yup
            .string()
            .required('La fecha de nacimiento es obligatoria'),
        recovery_code: yup
            .string()
            .min(5, 'El código de recuperación debe tener al menos 5 caracteres')
            .max(5, 'El código de recuperación no puede exceder los 5 caracteres')
            .required('El código de recuperación es obligatorio'),
    })
);


const email = ref('estebanalayon7@gmail.com');
const ci = ref(27498161);
const birthdate = ref('2000-08-25');
const recovery_code = ref(null);

async function verifyAccount(error) {
    if (Object.values(error).length === 1) {
        await storeAccount.filterUser(email.value, ci.value, birthdate.value);
    }
    return false;
}


async function sendCodee() {
    await storeAccount.sendCode(email.value, ci.value, birthdate.value);
}

async function restorePass() {
    const response = await storeAccount.restorePassword(email.value, ci.value, birthdate.value, recovery_code.value)
    console.log(response);



}

async function back() {
    storeAccount.isVerify = false;
    storeAccount.messageSuccessGmailModal = false;
    storeAccount.messageSuccessModal = false;
    storeAccount.messageErrorModal = false;

}


</script>

<template>
    <div class="modal modal-blur fade" id="modal-scrollable" tabindex="-1" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">

                <Form id="formClientes" @submit="restorePass" :validation-schema="schema" v-slot="{ errors }">
                    <div class="modal-header">
                        <h5 class="modal-title">Recuperar contraseña</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>




                    <div class="modal-body">
                        <div v-if="storeAccount.isVerify === false" class="col-xl-12">
                            <div class="mb-3">
                                <label class="form-label" for="email">Correo:</label>
                                <Field v-model="email" class="form-control" :class="{ 'is-invalid': errors.email }"
                                    type="text" name="email" placeholder="tucorreo@gmail.com" />
                                <ErrorMessage class="invalid-feedback" name="email" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="ci">Cédula:</label>
                                <Field v-model="ci" class="form-control" :class="{ 'is-invalid': errors.ci }"
                                    type="number" name="ci" placeholder="27498161" />
                                <ErrorMessage class="invalid-feedback" name="ci" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="birthdate">Fecha de nacimiento:</label>
                                <Field v-model="birthdate" class="form-control"
                                    :class="{ 'is-invalid': errors.birthdate }" type="date" name="birthdate" />
                                <ErrorMessage class="invalid-feedback" name="birthdate" />
                            </div>

                            <div v-if="storeAccount.messageErrorModal" class="alert alert-danger" role="alert">
                                <div class="d-flex">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                                            <path d="M12 8v4"></path>
                                            <path d="M12 16h.01"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="alert-title">{{ storeAccount.message }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div v-if="storeAccount.isVerify === true" class="col-xl-12">
                            <div class="mb-3">
                                <label class="form-label" for="recovery_code">Código:</label>

                                <div class="input-group mb-3">
                                    <Field v-model="recovery_code" class="form-control"
                                        :class="{ 'is-invalid': errors.recovery_code }" type="text" name="recovery_code"
                                        placeholder="Ingrese aquí el código enviado por correo" />



                                    <button type="button" @click="sendCodee" v-if="!storeAccount.activeTimer"
                                        class="btn input-group-text">
                                        <span v-if="!storeAccount.loadingButton">Generar código</span>

                                        <div v-if="storeAccount.loadingButton"
                                            class="spinner-border spinner-border-sm text-secondary" role="status">
                                        </div>

                                    </button>

                                    <span class="input-group-text" v-if="storeAccount.activeTimer">
                                        <kbd>{{ storeAccount.cooldownTime }}</kbd>
                                    </span>

                                    <ErrorMessage class="invalid-feedback" name="recovery_code" />
                                </div>
                            </div>



                            <div v-if="storeAccount.messageSuccessModal" class="alert alert-success" role="alert">
                                <div class="d-flex">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M5 12l5 5l10 -10"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="alert-title">{{ storeAccount.message }}.</h4>
                                        <div class="text-secondary">Presione el botón "Generar código".</div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="storeAccount.messageSuccessGmailModal" class="alert alert-success" role="alert">
                                <div class="d-flex">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M5 12l5 5l10 -10"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="alert-title">{{ storeAccount.message }}.</h4>
                                        <div class="text-secondary">Por favor verifique su correo.</div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="storeAccount.messageErrorModal" class="alert alert-danger" role="alert">
                                <div class="d-flex">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                                            <path d="M12 8v4"></path>
                                            <path d="M12 16h.01"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="alert-title">{{ storeAccount.message }}</h4>
                                    </div>
                                </div>
                            </div>

                            <div v-if="storeAccount.messageSuccessRestoreModal" class="alert alert-success"
                                role="alert">
                                <div class="d-flex">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M5 12l5 5l10 -10"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="alert-title">{{ storeAccount.message }}.</h4>
                                    </div>
                                </div>
                            </div>



                        </div>

                    </div>

                    <!-- <div class="modal-footer">
                        <button @click="verify(errors)" type="submit" class="btn btn-primary w-100"
                            id="buttonok">Recuperar contraseña</button>
                    </div> -->

                    <div v-if="storeAccount.isVerify === false" class="modal-footer">
                        <button @click="verifyAccount(errors)" type="button" :disabled="storeAccount.loadingVerify"
                            class="btn btn-primary w-100" id="buttonok">
                            <div v-if="storeAccount.loadingVerify" class="spinner-border"></div>
                            <span v-if="!storeAccount.loadingVerify">Verificar cuenta</span>
                        </button>
                    </div>


                    <div v-if="storeAccount.isVerify === true" class="modal-footer">
                        <button @click="back" type="button" class="btn me-auto">Regresar</button>

                        <button @click="restorePass()" type="button" :disabled="storeAccount.loadingRestore"
                            class="btn btn-primary" id="buttonok" required>
                            <span v-if="storeAccount.loadingRestore" class="spinner-border"></span>
                            <span v-if="!storeAccount.loadingRestore">Recuperar contraseña</span>
                        </button>

                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.correo {
    background: none;
    border: none;
    color: rgb(65, 153, 255);
}
</style>