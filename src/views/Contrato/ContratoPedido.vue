<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="abrir = !abrir">
              <div class="d-flex">
                <strong class="align-self-center">Pedido(s)</strong>
                <small class="ml-2 mt-1">Clique para abrir/esconder</small>

                <i
                  :class="
                    abrir
                      ? 'ml-auto mt-1 fas fa-chevron-up'
                      : 'ml-auto mt-1 fas fa-chevron-down'
                  "
                ></i>
              </div>
            </header>
            <div :class="abrir ? 'collapse-show' : 'collapse'">
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-2 col-md-6 col-sm-12">
                    <div class="form-group">
                      <label>Número</label>
                      <input
                        type="text"
                        v-model="filtro.Numero"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                      <label>Descrição</label>
                      <input
                        type="text"
                        v-model="filtro.Descricao"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>Status</label>
                      <b-form-select
                        v-model="filtro.Status"
                        :options="statusOptions"
                      ></b-form-select>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                    <div class="form-group">
                      <label for>Data Entrega</label>
                      <input
                        v-model="filtro.DataEntrega"
                        class="form-control"
                        type="date"
                        placeholder="Digite a data de entrega"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-1"
                    title="Apenas pedidos completos."
                  >
                    <label for>Completo</label>
                    <b-form-checkbox
                      v-model="filtro.PedidoCompleto"
                      name="check-button"
                      switch
                    >
                    </b-form-checkbox>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-1"
                    title="Apenas pedidos completos."
                  >
                    <label for>Pendente</label>
                    <b-form-checkbox
                      v-model="filtro.PedidoPendente"
                      name="check-button"
                      switch
                    >
                    </b-form-checkbox>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 col-md-5 col-sm-12 mt-4">
                    <button
                      class="btn btn-primary mr-2"
                      type="button"
                      @click="ObterGrid(1)"
                    >
                      Filtrar
                    </button>
                    <button
                      class="btn btn-secondary"
                      type="button"
                      @click="Limpar()"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4 col-md-5 col-sm-12 mt-4"></div>
                </div>

                <b-table
                  :hover="true"
                  responsive
                  :items="itens"
                  :fields="fields"
                  striped
                  :per-page="itensPorPagina"
                  show-empty
                  empty-text="Nenhum pedido encontrado."
                >
                  <template v-slot:empty="scope">
                    <h4>{{ scope.emptyText }}</h4>
                  </template>
                  <template v-slot:cell(acoes)="data">
                    <div class="btn-group-sm">
                      <b-button
                        variant="primary"
                        style="margin-right: 10px"
                        title="Visualizar Produtos"
                        @click="SwitchVisualizarProdutoPedido(data.item)"
                      >
                        <i class="fas fa-cart-plus"></i>
                      </b-button>
                      <b-button
                        variant="warning"
                        style="margin-right: 00px"
                        title="Abrir Pedido"
                        @click="AbrirPedido(data.item)"
                      >
                        <i class="fa fa-edit"></i>
                      </b-button>
                    </div>
                  </template>
                  <template v-slot:cell(dataEntrega)="data">
                    <div class="center">
                      <span>{{ FormatarData(data.item.dataEntrega) }}</span>
                    </div>
                  </template>
                  <template v-slot:cell(valor)="data">
                    <div class="left">
                      <span>{{ FormataValor(data.item.valor) }}</span>
                    </div>
                  </template>
                  <template v-slot:cell(status)="data">
                    <div class="left">
                      <span>{{ ObterNomeStatusPedido(data.item.status) }}</span>
                    </div>
                  </template>
                </b-table>
                <b-pagination
                  v-model="pagina"
                  :total-rows="total"
                  :per-page="itensPorPagina"
                  align="right"
                  size="md"
                  class="mt-2"
                ></b-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="VisualizarProdutoPedido()">
      <ContratoPedidoProduto
        :contratoId="this.contratoId"
        :pedidoId="this.pedidoId"
        :descricaoPedido="this.descricaoPedido"
      >
      </ContratoPedidoProduto>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import ContratoPedidoProduto from "./ContratoPedidoProduto";
import Bus from "../../util/EventBus";

export default {
  name: "ContratoPedido",
  components: {
    RotateSquare,
    ContratoPedidoProduto,
    Bus
  },
  props: {
    contratoId: { type: String, default: "" }
  },
  data() {
    return {
      abrir: false,
      loading: false,
      itens: [],
      visualizarProduto: false,
      pedidoId: this.$store.getters.emptyGuid,
      descricaoPedido: "",
      contratoOptions: [],
      statusOptions: [],
      instituicaoOptions: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      statusOptions: [
        { value: StatusPedidoEnum.Pendente, text: "Pendente" },
        { value: StatusPedidoEnum.Aberto, text: "Aberto" },
        {
          value: StatusPedidoEnum.AguardandoProdutos,
          text: "Aguardando Produtos"
        },
        { value: StatusPedidoEnum.Incompleto, text: "Incompleto" },
        { value: StatusPedidoEnum.EmRota, text: "Em Rota" },
        { value: StatusPedidoEnum.Entregue, text: "Entregue" },
        { value: StatusPedidoEnum.Finalizado, text: "Finalizado" },
        { value: StatusPedidoEnum.Cancelado, text: "Cancelado" }
      ],

      filtro: {
        Descricao: "",
        Numero: "",
        Status: 0,
        DataEntrega: "",
        PedidoAvulso: false,
        PedidoCompleto: false,
        PedidoPendente: false,
        PedidoEntregue: false
      },
      fields: [
        { key: "numero", label: "Número", sortable: true },
        { key: "descricao", label: "Descrição", sortable: true },
        { key: "dataEntrega", label: "Data Entrega", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "instituicao", label: "Instituição", sortable: true },
        { key: "status", label: "Status", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ]
    };
  },
  watch: {
    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  mounted() {
    this.ObterGrid(1);
  },
  methods: {
    Limpar() {
      this.filtro.Descricao = "";
      this.filtro.Numero = "";
      this.filtro.Status = 0;
      this.filtro.DataEntrega = "";
      this.filtro.PedidoAvulso = false;
      this.filtro.PedidoCompleto = false;
      this.filtro.PedidoPendente = false;
      this.filtro.PedidoEntregue = false;

      this.visualizarProduto = false;
    },
    AbrirPedido(pedido) {
      this.$router.push("/pedidovenda/editar/" + pedido.id);
    },
    ObterGrid(pagina) {
      this.visualizarProduto = false;
      this.loading = false;
      this.$http({
        url: "/pedido/obter-grid?pagina=" + pagina + this.MontaFiltro(),
        method: "GET"
      })
        .then((response) => {
          this.loading = false;
          this.itens = response.data.itens;
          this.total = response.data.total;
          this.pagina = response.data.pagina;
          this.itensPorPagina = response.data.itensPorPagina;
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    MontaFiltro() {
      var filtros = "";
      var filtros = filtros + "&Descricao=" + this.filtro.Descricao;
      var filtros = filtros + "&Numero=" + this.filtro.Numero;

      if (this.contratoId) {
        var filtros = filtros + "&ContratoId=" + this.contratoId;
      }

      if (this.filtro.Status != 0) {
        var filtros = filtros + "&Status=" + this.filtro.Status;
      }

      var filtros = filtros + "&DataEntrega=" + this.filtro.DataEntrega;
      var filtros = filtros + "&PedidoAvulso=" + this.filtro.PedidoAvulso;
      var filtros = filtros + "&PedidoCompleto=" + this.filtro.PedidoCompleto;
      var filtros = filtros + "&PedidoPendente=" + this.filtro.PedidoPendente;
      var filtros = filtros + "&PedidoEntregue=" + this.filtro.PedidoEntregue;

      if (this.filtro.Instituicao) {
        var filtros = filtros + "&InstituicaoId=" + this.filtro.Instituicao.id;
      }

      return filtros;
    },

    ObterNomeStatusPedido(item) {
      switch (item) {
        case StatusPedidoEnum.Pendente:
          return "Pendente";
        case StatusPedidoEnum.Pendente:
          return "Pendente";
        case StatusPedidoEnum.Aberto:
          return "Aberto";
        case StatusPedidoEnum.AguardandoProdutos:
          return "Aguardando Produtos";
        case StatusPedidoEnum.Incompleto:
          return "Incompleto";
        case StatusPedidoEnum.EmRota:
          return "Em Rota";
        case StatusPedidoEnum.Entregue:
          return "Entregue";
        case StatusPedidoEnum.Finalizado:
          return "Finalizado";
        case StatusPedidoEnum.Cancelado:
          return "Cancelado";
        default:
          return "Inválido";
      }
    },

    FormatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString();
      } else {
        return "";
      }
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    ObterContratoVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      this.$http({
        url: "/contrato/obter-v-select/" + busca,
        method: "GET"
      })
        .then((response) => {
          this.contratoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    VisualizarProdutoPedido() {
      return this.visualizarProduto;
    },
    SwitchVisualizarProdutoPedido(item) {
      this.pedidoId = item.pedidoId;
      this.visualizarProduto = !this.visualizarProduto;
      this.descricaoPedido = item.numero + " / " + item.descricao;
    },
    switchAbertura() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.visualizarProduto = false;
      }
    }
  }
};
</script>
