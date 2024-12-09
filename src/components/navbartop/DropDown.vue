<script setup>
    import DropDownItem from './DropDownItem.vue'
    defineProps(['icon','title', 'avatar_active'])
</script>

<template>

    <div class="dropdown position-relative">
        <button class="p-0 bg-transparent border-0 d-flex position-relative" data-bs-toggle="dropdown" tabindex="-1" aria-label="Show notifications" aria-expanded="false">
            <i :class="icon" class="text-secondary"></i>
            <span class="badge bg-red position-absolute end-0"></span>
        </button>

        <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
            <div class="card">     
                           
                <div class="card-header">
                    <i :class="icon" class="text-secondary me-2"></i>
                    <h3 class="card-title">{{ title }}</h3>
                </div>

                <div v-if="title == 'Mensajes'" class="list-group list-group-flush list-group-hoverable">
                    <DropDownItem :active="avatar_active" bg_color="bg-success" subtitle="Esteban Alayon" bodytext="Este mensaje es de prueba y practica"/>
                    <DropDownItem :active="avatar_active" bg_color="bg-red" subtitle="Jesus Alvarez" bodytext="Este mensaje es de prueba y practica"/>
                    <DropDownItem :active="avatar_active" bg_color="bg-red" subtitle="Marcos Hernandez" bodytext="Este mensaje es de prueba y practica"/>
                </div>

                <div v-else-if="title == 'Notificaciónes'" class="list-group list-group-flush list-group-hoverable">
                    <DropDownItem :active="avatar_active" bg_color="bg-red" subtitle="Garantía" bodytext="Este mensaje es de prueba y practica"/>
                </div>

            </div>
        </div>
    </div>

</template>