<template>
  <div class="animated fadeIn">
   
  </div>
</template>

<script>
import RotateSquare from "../../../components/RotateSquare";
import PedidoServico from "../../../servico/PedidoServico";


export default {
  name: "RelatorioImpressaoPedido",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      itens: [],
      fields: [
        { key: "nome", label: "Nome", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        { key: "ativo", label: "Ativo", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ]
    };
  },
  mounted() {
    let pedidoId = this.$route.params.id;
    this.Obter(pedidoId);
  },
  methods: {
    Obter(pedidoId) {
      this.loading = false;

    //   PedidoServico.RelatorioImpressao(pedidoId)
    //     .then((response) => {
    //       this.loading = false;
    //       console.log(response);
    //     })
    //     .catch((erro) => {
    //       this.loading = false;
    //       this.$notify({
    //         data: erro.response.data.erros,
    //         type: "warn",
    //         duration: 5000
    //       });
    //     });
    }
  }
};
</script>
