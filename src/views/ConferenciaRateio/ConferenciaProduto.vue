<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="switchAbertura()">
              <!-- <header class="card-header" @click="abrir = !abrir"> -->
              <div class="d-flex">
                <strong class="align-self-center">Produtos(s)</strong>
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
                            variant="info"
                            style="margin-right: 10px"
                            title="Visualizar fornecedores do produto"
                            @click="SwitchVisualizarFornecedor(data.item)"
                          >
                            <i class="fas fa-cart-plus"></i>
                          </b-button>

                          <b-button
                            :disabled="isRateioConferindo()"
                            variant="primary"
                            style="margin-right: 10px"
                            title="Confirmar produto no rateio"
                            @click="ConfirmarAtendimentoProduto(data.item)"
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </b-button>

                          <b-button
                            :disabled="isRateioConferindo()"
                            variant="secondary"
                            style="margin-right: 10px"
                            title="Recusar produto no rateio"
                            @click="RecusarProdutosFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-down"></i>
                          </b-button>

                          <b-button
                            :disabled="isRateioConferindo()"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Remover produtos atendidos"
                            @click="RemoverAtendimento(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </b-button>
                          <b-button
                            :disabled="isRateioConferindo()"
                            variant="dark"
                            title="Imprimir informações produto rateio"
                            @click="ImprimirInformacoesFornecedor(data.item)"
                          >
                            <i class="fas fa-print"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeSolicitada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeSolicitada)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(margemRateio)="data">
                        <div class="left">
                          <span>{{
                            FormataValorMargemRateio(data.item.margemRateio)
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
      Você confirma a exclusão do atendimento desse produto no rateio?
    </b-modal>
    <b-modal
      v-model="modalProdutoDesignado"
      title="Definir Produto Designado"
      class="modal-danger"
      ok-variant="info"
      @ok="modalProdutoDesignadoOk"
      @hidden="modalProdutoDesignadoCancel"
    >
      <div v-if="ProdutoDesignadoDefinido()">
        <div>
          <button
            class="btn btn-danger mr-2"
            type="button"
            @click="RemoveProdutoDesignado()"
          >
            Remover Produto Designado
          </button>
        </div>
        <br />
      </div>
      <div class="row">
        <div class="col-lg-5 col-md-6 col-sm-12">
          <div class="form-group">
            <label>Produto</label>
            <input
              disabled
              type="text"
              v-model="itemDescricaoProdutoOrigem"
              class="form-control"
            />
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for>Quantidade Solicitada</label>
            <vue-numeric
              disabled
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="itemQuantidadeSolicitada"
              class="form-control"
              placeholder="Digite a quantidade"
              requerid
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-12">
          <div class="form-group">
            <br />
            <label for>Informações do produto designado</label>
            <br />
            <br />
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
                <div class="form-group">
                  <label for>Qtd. Designada</label>
                  <vue-numeric
                    v-bind:precision="3"
                    v-bind:minus="false"
                    thousand-separator="."
                    decimal-separator=","
                    v-model="itemQuantidadeProdutoDesignada"
                    class="form-control"
                    placeholder=""
                    requerid
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-10">
                <div class="form-group">
                  <label for>Produto</label>
                  <v-select
                    placeholder=""
                    v-model="itemProdutoDesignado"
                    :options="produtosDesignadosOptions"
                    @search="ObterProdutosDesignadosVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
                <div class="form-group">
                  <label for>Qtd. Designada Equivalente</label>
                  <vue-numeric
                    disabled
                    v-bind:precision="3"
                    v-bind:minus="false"
                    thousand-separator="."
                    decimal-separator=","
                    v-model="itemQuantidadeSolicitadaEquivalente"
                    class="form-control"
                    placeholder=""
                    requerid
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
                <div class="form-group">
                  <label for>Valor Equivalente</label>
                  <currency-input
                    disabled
                    v-model="itemValorQuantidadeDesignada"
                    class="form-control"
                    placeholder="Digite o valor do contrato para este fornecedor"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="modalRecusar"
      title="Recusar produtos pedido para fornecedor"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRecusarOk"
      @hidden="ModalRecusarCancel"
    >
      Recusar atendimento do produto dos fornecedores designados para
      atendimento. Ao recusar esses fornecedores não irão mais atender esse
      produto nesse pedido. Confirma?
    </b-modal>
    <b-modal
      v-model="modalAtenderTodos"
      title="Confirmar produtos pedido para fornecedor"
      class="modal-success"
      ok-variant="success"
      @ok="ModalAtenderTodosOk"
      @hidden="ModalAtenderTodosCancel"
    >
      Confirmar atendimento de produtos via fornecedores rateados. Confirma?
    </b-modal>
    <b-modal
      v-model="modalImpressao"
      title="Impressão"
      class="modal-info"
      ok-variant="info"
    >
      Rotina de impressão em desenvolvimento
    </b-modal>
    <div v-if="VisualizarFornecedorProduto()">
      <ConferenciaProdutoFornecedor
        :pedidoProdutoId="this.pedidoProdutoId"
        :descricaoProduto="this.descricaoProduto"
        :conferenciaId="this.conferenciaId"
        @atualizarproduto="atualizarproduto"
      >
      </ConferenciaProdutoFornecedor>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoProdutoServico from "../../servico/PedidoProdutoServico";
import Bus from "../../util/EventBus";
import ProdutoServico from "../../servico/ProdutoServico";
import RateioServico from "../../servico/RateioServico";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import ConferenciaProdutoFornecedor from "./ConferenciaProdutoFornecedor.vue";

export default {
  name: "ConferenciaProduto",
  emits: ["atualizarRateio"],
  components: {
    RotateSquare,
    Bus,
    ConferenciaProdutoFornecedor,
    ProdutoServico
  },
  props: {
    pedidoId: { type: String, default: "" },
    rateioId: { type: String, default: "" },
    conferenciaId: { type: String, default: "" }
  },
  data() {
    return {
      modalProdutoDesignado: false,
      modalRemoverAtendimento: false,
      modalRecusar: false,
      modalAtenderTodos: false,
      modalImpressao: false,
      itemQuantidadeSolicitada: 0,
      itemQuantidadeSolicitadaEquivalente: 0,
      itemDescricaoProdutoOrigem: "",
      itemQuantidadeProdutoDesignada: 0,
      itemValorQuantidadeDesignada: 0,
      itemEdicao: null,
      itemProdutoDesignado: "",
      produtosDesignadosOptions: [],
      modalRemoverAtendimento: false,
      itemRemover: null,
      produtoOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        produto: ""
      },
      itens: [],
      abrir: false,
      editarFornecedor: false,
      descricaoProduto: "",
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true },
        { key: "quantidadeSolicitada", label: "Solicitado", sortable: true },
        { key: "margemRateio", label: "% Rateio", sortable: true },
        { key: "quantidadeAtendida", label: "Atendido", sortable: true },
        { key: "quantidadeConfirmada", label: "Confirmado", sortable: true },
        { key: "quantidadeConferida", label: "Conferido", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        produtoId: "",
        produto: {},
        pedidoId: "",
        valor: 0,
        quantidade: 0
      }
    };
  },
  mounted() {
    this.ObterGrid(1);
  },
  watch: {
    itemQuantidadeProdutoDesignada: function () {
      this.buscaEquivalenciaProdutoDesignado();
    },

    itemProdutoDesignado: function () {
      this.buscaEquivalenciaProdutoDesignado();
    },

    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  created() {
    Bus.$on("atualizar-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
    Bus.$on("alterado-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
    Bus.$on("rateio-efetuado", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(val) {
      this.loading = false;
      this.modalProdutoDesignado = false;

      if (this.filtro.produto) {
        this.editarFornecedor = false;
      }

      PedidoProdutoServico.ObterGridTotal(
        val,
        this.itensPorPagina,
        this.$store.getters.emptyGuid,
        this.rateioId,
        this.conferenciaId,
        this.filtro.produto,
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
      this.itemRemover = item;
    },
    ModalRemoverAtendimentoCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalRemoverAtendimentoOk(evento) {
      evento.preventDefault();
      this.modalRemoverAtendimento = false;
      if (!this.itemRemover.id) return;

      RateioServico.RemoverAtendimentoProdutoRateio(this.itemRemover.id)
        .then(() => {
          this.ObterGrid(1);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
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
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.produtoId = "";
      this.viewModel.pedidoId = "";
      this.viewModel.valor = 0;
      this.viewModel.quantidade = 0;
      this.viewModel.produto = {};
      this.filtro.produto = "";
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    VisualizarFornecedorProduto() {
      return this.editarFornecedor;
    },
    SwitchVisualizarFornecedor(item) {
      if (1 == 2 && this.pedidoProdutoId != item.id) {
        this.pedidoProdutoId = item.id;

        if (this.editarFornecedor) {
          // PedidoClienteProduto.ObterFGrid(1);
        }

        this.editarFornecedor = true;
      } else {
        this.pedidoProdutoId = item.id;
        this.editarFornecedor = !this.editarFornecedor;
        this.descricaoProduto = item.produto;
      }
    },
    switchAbertura() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarFornecedor = false;
      }
    },
    atualizarproduto() {
      this.ObterGrid(this.pagina);
      this.$emit("atualizarRateio");
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    FormataQuantidadePendente(item) {
      return item.quantidadeSolicitada - item.quantidadeAtendidaSemMargem;
    },
    FormataValorMargemRateio(valor) {
      return valor ? valor + "%" : "-";
    },
    edicaoProdutoDesignado(item) {
      this.modalProdutoDesignado = true;
      this.itemEdicao = item;
      this.itemQuantidadeSolicitadaEquivalente =
        item.quantidadeProdutoDesignadoEquivalente ?? 0;
      this.itemValorQuantidadeDesignada = item.valorProdutoDesignado ?? 0;

      this.itemProdutoDesignado = item.produtoDesignado;
      this.itemQuantidadeSolicitada = item.quantidadeSolicitada ?? 0;
      this.itemDescricaoProdutoOrigem = item.produto;
      this.itemQuantidadeProdutoDesignada =
        item.quantidadeProdutoDesignado ?? 0;
    },
    modalProdutoDesignadoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.itemQuantidadeSolicitada = 0;
      this.itemQuantidadeSolicitadaEquivalente = 0;
      this.itemQuantidadeProdutoDesignada = 0;
      this.itemValorQuantidadeDesignada = 0;
      this.itemProdutoDesignado = "";
      this.itemDescricaoProdutoOrigem = "";
      this.produtosDesignadosOptions = [];
    },

    modalProdutoDesignadoOk(evento) {
      evento.preventDefault();

      if (!this.itemEdicao) return;

      if (!this.itemQuantidadeProdutoDesignada) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade desginada deve ser informada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (
        this.itemQuantidadeProdutoDesignada >
        this.itemEdicao.quantidadeSolicitada
      ) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade designada maior que a solicitada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (!this.itemProdutoDesignado) {
        this.loading = false;
        this.$notify({
          data: ["Produto designado deve ser informado."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      this.modalProdutoDesignado = false;

      PedidoProdutoServico.DefinirProdutoDesignado(
        this.itemEdicao.id,
        this.itemQuantidadeProdutoDesignada,
        this.itemQuantidadeSolicitadaEquivalente,
        this.itemProdutoDesignado.id,
        this.itemValorQuantidadeDesignada
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
          this.$notify({
            data: ["Produto designado definido com sucesso."],
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
    produtoSolicitado(item) {
      return item.quantidadeSolicitada ? true : false;
    },
    ObterProdutosDesignadosVSelect(descricao) {
      if (!descricao || descricao.length <= 2) return;

      if (
        this.itemQuantidadeProdutoDesignada >
        this.itemEdicao.quantidadeSolicitada
      ) {
        this.loading = false;
        this.itemProdutoDesignado = "";
        this.produtosDesignadosOptions = [];

        this.$notify({
          data: ["Quantidade designada maior que quantidade solicitada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (!this.itemQuantidadeProdutoDesignada) {
        this.loading = false;
        this.itemProdutoDesignado = "";
        this.produtosDesignadosOptions = [];
        this.$notify({
          data: ["Quantidade designada não informada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      ProdutoServico.ObterVSelectProdutoDesignado(
        descricao,
        this.itemEdicao.contratoId,
        this.itemEdicao.produtoId,
        this.itemQuantidadeProdutoDesignada
      )
        .then((response) => {
          this.produtosDesignadosOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    buscaEquivalenciaProdutoDesignado() {
      if (this.itemQuantidadeProdutoDesignada && this.itemProdutoDesignado) {
        PedidoProdutoServico.ObterEquivalenciaProdutoDesignado(
          this.itemEdicao.produtoId,
          this.itemQuantidadeProdutoDesignada,
          this.itemProdutoDesignado.id,
          this.itemEdicao.contratoId
        )
          .then((resposta) => {
            this.loading = false;
            this.itemQuantidadeSolicitadaEquivalente =
              resposta.data.quantidadeProdutoDesignadoEquivalente;
            this.itemValorQuantidadeDesignada =
              resposta.data.valorProdutoDesignado;
          })
          .catch((erro) => {
            this.loading = false;
            this.$notify({
              data: erro.response.data.erros,
              type: "warn",
              duration: 5000
            });
          });
      } else {
        this.itemQuantidadeSolicitadaEquivalente = 0;
        this.itemValorQuantidadeDesignada = 0;
      }
    },
    ProdutoDesignadoDefinido() {
      return this.itemEdicao && this.itemEdicao.produtoDesignado;
    },
    RemoveProdutoDesignado() {
      PedidoProdutoServico.RemoverProdutoDesignado(this.itemEdicao.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
          this.$notify({
            data: ["Produto designado removido com sucesso."],
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
    IsPedidoPendente(item) {
      return item.statusPedido == StatusPedidoEnum.Pendente;
    },
    RecusarProdutosFornecedor(item) {
      this.modalRecusar = true;
      this.itemEdicao = item;
    },
    ModalRecusarCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRecusarOk(evento) {
      evento.preventDefault();
      this.modalRecusar = false;
      if (!this.itemEdicao) return;

      RateioServico.RecusarAtendimentoProdutoRateio(this.itemEdicao.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
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
    ConfirmarAtendimentoProduto(item) {
      this.itemEdicao = item;
      this.modalAtenderTodos = true;
    },
    ModalAtenderTodosCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.modalAtenderTodos = false;
    },
    ModalAtenderTodosOk(evento) {
      evento.preventDefault();
      this.modalAtenderTodos = false;

      evento.preventDefault();
      this.modalRecusar = false;
      if (!this.itemEdicao) return;

      RateioServico.ConfirmarAtendimentoProdutoRateio(this.itemEdicao.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-rateio-produto");
          this.$emit("atualizarRateio");
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
    ImprimirInformacoesFornecedor(item) {
      this.modalImpressao = true;
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
