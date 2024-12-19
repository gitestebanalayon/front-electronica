<script setup>
defineProps(['buttons']);
</script>

<template>
    <button v-for="(button, index) in buttons" :key="index" :type="button.type" :class="['btn', button.class]"
        v-bind="button.attributes" @click="button.onClick">
        {{ button.label }}
    </button>
</template>
