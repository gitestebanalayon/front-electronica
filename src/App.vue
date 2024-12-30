<script setup>
import { onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

import NavBar from './components/page/navbar/Component.vue';
import NavBarTop from './components/page/navbartop/Component.vue';

import { useAccountStore } from './stores/account';
const accountStore = useAccountStore();

const router = useRouter();

const verifyTokenIfAuthenticated = async () => {
    if (accountStore.isAuthenticated) {
        const validToken = await accountStore.verifyToken();
        if (!validToken) {
            router.push('/');
        }
    }
};

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
