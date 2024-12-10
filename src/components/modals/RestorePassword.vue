<script setup>
import { ref, onMounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useAccountStore } from '@/stores/account';
const storeAccount = useAccountStore()

const schema = ref(
    yup.object().shape({
        email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
        ci: yup.number()
            .required('El cédula es obligatoria')
            .typeError('La cédula debe ser tipo numerico'),
        birthdate: yup.string().required('La fecha de nacimiento es obligatoria'),
    })
);

const email = ref('admin@gmail.com');
const ci = ref(27498161);
const birthdate = ref('2000-08-25');
const recovery_code = ref('');

const verify = async (error) => {
    if (Object.values(error).length === 0) {
        await storeAccount;
    }
}


async function sendCode() {
    const response = await storeAccount.sendCode(email.value, ci.value, birthdate.value)

    if (response.statusCode === 200) {
        console.log('ok');
    } else {

    }
}

async function restorePass() {
    const response = await storeAccount.restorePassword(email.value, ci.value, birthdate.value, recovery_code.value)

    console.log(response);
    

}



</script>

<template>
    <div class="modal modal-blur fade" id="modal-scrollable" tabindex="-1" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div class="modal-content">

                <Form id="formClientes" @submit="restorePass" :validation-schema="schema" v-slot="{ errors }">
                    <div class="modal-header">
                        <h5 class="modal-title">Recuperar contraseña</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div v-if="storeAccount.loading" class="d-flex justify-content-center p-5">
                        <div class="spinner-border"></div>
                    </div>

                    <div v-else class="modal-body">
                        <div class="col-xl-12">
                            <div class="mb-3">
                                <label class="form-label" for="email">Email:</label>
                                <Field v-model="email" class="form-control" :class="{ 'is-invalid': errors.email }"
                                    type="text" name="email" placeholder="tucorreo@gmail.com" />
                                <ErrorMessage class="invalid-feedback" name="email" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="ci">Cédula</label>
                                <Field v-model="ci" class="form-control" :class="{ 'is-invalid': errors.ci }"
                                    type="number" name="ci" placeholder="27498161" />
                                <ErrorMessage class="invalid-feedback" name="ci" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="birthdate">Fecha de nacimiento</label>
                                <Field v-model="birthdate" class="form-control"
                                    :class="{ 'is-invalid': errors.birthdate }" type="date" name="birthdate" />
                                <ErrorMessage class="invalid-feedback" name="birthdate" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="recovery_code">Código</label>

                                <div class="input-group input-group-flat mb-3">
                                    <Field v-model="recovery_code" class="form-control" type="text" name="recovery_code"
                                        placeholder="Ingrese aquí el código enviado por correo" />
                                    <span v-if="!storeAccount.messageVisibleModal && !storeAccount.messageErrorModal"
                                        class="input-group-text">
                                        <button type="button" @click="sendCode"
                                            class="correo input-group-link">Generar</button>
                                    </span>
                                </div>
                                <ErrorMessage class="invalid-feedback" name="recovery_code" />
                            </div>



                            <div v-if="storeAccount.messageVisibleModal" class="alert alert-success" role="alert">
                                <div class="d-flex">
                                    <div>
                                        <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M5 12l5 5l10 -10"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="alert-title">{{ storeAccount.message }}</h4>
                                        <div class="text-secondary">¡Revise su correo!</div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="storeAccount.messageErrorModal" class="alert alert-danger" role="alert">
                                <div class="d-flex">
                                    <div>
                                        <!-- Download SVG icon from http://tabler-icons.io/i/alert-circle -->
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
                    </div>

                    <div class="modal-footer">
                        <button @click="verify(errors)" type="submit" class="btn btn-primary w-100"
                            id="buttonok">Recuperar contraseña</button>
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