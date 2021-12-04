<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="switchAberturaProdutos()">
              <div class="d-flex">
                <strong class="align-self-center">Fornecedore(s)</strong>
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
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <div class="form-group">
                      <label>Fornecedor</label>
                      <input
                        type="text"
                        v-model="filtro.nome"
                        class="form-control"
                      />
                    </div>
                  </div>
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
                  <div class="col-12">
                    <b-table
                      :hover="true"
                      responsive
                      :items="itens"
                      :fields="fields"
                      striped
                      :per-page="itensPorPagina"
                      show-empty
                      empty-text="Nenhum fornecedor encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <b-button
                            variant="info"
                            style="margin-right: 10px"
                            title="Visualizar produtos"
                            @click="SwitchEditarProdutos(data.item)"
                          >
                            <i class="fas fa-cart-plus"></i>
                          </b-button>

                          <b-button
                            :disabled="isPedidoEmRotaDeEntrega()"
                            variant="primary"
                            style="margin-right: 10px"
                            title="Confirmar conferência de todos os produtos deste fornecedor"
                            @click="
                              ConfirmarConferenciaProdutosFornecedor(data.item)
                            "
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </b-button>

                          <b-button
                            :disabled="isPedidoEmRotaDeEntrega()"
                            variant="secondary"
                            style="margin-right: 10px"
                            title="Recusar conferência de todos os produtos do fornecedor"
                            @click="
                              RecusarConferenciaProdutosFornecedor(data.item)
                            "
                          >
                            <i class="fas fa-thumbs-down"></i>
                          </b-button>

                          <b-button
                            :disabled="isPedidoEmRotaDeEntrega()"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Excluír conferência dos produtos do fornecedor"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </b-button>
                          <b-button
                            :disabled="isPedidoEmRotaDeEntrega()"
                            variant="dark"
                            title="Imprimir informações de conferência do fornecedor"
                            @click="ImprimirInformacoesFornecedor(data.item)"
                          >
                            <i class="fas fa-print"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(tipoFornecedor)="data">
                        <div class="center">
                          <span>{{
                            ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeConfirmada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeConfirmada)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeConferida)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeConferida)
                          }}</span>
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
      </div>
    </form>
    <b-modal
      v-model="modalRemoverConferencia"
      title="Confirmar exclusão conferência"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRemoverConferenciaOk"
      @hidden="ModalRemoverConferenciaCancel"
    >
      Você confirma a exclusão da conferência dos produtos desse fornecedor?
    </b-modal>
    <b-modal
      v-model="modalRecusarConferencia"
      title="Recusar conferência dos produtos deste fornecedor"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRecusarOk"
      @hidden="ModalRecusarCancel"
    >
      Ao recusar a conferência dos produtos, o pedido pode prosseguir sem os
      produtos do fornecedor. Confirma?
    </b-modal>
    <b-modal
      v-model="modalImpressao"
      title="Impressão"
      class="modal-info"
      ok-variant="info"
    >
      Rotina de impressão em desenvolvimento
    </b-modal>
    <b-modal
      v-model="modalConferirTodos"
      title="Confirmar conferência dos produtos deste fornecedor"
      class="modal-success"
      ok-variant="success"
      @ok="ModalConferirTodosOk"
      @hidden="ModalConferirTodosCancel"
    >
      Todos os produtos deste fornecedor entregues conforme quantidade
      confirmada? Confirma?
    </b-modal>
    <div v-if="EditarFornecedorProduto()">
      <ConferenciaFornecedorProduto
        :fornecedorId="this.fornecedorId"
        :pedidoId="this.pedidoId"
        :descricaoFornecedor="this.descricaoFornecedor"
        :rateioId="this.rateioId"
        :conferenciaId="this.conferenciaId"
        @atualizarFornecedor="atualizarFornecedor"
      >
      </ConferenciaFornecedorProduto>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoFornecedorServico from "../../servico/PedidoFornecedorServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import StatusRateioEnum from "../../enums/StatusRateioEnum";
import Bus from "../../util/EventBus";
import ConferenciaRateioServico from "../../servico/ConferenciaRateioServico";
import ConferenciaFornecedorProduto from "./ConferenciaFornecedorProduto";

export default {
  name: "ConferenciaFornecedor",
  emits: ["atualizarConferencia"],
  components: {
    RotateSquare,
    Bus,
    ConferenciaRateioServico,
    ConferenciaFornecedorProduto
  },
  props: {
    rateioId: { type: String, default: "" },
    conferenciaId: { type: String, default: "" }
  },
  data() {
    return {
      modalRemoverConferencia: false,
      modalRecusarConferencia: false,
      modalImpressao: false,
      modalConferirTodos: false,
      itemEdicao: null,
      fornecedorId: "",
      fornecedorOptions: [],
      abrir: false,
      editarProdutos: false,
      descricaoFornecedor: "",
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        nome: ""
      },
      itens: [],
      abrir: false,
      editarProdutos: false,
      descricaoFornecedor: "",
      fields: [
        { key: "pessoa", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },

        // { key: "quantidadeSolicitada", label: "Solicitado", sortable: true },
        // { key: "margemRateio", label: "% Rateio", sortable: true },
        // { key: "quantidadeAtendida", label: "Atendido", sortable: true },

        { key: "quantidadeConfirmada", label: "Confirmado", sortable: true },
        { key: "quantidadeConferida", label: "Conferido", sortable: true },
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
    this.ObterGrid(1);
  },
  watch: {
    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  created() {
    Bus.$on("rateio-efetuado", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
      this.$emit("atualizarConferencia");
    });

    Bus.$on("atualiza-fornecedores-rateio", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-rateio-produtor", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(pagina) {
      if (this.filtro.produto) {
        this.editarProdutos = false;
      }

      Bus.$emit("atualizar-produto-fornecedor");

      this.loading = false;

      PedidoFornecedorServico.ObterGridTotal(
        pagina,
        this.itensPorPagina,
        this.$store.getters.emptyGuid,
        this.rateioId,
        this.conferenciaId,
        this.filtro.nome,
        true
      )
        .then((resposta) => {
          this.editarProdutos = false;
          this.loading = false;
          this.itens = resposta.data.itens;
          this.total = resposta.data.total;
          this.itensPorPagina = resposta.data.itensPorPagina;
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
    ModalRemoverConferenciaCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRemoverConferenciaOk(evento) {
      evento.preventDefault();
      this.modalRemoverConferencia = false;
      if (!this.itemEdicao) return;

      ConferenciaRateioServico.RemoverConferenciaFornecedor(
        this.conferenciaId,
        this.itemEdicao.fornecedorId
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$emit("atualizarConferencia");
          this.$notify({
            data: [
              "Conferência para produtos do fornecedor excluídas com sucesso."
            ],
            type: "success",
            duration: 5000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    Remover(item) {
      this.modalRemoverConferencia = true;
      this.itemEdicao = item;
    },
    Limpar() {
      this.filtro.nome = "";
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    ObterNomeTipoFornecedor(item) {
      switch (item) {
        case TipoFornecedorEnum.Avulso:
          return "Avulso";
        case TipoFornecedorEnum.Cooperado:
          return "Cooperado";
        default:
          return "Inválido";
      }
    },
    EditarFornecedorProduto() {
      return this.editarProdutos;
    },

    switchAberturaProdutos() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProdutos = false;
      }
    },
    atualizarFornecedor() {
      this.ObterGrid(this.pagina);
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    RecusarConferenciaProdutosFornecedor(item) {
      this.modalRecusarConferencia = true;
      this.itemEdicao = item;
    },
    ModalRecusarCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRecusarOk(evento) {
      evento.preventDefault();
      this.modalRecusarConferencia = false;
      if (!this.itemEdicao) return;

      ConferenciaRateioServico.RecusarConferenciaFornecedor(
        this.conferenciaId,
        this.itemEdicao.fornecedorId
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$emit("atualizarConferencia");
          this.$notify({
            data: ["Produtos recusados pelo fornecedor com sucesso."],
            type: "success",
            duration: 5000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    ImprimirInformacoesFornecedor(item) {
      this.modalImpressao = true;
    },
    FornecedorComTelefoneCadastrado(item) {
      return item.telefone;
    },
    ConfirmarConferenciaProdutosFornecedor(item) {
      this.itemEdicao = item;
      this.modalConferirTodos = true;
    },
    ModalConferirTodosCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.modalConferirTodos = false;
    },
    ModalConferirTodosOk(evento) {
      evento.preventDefault();
      this.modalConferirTodos = false;

      evento.preventDefault();
      this.modalRecusarConferencia = false;
      if (!this.itemEdicao) return;

      ConferenciaRateioServico.ConfirmarConferenciaFornecedor(
        this.conferenciaId,
        this.itemEdicao.fornecedorId
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$emit("atualizarConferencia");
          this.$notify({
            data: ["Produtos confirmados pelo fornecedor com sucesso."],
            type: "success",
            duration: 5000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    EditarFornecedorProduto() {
      return this.editarProdutos;
    },
    SwitchEditarProdutos(item) {
      if (1 == 2 && this.pedidoId != item.pedidoId) {
        this.pedidoId = item.pedidoId;
        this.fornecedorId = item.fornecedorId;

        if (this.editarProdutos) {
          // PedidoFornecedorProduto.ObterFGrid(1);
        }

        this.editarProdutos = true;
      } else {
        this.pedidoId = item.pedidoId;
        this.fornecedorId = item.fornecedorId;
        this.editarProdutos = !this.editarProdutos;
        this.descricaoFornecedor = item.pessoa;
      }
    },
    switchAberturaProdutos() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProdutos = false;
      }
    },
    isFornecedorAvulso(item) {
      return item.tipoFornecedor == TipoFornecedorEnum.Avulso;
    },
    isRateioPendente(item) {
      return item.statusRateio == StatusRateioEnum.Incompleto;
    },
    isPedidoEmRotaDeEntrega() {
      return false;
    }
  }
};
</script>
