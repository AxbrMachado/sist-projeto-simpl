<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Pedidos Venda</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/pedido-venda/novo"
                title="Adicionar novo pedido de venda"
              >
                Adicionar
              </a>
            </div>
          </header>
          <div v-if="loading" class="loading-container">
            <RotateSquare
              class="loading-position animated fadeIn"
              size="60px"
            ></RotateSquare>
          </div>
          <div v-else class="card-body"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PedidoVenda",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
