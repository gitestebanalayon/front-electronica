<script setup>
import Footer from '@/components/footer/Component.vue';
import Header from '@/components/header/Component.vue';
import avatar from '@/assets/img/esteban.jpg';
import { useAccountStore } from '@/stores/account';

const useAccount = useAccountStore();

useAccount.filterProfile();

const user = JSON.parse(sessionStorage.getItem("user") || "{}");
const email = sessionStorage.getItem('email');
const first_name = sessionStorage.getItem('first_name');
const last_name = sessionStorage.getItem('last_name');




</script>

<template>
    <main class="page-wrapper">
        <!-- Page header -->
        <Header icon="ti ti-settings" text="Configuración" />

        <div class="page-body mt-3 mb-3">
            <div class="ps-3 pe-3">
                <div class="card">
                    <div class="row g-0">
                        <div class="col-3 d-none d-md-block border-end">
                            <div class="card-body">
                                <h4 class="subheader">Configuración general</h4>
                                <div class="list-group list-group-transparent">
                                    <a href="#"
                                        class="list-group-item list-group-item-action d-flex align-items-center active">Perfil</a>
                                    <a href="#"
                                        class="list-group-item list-group-item-action d-flex align-items-center">Mis
                                        notificaciones</a>
                                    <a href="#"
                                        class="list-group-item list-group-item-action d-flex align-items-center">Aplicaciones
                                        conectadas</a>
                                    <a href="#"
                                        class="list-group-item list-group-item-action d-flex align-items-center">Planes</a>
                                    <a href="#"
                                        class="list-group-item list-group-item-action d-flex align-items-center">Facturación
                                        &amp; Factura</a>
                                </div>
                                <h4 class="subheader mt-4">Experiencia</h4>
                                <div class="list-group list-group-transparent">
                                    <a href="#" class="list-group-item list-group-item-action">Dar comentarios</a>
                                </div>
                            </div>
                        </div>
                        <div class="col d-flex flex-column">
                            <div class="card-body">
                                <h2 class="mb-4">Perfil</h2>

                                <div class="row align-items-center">
                                    <div class="col-auto"><span class="avatar avatar-xl"
                                            :style="{ backgroundImage: `url(${avatar})` }"></span>
                                    </div>
                                    <div class="col-auto"><a href="#" class="btn">
                                            Cambiar avatar
                                        </a></div>
                                    <div class="col-auto"><a href="#" class="btn btn-ghost-danger">
                                            Eliminar avatar
                                        </a></div>
                                </div>

                                <div class="row g-3 mt-3">
                                    <div class="row">
                                        <div class="col-md mb-3">
                                            <div class="form-label">Nombre:</div>
                                            <input type="text" class="form-control"
                                                :value="useAccount.profile.first_name">
                                        </div>
                                        <div class="col-md mb-3">
                                            <div class="form-label">Apellido:</div>
                                            <input type="text" class="form-control"
                                                :value="useAccount.profile.last_name">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md mb-3">
                                            <div class="form-label">Origen:</div>
                                            <input type="text" class="form-control" :value="useAccount.profile.origen">
                                        </div>
                                        <div class="col-md mb-3">
                                            <div class="form-label">Cédula:</div>
                                            <input type="text" class="form-control" :value="useAccount.profile.ci">
                                        </div>
                                        <div class="col-md mb-3">
                                            <div class="form-label">Fecha de nacimiento:</div>
                                            <input type="date" class="form-control"
                                                :value="useAccount.profile.birthdate">
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md mb-3">
                                            <div class="form-label">Teléfono:</div>
                                            <input type="text" class="form-control" :value="useAccount.profile.phone">
                                        </div>

                                        <div class="col-md mb-3">
                                            <div class="form-label">Correo:</div>
                                            <input type="text" class="form-control" :value="useAccount.profile.email">
                                        </div>

                                        <div class="col-md mb-3">
                                            <div class="form-label">Cambio de clave:</div>
                                            <a href="#" class="btn w-100">Establecer una nueva</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-transparent mt-auto">
                                <div class="btn-list justify-content-end">
                                    <a href="#" class="btn">
                                        Cancelar
                                    </a>
                                    <a href="#" class="btn btn-primary">
                                        Entregar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Page footer -->
        <Footer />
    </main>

</template>
