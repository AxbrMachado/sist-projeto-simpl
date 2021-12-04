<template>
  <div>
    <div
      v-for="(item, index) in relatorio.clientes"
      :key="index"
      style="width: 130mm"
    >
      <table>
        <tr>
          <td colspan="7">
            <img
              :src="
                $store.getters.baseURL +
                'arquivo/obter/' +
                relatorio.cabecalho.logo
              "
              height="90px"
              alt="Logo"
            />
          </td>
          <td>
            <tr class="center">
              <h5>{{ relatorio.cabecalho.fantasia }}</h5>
            </tr>

            <tr class="center">
              <td>
                <span>{{ relatorio.cabecalho.razaoSocial }}</span>
              </td>
            </tr>
            <tr class="center">
              <td>
                <span>{{ relatorio.cabecalho.endereco }}</span>
              </td>
            </tr>
            <tr class="center">
              <td>
                <span>{{ relatorio.cabecalho.telefone }}</span>
              </td>
            </tr>
            <tr class="center">
              <td>
                <span>{{ relatorio.cabecalho.email }}</span>
              </td>
            </tr>
            <tr class="center">
              <td>
                <span>CNPJ: {{ relatorio.cabecalho.cnpj }}</span>
              </td>
              <td>
                <span>Incrição Estatual: {{ relatorio.cabecalho.ie }}</span>
              </td>
            </tr>
          </td>
        </tr>
      </table>

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
      <div class="pagebreak"></div>
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

@media print {
  @page {
    size: 97mm 210mm;
    size: portrait;
  }
  .pagebreak {
    page-break-after: always;
  }
}
</style>
