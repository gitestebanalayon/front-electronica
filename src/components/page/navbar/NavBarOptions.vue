<script setup>
import Items from './NavBarOptionsItems.vue';
import ItemsSub from './NavBarOptionsItemsSub.vue';

</script>

<template>
    <div class="collapse navbar-collapse dropdown" id="sidebar-menu">
        <ul class="navbar-nav pt-lg-2 pb-lg-2 d-flex gap-1">
            <Items icon="ti ti-home" name="Inicio" routs="/home" />
            <Items icon="ti ti-crown" name="Clientes" routs="/customers" badge="active" />

            <li>
                <ItemsSub name="Interface" icon="ti ti-dropbox-alt" active="#active1" />
                <div id="active1" class="collapse rounded-2 bg-gray-700">
                    <ul class="navbar-nav d-flex gap-1">
                        <Items class="mt-1" icon="ti ti-dropbox" name="Cajas" routs="/cajas" />
                        <Items icon="ti ti-layout-grid2" name="Categorias" routs="/categorias" />
                        <Items icon="ti ti-file" name="Archivos" routs="/archivos" />

                        <li>
                            <ItemsSub name="Social" icon="ti ti-trello" active="#active2" />
                            <div id="active2" class="collapse">
                                <ul class="navbar-nav d-flex gap-1">
                                    <Items class="mt-1" icon="ti ti-comment-alt" name="Mensajes" routs="/mensajes" />
                                    <Items icon="ti ti-facebook" name="Facebook" routs="/facebook" />
                                    <Items icon="ti ti-email" name="Correos" routs="/correos" />

                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>

            <Items icon="ti ti-star" name="Favoritos" routs="/a" />
            <Items icon="ti ti-user" name="Personas" routs="/b" badge="active" />
            <Items icon="ti ti-list" name="Puntos" routs="/c" />
            <Items icon="ti ti-desktop" name="Radios" routs="/d" />
            <Items icon="ti ti-video-camera" name="Videos" routs="/e" />

            <Items name="Configuración" icon="ti ti-settings" routs="/profile"/>
            
            

        </ul>
    </div>
</template>

<style scoped></style>