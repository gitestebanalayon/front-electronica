<script setup>
import FormHeader from "./restorePassword/Header.vue";
import Button from "./restorePassword/Button.vue";
import Label from "./restorePassword/Label.vue";

import AlertGlobal from "../../global/AlertGlobal.vue";
import LoadingGlobal from "../../global/LoadingGlobal.vue";
import svg from '../../../assets/svg/icons-svg.json';

import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import StepProgress from 'vue-step-progress';

import { useAccountStore } from "@/stores/account";
const useAccount = useAccountStore();

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
            .required('El código de recuperación es obligatorio'),
    })
);

const formData = ref({
    ci: '27498161',
    email: 'estebanalayon7@gmail.com',
    birthdate: '2000-08-25',
    recovery_code: '',
});

const steps = ["Verificar cuenta", "Ingresar código"];
const currentStep = ref(0);

async function restorePassword() {
    try {
        await schema.value.validate(formData.value, { abortEarly: false });
        const response = await useAccount.restorePassword(formData.value.email, Number(formData.value.ci), formData.value.birthdate, formData.value.recovery_code);
        if (response) {
            currentStep.value = 2;
        } else {
            currentStep.value = 1;
        }
    } catch (validationErrors) {

    }
}

async function verifyAccount() {
    try {
        await schema.value.validate(formData.value, { abortEarly: false });
    } catch (validationErrors) {
        if (validationErrors.inner.length === 1) {
            const response = await useAccount.verifyAccount(formData.value.email, formData.value.ci, formData.value.birthdate);
            if (response) {
                currentStep.value = 1;
            } else {
                currentStep.value = 0;
            }
        }
    }
}

async function sendCode() {
    await useAccount.sendCode(formData.value.email, Number(formData.value.ci), formData.value.birthdate);
}

async function back() {
    currentStep.value = 0;
    useAccount.clearAlerts();
    formData.value.recovery_code = '';
}

async function ready() {
    formData.value.recovery_code = '';
    formData.value.ci = '';
    formData.value.birthdate = '';
    formData.value.email = '';
    currentStep.value = 0;
    useAccount.message = null;
}

</script>

<template>
    <div class="modal modal-blur fade" id="modal-simple" tabindex="-1" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <Form id="restore-password" class="modal-content" @submit="restorePassword" :validation-schema="schema"
                v-slot="{ errors }">
                <FormHeader title="Restaurar contraseña" />
                <div class="progresss m-auto">
                    <StepProgress v-if="currentStep === 0 || currentStep === 1" :steps="steps"
                        :current-step="currentStep" icon-class="ti ti-check" :active-thickness="0"
                        :passive-thickness="0" :line-thickness="3" passive-color="red" line-color="blue"></StepProgress>
                </div>

                <div v-if="currentStep === 0" class="modal-body d-flex flex-column">
                    <!-- Campo de Cédula -->
                    <div class="mb-3">
                        <Label label="Cédula" />
                        <Field v-model="formData.ci" class="form-control" :class="{ 'is-invalid': errors.ci }"
                            type="number" name="ci" placeholder="Cédula de identidad" />
                        <ErrorMessage name="ci" class="invalid-feedback" />
                    </div>

                    <!-- Campo de Correo -->
                    <div class="mb-3">
                        <Label label="Correo" />
                        <Field v-model="formData.email" class="form-control" :class="{ 'is-invalid': errors.email }"
                            type="email" name="email" placeholder="tucorreo@gmail.com" />
                        <ErrorMessage name="email" class="invalid-feedback" />
                    </div>

                    <!-- Campo de Fecha de nacimiento -->
                    <div class="mb-3">
                        <Label label="Fecha de nacimiento" />
                        <Field v-model="formData.birthdate" class="form-control"
                            :class="{ 'is-invalid': errors.birthdate }" type="date" name="birthdate" />
                        <ErrorMessage name="birthdate" class="invalid-feedback" />
                    </div>

                    <!-- Alerta de error -->
                    <AlertGlobal scope="verifyAccount" />
                </div>

                <div v-if="currentStep === 1" class="modal-body d-flex flex-column">
                    <!-- Campo de código -->
                    <div class="mb-3">
                        <Label label="Código" />
                        <div class="input-group mb-2">
                            <Field v-model="formData.recovery_code" class="form-control"
                                :class="{ 'is-invalid': errors.recovery_code }" type="text" name="recovery_code"
                                :placeholder="useAccount.intervalId ? 'Coloca el código enviado por correo' : 'Seleccione: Enviar código'" />


                            <button class="btn" type="button" :disabled="useAccount.isButtonDisabled"
                                @click="sendCode(email, ci, birthdate)">
                                <LoadingGlobal v-if="useAccount.apiName === 'sendCode'" />
                                <span v-else>{{ useAccount.isButtonDisabled ? useAccount.cooldownTime : "Enviar código"
                                    }}</span>
                            </button>

                            <ErrorMessage name="recovery_code" class="invalid-feedback" />
                        </div>
                    </div>

                    <!-- Alerta de error -->
                    <AlertGlobal scope="verifyAccount" />
                    <AlertGlobal scope="restorePassword" />
                    <AlertGlobal scope="sendCode" />
                </div>

                <div v-if="currentStep === 2" class="modal-body d-flex flex-column">
                    <div class="alert alert-success" role="alert">
                        <div class="d-flex">
                            <div>
                                <div v-html="svg.success"></div>
                            </div>
                            <div>
                                <h4 class="alert-title">¡Su contraseña a sido restaurada existosamente!</h4>
                                <div class="text-secondary">La nueva contraseña a sido enviada a su correo, por favor
                                    verifique su correo.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer d-flex justify-content-between">
                    <Button v-if="currentStep === 0" type="button" label="Cancelar" class="btn"
                        data-bs-dismiss="modal"></Button>
                    <!-- Button Loader -->
                    <button v-if="currentStep === 0" @click="verifyAccount()" class="btn btn-primary" type="submit"
                        :disabled="useAccount.apiName === 'verifyAccount'">
                        <LoadingGlobal v-if="useAccount.apiName === 'verifyAccount'" />
                        <span v-else>Verificar</span>
                    </button>

                    <Button v-if="currentStep === 1" type="button" label="Atras" class="btn" @click="back()"></Button>
                    <!-- Button Loader -->
                    <button v-if="currentStep === 1" @click="restorePassword()"
                        :disabled="useAccount.apiName === 'restorePassword'" class="btn btn-primary" type="submit">
                        <LoadingGlobal v-if="useAccount.apiName === 'restorePassword'" />
                        <span v-else>Restaurar</span>
                    </button>


                    <Button v-if="currentStep === 2" type="button" label="Atras" class="btn" @click="back()"></Button>
                    <Button v-if="currentStep === 2" type="button" label="Iniciar sesión" @click="ready()"
                        class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-simple"></Button>

                </div>
            </Form>

        </div>
    </div>
</template>


<style scoped></style>