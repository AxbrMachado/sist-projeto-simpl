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
                  >Fornecedores - {{ this.descricaoProduto }}</strong
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
                      <label>Fornecedor</label>
                      <input
                        type="text"
                        v-model="filtro.fornecedor"
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
                            :disabled="isRateioConferindo()"
                            variant="primary"
                            style="margin-right: 10px"
                            title="Confirmar atendimento do produto para este fornecedor?"
                            @click="
                              ConfirmarAtendimentoProdutoFornecedor(data.item)
                            "
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </b-button>

                          <b-button
                            :disabled="isRateioConferindo()"
                            variant="secondary"
                            style="margin-right: 10px"
                            title="Recusar atendimento do produto neste rateio para este fornecedor"
                            @click="
                              RecusarAtendimentoProdutoFornecedor(data.item)
                            "
                          >
                            <i class="fas fa-thumbs-down"></i>
                          </b-button>

                          <b-button
                            :disabled="isRateioConferindo()"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Remover produto atendidos"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorLimite)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorLimite) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorConsumido)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorConsumido)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorPedido)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorPedido) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(tipoFornecedor)="data">
                        <div class="center">
                          <span>{{
                            ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadePedido)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadePedido)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeAtendida)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeAtendida)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeDesignada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeDesignada)
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
      v-model="modalRemoverAtendimento"
      title="Confirmar exclusão"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRemoverAtendimentoOk"
      @hidden="ModalRemoverAtendimentoCancel"
    >
      Você confirma a exclusão do atendimento desse produto por este fornecedor
      no rateio?
    </b-modal>
    <b-modal
      v-model="modalRecusarAtendimento"
      title="Recusar atendimento do produto para fornecedor"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRecusarAtendimentoOk"
      @hidden="ModalRecusarAtendimentoCancel"
    >
      Ao recusar o atendimento deste produto para o fornecedor, o mesmo passa a
      não participar mais do rateio automático deste produto no pedido.
      Confirma?
    </b-modal>
    <b-modal
      v-model="modalConfirmarAtendimentoProduto"
      title="Confirmar produtos pedido para fornecedor"
      class="modal-success"
      ok-variant="success"
      @ok="ModalConfirmarAtendimentoProdutoOk"
      @hidden="ModalConfirmarAtendimentoProdutoCancel"
    >
      Confirmar atendimento do produto para este fornecedor?
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoProdutoFornecedorServico from "../../servico/PedidoProdutoFornecedorServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import RateioServico from "../../servico/RateioServico";
import Bus from "../../util/EventBus";

export default {
  name: "RateioProdutoFornecedor",
  emits: ["atualizarproduto"],
  components: {
    RotateSquare,
    Bus
  },
  props: {
    pedidoProdutoId: { type: String, default: "" },
    descricaoProduto: { type: String, default: "" },
    rateioId: { type: String, default: "" },
    conferenciaId: { type: String, default: "" }
  },
  data() {
    return {
      modalRecusarAtendimento: false,
      modalConfirmarAtendimentoProduto: false,
      itemEdicao: null,
      modalRemoverAtendimento: false,
      produtoOptions: [],
      loading: false,
      abrir: true,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        fornecedor: ""
      },
      itens: [],
      fields: [
        { key: "fornecedor", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },
        { key: "quantidadeAtendida", label: "Qtd. Atendida", sortable: true },
        {
          key: "quantidadeConfirmada",
          label: "Qtd. Confirmada",
          sortable: true
        },
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
    Bus.$on("rateio-efetuado", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(val) {
      this.loading = false;
      this.itemEdicao = null;

      PedidoProdutoFornecedorServico.ObterGridProduto(
        val,
        this.itensPorPagina,
        this.pedidoProdutoId,
        this.filtro.fornecedor,
        true
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
    RemoverAtendimento(item) {
      this.modalRemoverAtendimento = true;
      this.itemEdicao = item;
    },
    ModalRemoverAtendimentoOk(evento) {
      evento.preventDefault();
      this.modalRemoverAtendimento = false;
      if (!this.itemEdicao.id) return;

      RateioServico.RemoverAtendimentoProdutoFornecedorRateio(
        this.itemEdicao.pedidoProdutoId,
        this.itemEdicao.fornecedorId
      )
        .then(() => {
          this.ObterGrid(1);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
          this.$emit("atualizarproduto");
          this.$notify({
            data: ["Produtos removido com sucesso."],
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
    Limpar() {
      this.filtro.fornecedor = "";
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
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    ModalRemoverAtendimentoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    Remover(item) {
      this.modalRemoverAtendimento = true;
      this.itemEdicao = item;
    },
    ConfirmarAtendimentoProdutoFornecedor(item) {
      this.itemEdicao = item;
      this.modalConfirmarAtendimentoProduto = true;
    },
    ModalConfirmarAtendimentoProdutoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.modalConfirmarAtendimentoProduto = false;
    },
    ModalConfirmarAtendimentoProdutoOk(evento) {
      evento.preventDefault();
      this.modalConfirmarAtendimentoProduto = false;

      evento.preventDefault();
      this.modalRecusarAtendimento = false;
      if (!this.itemEdicao) return;

      RateioServico.ConfirmarAtendimentoProdutoFornecedorRateio(
        this.itemEdicao.pedidoProdutoId,
        this.itemEdicao.fornecedorId
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
          this.$emit("atualizarproduto");
          this.$notify({
            data: ["Atendimento do produto confirmado com sucesso."],
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
    RecusarAtendimentoProdutoFornecedor(item) {
      this.modalRecusarAtendimento = true;
      this.itemEdicao = item;
    },
    ModalRecusarAtendimentoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRecusarAtendimentoOk(evento) {
      evento.preventDefault();
      this.modalRecusarAtendimento = false;
      if (!this.itemEdicao) return;

      RateioServico.RecusarAtendimentoProdutoFornecedorRateio(
        this.itemEdicao.pedidoProdutoId,
        this.itemEdicao.fornecedorId
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
          this.$emit("atualizarproduto");
          this.$notify({
            data: ["Atendimento do produto recusado com sucesso."],
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
    isRateioConferindo() {
      return (
        !(this.conferenciaId == null || this.conferenciaId == undefined) &&
        this.conferenciaId.toString().length == 36
      );
    }
  }
};
</script>
