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
            <header class="card-header" @click="abrir = !abrir">
              <div class="d-flex">
                <strong class="align-self-center"
                  >Produto - {{ this.descricaoFornecedor }}</strong
                >
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
                      <label>Produto</label>
                      <input
                        type="text"
                        v-model="filtro.produto"
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
                      empty-text="Nenhum produto encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <b-button
                            v-if="1 == 1"
                            :disabled="isConferenciaFinalizada()"
                            variant="primary"
                            style="margin-right: 10px"
                            title="Confirmar conferência"
                            @click="ConfirmarProdutoFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </b-button>

                          <b-button
                            v-if="1 == 1"
                            :disabled="isConferenciaFinalizada()"
                            variant="secondary"
                            style="margin-right: 10px"
                            title="Recusar conferência"
                            @click="RecusarProdutoFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-down"></i>
                          </b-button>
                          <b-button
                            v-if="1 == 1"
                            :disabled="isConferenciaFinalizada()"
                            variant="danger"
                            title="Remover conferência"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                            <!-- <i class="fa fa-edit"></i> -->
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorUnitario)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorUnitario)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorTotal)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorTotal) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeSolicitada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeSolicitada)
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
      v-model="modalExcluirConferencia"
      title="Confirmar exclusão"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalExcluirConferenciaOk"
      @hidden="ModalExcluirConferenciaCancel"
    >
      Ao excluir a conferência deste produto, a quantidade conferida é zerada.
      Confirma?
    </b-modal>
    <b-modal
      v-model="modalRecusarConferencia"
      title="Recusar conferência do produto"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRecusarConferenciaOk"
      @hidden="ModalRecusarConferenciaCancel"
    >
      Recusar conferência. A entrega passa a não contar com a quantidade deste
      produto. Confirma?
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
      v-model="modalConfirmarConferencia"
      title="Confirmar conferência produto"
      class="modal-success"
      ok-variant="success"
      @ok="ModalConfirmarConferenciaOk"
      @hidden="ModalConfirmarConferenciaCancel"
    >
      A quantidade conferida deste produto é a quantidade que efetivamente fará
      parte da entrega do pedido. Confirma?

      <br />
      <br />
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for>* Quantidade Conferida</label>
            <vue-numeric
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="itemEdicaoQuantidadeConferida"
              class="form-control"
              placeholder="Quantidade conferida"
              required
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import ConferenciaRateioServico from "../../servico/ConferenciaRateioServico";
import PedidoProdutoFornecedorServico from "../../servico/PedidoProdutoFornecedorServico";
import ContatoServico from "../../servico/ContatoServico";
import Bus from "../../util/EventBus";

export default {
  name: "ConferenciaFornecedorProduto",
  emits: ["atualizarFornecedor"],
  components: {
    RotateSquare,
    Bus,
    ContatoServico
  },
  props: {
    fornecedorId: { type: String, default: "" },
    pedidoId: { type: String, default: "" },
    descricaoFornecedor: { type: String, default: "" },
    rateioId: { type: String, default: "" },
    conferenciaId: { type: String, default: "" }
  },
  data() {
    return {
      modalExcluirConferencia: false,
      modalRecusarConferencia: false,
      modalConfirmarConferencia: false,
      itemEdicao: null,
      itemEdicaoQuantidadeConferida: 0,
      modalImpressao: false,
      loading: false,
      abrir: true,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        produto: "",
        produtoNoRateio: true
      },
      itens: [],
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true },
        { key: "quantidadeAtendida", label: "Atendido", sortable: true },
        { key: "quantidadeConfirmada", label: "Confirmado", sortable: true },
        { key: "quantidadeConferida", label: "Conferido", sortable: true },
        { key: "quantidadeDesignada", label: "Designado", sortable: true },
        {
          key: "fornecedorDesignado.label",
          label: "Fornecedor Designado",
          sortable: true
        },
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
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  created() {
    Bus.$on("atualizar-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-rateio-produtor", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(val) {
      this.loading = false;
      this.itemEdicao = null;
      this.modalEdicao = false;

      PedidoProdutoFornecedorServico.ObterGridFornecedor(
        val,
        this.itensPorPagina,
        this.pedidoId,
        this.fornecedorId,
        this.filtro.produto,
        this.filtro.produtoNoRateio,
        this.rateioId
      )
        .then((resposta) => {
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
    ModalExcluirConferenciaCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalExcluirConferenciaOk(evento) {
      evento.preventDefault();
      this.modalExcluirConferencia = false;

      if (!this.itemEdicao) return;

      ConferenciaRateioServico.RemoverConferenciaProdutoFornecedor(
        this.itemEdicao.id
      )
        .then(() => {
          this.ObterGrid(1);
          this.$emit("atualizarFornecedor");
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produto removido com sucesso."],
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
      this.modalExcluirConferencia = true;
      this.itemEdicao = item;
    },
    Limpar() {
      this.filtro.produto = "";
      this.filtro.produtoNoRateio = true;
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    AtendeProduto(item) {
      return item.quantidadeAtendida;
    },
    RecusarProdutoFornecedor(item) {
      this.modalRecusarConferencia = true;
      this.itemEdicao = item;
    },
    ModalRecusarConferenciaCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRecusarConferenciaOk(evento) {
      evento.preventDefault();
      this.modalRecusarConferencia = false;
      if (!this.itemEdicao) return;

      ConferenciaRateioServico.RecusarConferenciaProdutoFornecedor(
        this.itemEdicao.id
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produto recusado pelo fornecedor com sucesso."],
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
    ConfirmarProdutoFornecedor(item) {
      this.itemEdicao = item;
      this.modalConfirmarConferencia = true;
    },
    ModalConfirmarConferenciaCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.modalConfirmarConferencia = false;
    },
    ModalConfirmarConferenciaOk(evento) {
      evento.preventDefault();

      evento.preventDefault();
      if (!this.itemEdicao) return;

      if (!this.itemEdicaoQuantidadeConferida) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade conferida deve ser informada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (
        this.itemEdicaoQuantidadeConferida > this.itemEdicao.quantidadeAtendida
      ) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade conferida maior que quantidade atendida."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      this.modalConfirmarConferencia = false;

      ConferenciaRateioServico.ConfirmarConferenciaProdutoFornecedor(
        this.itemEdicao.id,
        this.itemEdicaoQuantidadeConferida
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produto confirmado pelo fornecedor com sucesso."],
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
    ConfirmarProdutoFornecedor(item) {
      this.itemEdicao = item;
      this.modalConfirmarConferencia = true;
      this.itemEdicaoQuantidadeConferida = item.quantidadeConfirmada
        ? item.quantidadeConfirmada
        : item.quantidadeConfirmadaAnterior
        ? item.quantidadeConfirmadaAnterior
        : item.quantidadeAtendida;
    },
    RecusarProdutoFornecedor(item) {
      this.modalRecusarConferencia = true;
      this.itemEdicao = item;
    },
    IsFornecedorAvulso(item) {
      return item.fornecedorAvulso;
    },
    isConferenciaFinalizada() {
      return false;
      return (
        !(this.conferenciaId == null || this.conferenciaId == undefined) &&
        this.conferenciaId.toString().length == 36
      );
    }
  }
};
</script>
