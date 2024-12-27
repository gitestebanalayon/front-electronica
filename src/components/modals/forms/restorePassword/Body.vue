<!-- Body.vue -->
<script setup>


// Definir las props que recibirá el componente
defineProps(['errors', 'successMessage', 'modelValue']);
defineEmits(['update:modelValue']);

import { useAccountStore } from "@/stores/account";

const useAccount = useAccountStore();

</script>

<template>
    



</template>
