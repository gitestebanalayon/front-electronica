<script setup>
</script>

<template>
    <div class="modal modal-blur fade show" id="modal-simple" tabindex="-1" style="display: block;" aria-modal="true"
        role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column">

                    <div class="mb-3">
                        <label class="form-label required">Correo</label>
                        <div>
                            <input type="email" class="form-control" aria-describedby="emailHelp"
                                placeholder="Enter email">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label required">Cédula</label>
                        <div>
                            <input type="email" class="form-control" aria-describedby="emailHelp"
                                placeholder="Enter email">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label required">Fecha de nacimiento</label>
                        <div>
                            <input type="email" class="form-control" aria-describedby="emailHelp"
                                placeholder="Enter email">
                        </div>
                    </div>

                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-title">Wow! Everything worked!</h4>
                        <div class="text-secondary">Your account has been saved!</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <a href="#" class="btn" data-bs-toggle="modal" data-bs-target="#modal-simple">
        Simple modal
    </a>

</template>


<style></style>