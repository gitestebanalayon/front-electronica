<script setup>
defineProps(['icon', 'text'])
</script>

<template>
    <header class="page-header mt-2">
        <div class="ps-3 pe-3">
            <div class="card">
                <div class="p-3 d-flex align-items-center">
                    <i :class="icon" class="me-2 text-secondary"></i>
                    <h2 class="page-title"> {{ text  }} </h2>
                </div>
            </div>
        </div>
    </header>
</template>
