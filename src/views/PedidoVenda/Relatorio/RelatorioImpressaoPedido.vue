<template>
  <div>
    <div
      v-for="(item, index) in relatorio.clientes"
      :key="index"
    >
      <div class="row logo">
        <div class="col center">
          <img
            :src="
              $store.getters.baseURL +
              'arquivo/obter/' +
              relatorio.cabecalho.logo
            "
            height="130px"
            alt="Logo"
          />
        </div>
        <div class="col">
          <div class="row center">
            <h5>{{ relatorio.cabecalho.fantasia }}</h5>
          </div>
          <div class="row center">
            <span>{{ relatorio.cabecalho.razaoSocial }}</span>
          </div>
          <div class="row center">
            <span>{{ relatorio.cabecalho.endereco }}</span>
          </div>
          <div class="row center">
            <span>{{ relatorio.cabecalho.telefone }}</span>
          </div>
          <div class="row center">
            <span>{{ relatorio.cabecalho.email }}</span>
          </div>
          <div class="row center">
            <div class="col center">
              <span>CNPJ: {{ relatorio.cabecalho.cnpj }}</span>
            </div>
            <div class="col center">
              <span>Incrição Estatual: {{ relatorio.cabecalho.ie }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <span>Data: {{ relatorio.dataEntrega }}</span>
      </div>
      <div class="row">
        <span>Destino: {{ item.nome }}</span>
      </div>
      <div class="row">
        <b-table
          striped
          hover
          :items="item.produtos"
          :fields="fields"
        ></b-table>
      </div>

      <div class="row">
        <p>Obs: {{ item.observacao }}</p>
      </div>
      <div class="row" style="margin: 10px">
        <table class="table">
          <tr>
            <td align="center" valign="center" style="border-top: solid 1px">
              Resp. Entrega
            </td>

            <td align="center" valign="center" style="border: none"></td>
            <td align="center" valign="center" style="border-top: solid 1px">
              Resp. Recebimento
            </td>
          </tr>
        </table>
      </div>
    </div>
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
      relatorio: {},
      fields: [
        { key: "produto", label: "Itens" },
        { key: "quantidade", label: "Quantidade" },
        { key: "unidadeMedida", label: "Unid." }
      ]
    };
  },
  mounted() {
    let pedidoId = this.$route.params.id;
    this.Obter(pedidoId);
  },
  methods: {
    Obter(pedidoId) {
      this.loading = true;
      PedidoServico.RelatorioImpressao(pedidoId)
        .then((response) => {
          this.loading = false;
          this.relatorio = response.data;
          console.log(response);
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    }
  }
};
</script>
<style lang="scss">
.center {
  display: flex;
  justify-content: space-around;
}
</style>
