<script setup>
import svg from '../../../../assets/svg/icons-svg.json';
//import svg from '../assets/svg/icons-svg.json';

defineProps(['type', 'title', 'text', 'icon']);
</script>



<template>
    <div :class="`alert alert-${type}`" role="alert">
        <div class="d-flex">
            <div>
                <div v-if="icon === 'success'" v-html="svg.success"></div>
                <div v-if="icon === 'info'" v-html="svg.info"></div>
                <div v-if="icon === 'warning'" v-html="svg.warning"></div>
                <div v-if="icon === 'danger'" v-html="svg.danger"></div>
            </div>
            <div>
                <h4 class="alert-title">{{ title }}</h4>
                <div class="text-secondary">{{ text }}</div>
            </div>
        </div>

    </div>
</template>
