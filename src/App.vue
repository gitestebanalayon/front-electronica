<script setup>
import { computed, onMounted } from 'vue';
import { useAccountStore } from './stores/account';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

import NavBar from './components/navbar/Component.vue';
import NavBarTop from './components/navbartop/Component.vue';

const router = useRouter(); // Obtén el enrutador
const accountStore = useAccountStore(); // Obtén el store de Pinia


// Verificar el token al cargar
onMounted(async () => {
    if (accountStore.isAuthenticated) {
        const validToken = await accountStore.verifyToken();
        if (!validToken) {
            // Redirigir al login sin recargar la página
            router.push('/');  // Usa router.push en lugar de window.location.href
        }
    }
});

</script>

<template>
    <NavBar v-if="accountStore.isAuthenticated" />
    <NavBarTop v-if="accountStore.isAuthenticated" />
    <RouterView />
</template>
