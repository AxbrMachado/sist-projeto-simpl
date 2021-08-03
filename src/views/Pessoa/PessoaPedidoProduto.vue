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
                  >Produtos - Pedido {{ this.descricaoPedido }}</strong
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
                      <template v-slot:cell(quantidadeAtendida)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeAtendida)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadePendente)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadePendente)
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
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PessoaPedidoProdutoServico from "../../servico/PessoaPedidoProdutoServico";
import Bus from "../../util/EventBus";

export default {
  name: "PessoaPedidoProduto",
  components: {
    RotateSquare,
    Bus
  },
  props: {
    pedidoId: { type: String, default: "" },
    pessoaId: { type: String, default: "" },
    descricaoPedido: { type: String, default: "" }
  },
  data() {
    return {
      produtoOptions: [],
      loading: false,
      abrir: true,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        produto: ""
      },
      itens: [],
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "valorUnitario", label: "Valor  Un.", sortable: true },
        { key: "valorTotal", label: "Valor  Total", sortable: true },
        {
          key: "quantidadeSolicitada",
          label: "Qtd. Solicitada",
          sortable: true
        },
        { key: "quantidadeAtendida", label: "Qtd. Atendida", sortable: true },
        { key: "quantidadePendente", label: "Qtd. Pendente", sortable: true },
        // { key: "disponivel", label: "Disponivel", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true }
        // {
        //   key: "acoes",
        //   label: "Ações",
        //   sortable: false,
        //   thClass: "center, wd-120-px"
        // }
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
    Bus.$on("remocao-produto-pedido", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(pagina) {
      this.loading = false;
      this.itemEdicaoQuantidade = 0;
      this.itemEdicao = null;

      PessoaPedidoProdutoServico.ObterGridProdutoPedidoCliente(
        pagina,
        this.itensPorPagina,
        this.pedidoId,
        this.pessoaId,
        this.filtro.produto
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
    Limpar() {
      this.filtro.produto = "";
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
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    }
  }
};
</script>
