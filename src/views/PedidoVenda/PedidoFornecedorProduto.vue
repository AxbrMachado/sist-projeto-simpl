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
                  >Produtos - {{ this.descricaoFornecedor }}</strong
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
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas clientes presentes no pedido."
                  >
                    <label for>Presente no Fornecedor</label>
                    <b-form-checkbox
                      v-model="filtro.produtosNoFornecedor"
                      name="check-button"
                      switch
                    >
                    </b-form-checkbox>
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
                          <!-- <b-button
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar Quantidade"
                            @click="Edicao(data.item)"
                          >
                            <i class="fa fa-edit"></i>
                          </b-button> -->
                          <b-button
                            :disabled="!IsPedidoPendente(data.item)"
                            variant="danger"
                            title="Zerar Quantidade"
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
      v-model="modalRemover"
      title="Confirmar exclusão"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRemocaoOk"
      @hidden="ModalRemocaoCancel"
    >
      Confirma a remoção do produto desse cliente?
    </b-modal>
    <b-modal
      v-model="modalEdicao"
      title="Informar quantidade produto"
      class="modal-danger"
      ok-variant="info"
      @ok="ModalEdicaoOk"
      @hidden="ModalEdicaoCancel"
    >
      <div class="form-group">
        <label for>* Quantidade</label>
        <vue-numeric
          v-bind:precision="3"
          v-bind:minus="false"
          thousand-separator="."
          decimal-separator=","
          v-model="itemEdicaoQuantidade"
          class="form-control"
          placeholder="Digite a quantidade"
          required
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoProdutoFornecedorServico from "../../servico/PedidoProdutoFornecedorServico";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import Bus from "../../util/EventBus";

export default {
  name: "PedidoFornecedorProduto",
  emits: ["atualizarFornecedor"],
  components: {
    RotateSquare,
    Bus
  },
  props: {
    fornecedorId: { type: String, default: "" },
    pedidoId: { type: String, default: "" },
    descricaoFornecedor: { type: String, default: "" }
  },
  data() {
    return {
      modalEdicao: false,
      itemEdicao: null,
      itemEdicaoQuantidade: 0,
      modalRemover: false,
      produtoOptions: [],
      loading: false,
      abrir: true,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        produto: "",
        produtosNoFornecedor: false
      },
      itens: [],
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "valorUnitario", label: "Valor  Un.", sortable: true },
        { key: "valorTotal", label: "Valor  Total", sortable: true },
        {
          key: "quantidadeSolicitada",
          label: "Qtd. Atendida",
          sortable: true
        },
        // { key: "quantidadeAtendida", label: "Qtd. Atendida", sortable: true },
        // { key: "disponivel", label: "Disponivel", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true },
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
    Bus.$on("alterado-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
    Bus.$on("alterado-fornecedor-produto", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("remocao-produto-pedido", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-produto-cliente", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(val) {
      this.loading = false;
      this.itemEdicaoQuantidade = 0;
      this.itemEdicao = null;

      PedidoProdutoFornecedorServico.ObterGridFornecedor(
        val,
        this.itensPorPagina,
        this.pedidoId,
        this.fornecedorId,
        this.filtro.produto,
        this.filtro.produtosNoFornecedor,
        null
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
    ModalEdicaoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.itemEdicaoQuantidade = 0;
    },

    ModalEdicaoOk(evento) {
      evento.preventDefault();
      this.modalEdicao = false;

      if (!this.itemEdicao || !this.itemEdicaoQuantidade) return;

      //   PedidoProdutoFornecedorServico.EditarQuantidade(
      //     this.itemEdicao.id,
      //     this.itemEdicaoQuantidade
      //   )
      //     .then(() => {
      //       this.ObterGrid(1);
      //       this.$emit("atualizarFornecedor");
      //       //   Bus.$emit("alterado-produto-cliente");
      //       this.$notify({
      //         data: ["Quantidade definida com sucesso."],
      //         type: "success",
      //         duration: 5000
      //       });
      //     })
      //     .catch((erro) => {
      //       this.$notify({
      //         data: erro.response.data.erros,
      //         type: "warn",
      //         duration: 5000
      //       });
      //     });
    },

    ModalRemocaoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRemocaoOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;

      if (!this.itemEdicao) return;

      PedidoProdutoFornecedorServico.RemoverProdutoFornecedorPedido(
        this.itemEdicao.id
      )
        .then(() => {
          this.ObterGrid(1);
          this.$emit("atualizarFornecedor");
          Bus.$emit("remocao-produto-fornecedor");
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
      this.modalRemover = true;
      this.itemEdicao = item;
    },
    Edicao(item) {
      this.modalEdicao = true;
      this.itemEdicao = item;
      this.itemEdicaoQuantidade = item.quantidadeSolicitada;
    },
    Editar() {
      this.loading = false;

      //   PedidoProdutoFornecedorServico.Editar(this.itemEdicao)
      //     .then(() => {
      //       this.loading = false;
      //       this.Limpar();
      //       this.ObterGrid(1);
      //       this.$notify({
      //         data: ["Produto editado com sucesso."],
      //         type: "success",
      //         duration: 5000
      //       });
      //     })
      //     .catch((erro) => {
      //       this.loading = false;
      //       this.$notify({
      //         data: erro.response.data.erros,
      //         type: "warn",
      //         duration: 5000
      //       });
      //     });
    },
    Limpar() {
      this.filtro.produto = "";
      this.filtro.produtosNoFornecedor = false;
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    RemoverCifrao(valor) {
      if (valor) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    IsPedidoPendente(item) {
      return item.statusPedido == StatusPedidoEnum.Pendente;
    }
  }
};
</script>
