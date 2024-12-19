<script setup>
import FormHeader from "@/components/form/base/Header.vue";
import FormBody from "@/components/form/base/Body.vue";
import FormButton from "@/components/form/base/Button.vue";

import { ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import StepProgress from 'vue-step-progress';

const successMessage = ref(true)

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

const buttons = ref([
    { label: "Cerrar", type: "button", class: "", attributes: { "data-bs-dismiss": "modal" } },
    { label: "Iniciar", type: "submit", class: "btn-primary", attributes: {}, onClick: () => { send() } },
]);

async function send() {
    console.log('send');

}


const steps = [null, null, null];
const currentStep = ref(0);

</script>

<template>
    <div class="modal modal-blur fade show" id="modal-simple" tabindex="-1" style="display: block;" aria-modal="true"
        role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">



            <Form class="modal-content" @submit="" :validation-schema="schema" v-slot="{ errors }">



                <div class="m-auto w-100">
                    <StepProgress :steps="steps" :current-step="currentStep" icon-class="ti ti-check"
                        :active-thickness="0" :passive-thickness="0" :line-thickness="3"></StepProgress>
                </div>

                <FormHeader title="Login" />

                <FormBody :errors="errors" :successMessage="successMessage" />

                <div class="modal-footer d-flex justify-content-between">
                    <FormButton :buttons="buttons" />
                </div>

            </Form>
        </div>
    </div>

    <a href="#" class="btn" data-bs-toggle="modal" data-bs-target="#modal-simple">
        Simple modal
    </a>

</template>


<style scoped>



</style>