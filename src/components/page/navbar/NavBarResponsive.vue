<script setup>
import avatar from '@/assets/img/esteban.jpg';

import { useAccountStore } from '@/stores/account';
import { useRouter } from 'vue-router';
const router = useRouter(); // Obtén el enrutador

const storeAccount = useAccountStore();

async function exit() {
    await storeAccount.logout(router)
}


</script>

<template>
    <div class="navbar-nav flex-row d-lg-none">
        <div class="nav-item dropdown">
            <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown"
                aria-label="Open user menu">
                <span class="avatar avatar-sm" :style="{ backgroundImage: `url(${avatar})` }"></span>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <a href="./profile.html" class="dropdown-item">Perfil</a>
                <a href="#" class="dropdown-item">Información</a>
                <a href="#" class="dropdown-item">Ayuda</a>
                <div class="dropdown-divider"></div>
                <a href="./settings.html" class="dropdown-item">Configuración</a>
                <button @click="exit" class="dropdown-item">Cerrar sesión</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>