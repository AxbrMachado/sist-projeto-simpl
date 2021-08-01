<template>
  <div class="animated fadeIn">
    <div class="d-flex justify-content-center align-content-center">
      <div class="m-auto">
          <div class="card text-dark mb-3">
            <header class="card-header bg-warning text-center">
              <i class="fas fa-exclamation-triangle fa-5x"></i>
            </header>

            <div class="card-body">
              <h4 class="card-title">
                Você não possui permissão para entrar nesta página. Solicite ao
                administrador do sistema a permissão.
              </h4>
              
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SemPermissao",
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
