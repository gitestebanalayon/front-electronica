<script setup>
defineProps(['type', 'title', 'text']);
</script>

<template>
    <div :class="`alert alert-${type}`" role="alert">
        <h4 class="alert-title">{{ title }}</h4>
        <div class="text-secondary">{{ text }}</div>
    </div>
</template>
