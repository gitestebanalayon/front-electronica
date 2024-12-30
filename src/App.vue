<script setup>
import { onMounted, watch } from 'vue';
import { useAccountStore } from './stores/account';
import { RouterView } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';

import NavBar from './components/navbar/Component.vue';
import NavBarTop from './components/navbartop/Component.vue';

const router = useRouter();

const accountStore = useAccountStore(); // Obtén el store de Pinia


// // Verificar el token al cargar
// onMounted(async () => {
//     if (accountStore.isAuthenticated) {
//         const validToken = await accountStore.verifyToken();
//         if (!validToken) {
//             // Redirigir al login sin recargar la página
//             router.push('/');  // Usa router.push en lugar de window.location.href
//         }
//     }
// });

// Función para verificar el token
const verifyTokenIfAuthenticated = async () => {
    if (accountStore.isAuthenticated) {
        const validToken = await accountStore.verifyToken();
        if (!validToken) {
            router.push('/'); // Redirige al login si el token no es válido
        }
    }
};

// Verifica el token al cargar
onMounted(() => {
    verifyTokenIfAuthenticated();
});

// Observa los cambios en la ruta
watch(
    () => router.path, // Observa cambios en la ruta activa
    () => {
        verifyTokenIfAuthenticated();
    }
);


</script>

<template>
    <NavBar v-if="accountStore.isAuthenticated" />
    <NavBarTop v-if="accountStore.isAuthenticated" />
    <RouterView />
</template>
