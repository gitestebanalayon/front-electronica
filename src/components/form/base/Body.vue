<script setup>
import Label from "@/components/form/base/Label.vue";
import Alert from "@/components/form/base/Alert.vue";
import { Field, ErrorMessage } from "vee-validate";

// Definir props que recibirá el componente
defineProps(['errors', 'successMessage']);
</script>

<template>
    <div class="modal-body d-flex flex-column">
        <!-- Campo de Correo -->
        <div class="mb-3">
            <Label label="Correo" />
            <Field class="form-control" :class="{ 'is-invalid': errors.email }" type="email" name="email"
                placeholder="tucorreo@gmail.com" />
            <ErrorMessage name="email" class="invalid-feedback" />
        </div>

        <!-- Campo de Contraseña -->
        <div class="mb-3">
            <Label label="Contraseña" />
            <Field class="form-control" :class="{ 'is-invalid': errors.password }" type="password" name="password"
                placeholder="Contraseña" />
            <ErrorMessage name="password" class="invalid-feedback" />
        </div>

        <!-- Alerta de éxito -->
        <Alert v-if="successMessage" type="success" title="Mensaje enviado exitosamente!" />
    </div>
</template>
