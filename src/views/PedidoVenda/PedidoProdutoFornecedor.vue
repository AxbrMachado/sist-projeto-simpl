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
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas clientes presentes no pedido."
                  >
                    <label for>Presente no Produto</label>
                    <b-form-checkbox
                      v-model="filtro.fornecedorComProduto"
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
                          <b-button
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar Quantidade"
                            @click="Edicao(data.item)"
                          >
                            <i class="fa fa-edit"></i>
                          </b-button>
                          <b-button
                            variant="danger"
                            title="Zerar Quantidade"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                            <!-- <i class="fa fa-edit"></i> -->
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
                            ObterTipoFornecedor(data.item.tipoFornecedor)
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
                      <template v-slot:cell(quantidadaAtendida)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadaAtendida)
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
      v-model="modalRemover"
      title="Confirmar exclusão"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRemocaoOk"
      @hidden="ModalRemocaoCancel"
    >
      Confirma a remoção do produto desse fornecedor?
    </b-modal>
    <b-modal
      v-model="modalEdicao"
      title="Quantidade produto atendida pelo fornecedor"
      class="modal-danger"
      ok-variant="info"
      @ok="ModalEdicaoOk"
      @hidden="ModalEdicaoCancel"
    >
      <div class="form-group">
        <label for>* Quantidade Atendida</label>
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
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import Bus from "../../util/EventBus";

export default {
  name: "PedidoProdutoFornecedor",
  emits: ["atualizarproduto"],
  components: {
    RotateSquare,
    Bus
  },
  props: {
    pedidoProdutoId: { type: String, default: "" },
    descricaoProduto: { type: String, default: "" }
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
        fornecedor: "",
        fornecedorComProduto: false
      },
      itens: [],
      fields: [
        { key: "fornecedor", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo", sortable: true },
        { key: "valorLimite", label: "Limite Contrato", sortable: true },
        // { key: "valorConsumido", label: "Valor Consumido", sortable: true },
        { key: "valorPedido", label: "Valor Pedido", sortable: true },
        { key: "quantidadePedido", label: "Qtd. Total Pedido", sortable: true },
        { key: "quantidadaAtendida", label: "Qtd. Atendida", sortable: true },
        {
          key: "quantidadeConfirmada",
          label: "Qtd. Confirmada",
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
    Bus.$on("alterado-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("remocao-produto-pedido", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-produto-cliente", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("remocao-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(val) {
      this.loading = false;
      this.itemEdicaoQuantidade = 0;
      this.itemEdicao = null;

      PedidoProdutoFornecedorServico.ObterGridProduto(
        val,
        this.itensPorPagina,
        this.pedidoProdutoId,
        this.filtro.fornecedor,
        this.filtro.fornecedorComProduto
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

      if (this.itemEdicaoQuantidade > this.itemEdicao.quantidadePedido) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade maior que a solicitada no pedido."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      PedidoProdutoFornecedorServico.EditarQuantidade(
        this.itemEdicao.id,
        this.itemEdicaoQuantidade
      )
        .then(() => {
          this.ObterGrid(1);
          this.$emit("atualizarproduto");
          Bus.$emit("alterado-produto-cliente");
          Bus.$emit("alterado-fornecedor-produto");
          this.$notify({
            data: ["Quantidade definida com sucesso."],
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

    ModalRemocaoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRemocaoOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;

      if (!this.itemEdicao) return;

      PedidoProdutoFornecedorServico.EditarQuantidade(this.itemEdicao.id, 0)
        .then(() => {
          this.ObterGrid(1);
          this.$emit("atualizarproduto");
          Bus.$emit("alterado-produto-cliente");
          this.$notify({
            data: ["Quantidade removida com sucesso."],
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
      this.itemEdicaoQuantidade = item.quantidadaAtendida;
    },
    Limpar() {
      this.filtro.fornecedor = "";
      this.filtro.fornecedorComProduto = false;
    },
    FormataValor(valor) {
      if (valor) {
        return valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      } else {
        return (0.0).toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }
    },
    RemoverCifrao(valor) {
      if (valor) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
    },
    ObterTipoFornecedor(item) {
      switch (item) {
        case TipoFornecedorEnum.Cooperado:
          return "Cooperado";
        case TipoFornecedorEnum.Avulso:
          return "Avulso";
        default:
          return "Inválido";
      }
    },
    FormataQuantidade(valor) {
      if (valor != null) {
        return valor;
      } else {
        return 0;
      }
    }
  }
};
</script>
