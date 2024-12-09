<template>

    <main class=" d-flex flex-column vh-100">
        <div class="row g-0 flex-fill">
            <div
                class="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center">
                <div class="container container-tight my-5 px-lg-5">
                    <div class="text-center mb-4">
                        <a href="." class="navbar-brand navbar-brand-autodark"><img src="../../assets/img/logo.png"
                                height="100" alt=""></a>
                    </div>
                    <h2 class="h3 text-center mb-3">
                        Inicie sesión en su cuenta
                    </h2>
                    <Form autocomplete="off" @submit="loguear" :validation-schema="validate" v-slot="{ errors }">

                        <div class="mb-3">
                            <label class="form-label">Correo electrónico:</label>
                            <Field v-model="email" name="email" placeholder="tucorreo@email.com" id="floating-input-u"
                                autocomplete="off" type="email" class="form-control"
                                :class="{ 'is-invalid': errors.email }" />
                            <div class="invalid-feedback">{{ errors.email }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">
                                Contraseña
                                <span class="form-label-description">
                                    <a href="./forgot-password.html">Olvidé la contraseña</a>
                                </span>
                            </label>
                            <Field v-model="password" name="password" placeholder="Contraseña" id="floating-input-u"
                                autocomplete="off" type="password" class="form-control"
                                :class="{ 'is-invalid': errors.password }" />
                            <div class="invalid-feedback">{{ errors.password }}</div>
                        </div>
                        <div class="form-footer">
                            <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
                        </div>
                    </Form>
                </div>
            </div>
            <div class="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
                <!-- Photo -->
                <div class="bg-cover h-100 min-vh-100" :style="{ backgroundImage: `url(${logo})` }"></div>
            </div>
        </div>

    </main>
</template>

<script setup>
import logo from '@/assets/img/fondo.png';

import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { useAccountStore } from '@/stores/account';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const storeAccount = useAccountStore();

const validate = Yup.object().shape({
    email: Yup.string()
        .email('Debe ser un correo válido')
        .required('El correo es obligatorio'),
    password: Yup.string()
        .min(8, 'La clave debe tener como mínimo 8 caracteres')
        .required('La clave es obligatoria'),
});

const email = ref('')
const password = ref('')

// Limpiar el almacenamiento de la sesión antes de montar
onBeforeMount(() => {
    sessionStorage.clear();
})

const router = useRouter();

async function loguear() {
    // Llama al servicio del store
    const response = await storeAccount.login(email.value, password.value);

    if (response) {
        // Redirigir al home si es exitoso
        router.push('/home');
    } else {
        console.error("Error al iniciar sesión.");
    }


}

</script>