<script setup>
defineProps(['type', 'class', 'label']);
</script>

<template>
    <button :type="type" :class="class">
        {{ label }}
    </button>
</template>
