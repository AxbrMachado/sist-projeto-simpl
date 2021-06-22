<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else @submit="ValidarForm">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="abrir = !abrir">
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
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas licitações vencidas."
                  >
                    <label for>Presente no Pedido</label>
                    <b-form-checkbox
                      v-model="filtro.produtosNoPedido"
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
                            variant="warning"
                            style="margin-right: 10px"
                            title="Editar"
                            @click="Obter(data.item.id)"
                          >
                            <i class="fa fa-edit text-black"></i>
                          </b-button>
                          <b-button
                            variant="danger"
                            title="Remover"
                            @click="Remover(data.item.id)"
                          >
                            <i class="fas fa-trash-alt text-black"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorPedido)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorPedido) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorUnitario)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorUnitario)
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
      @ok="ModalOk"
      @hidden="ModalCancel"
    >
      Você confirma a exclusão desse registro?
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoProdutoServico from "../../servico/PedidoProdutoServico";
import PedidoProdutoClienteServico from "../../servico/PedidoProdutoClienteServico";

export default {
  components: { RotateSquare },
  props: {
    pedidoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      produtoOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 10,
      filtro: {
        produto: "",
        produtosNoPedido: false
      },
      itens: [],
      abrir: false,
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "valorUnitario", label: "Valor Un.", sortable: true },
        { key: "quantidadeSolicitada", label: "Quantidade", sortable: true },
        { key: "valorPedido", label: "Valor Total", sortable: true },
        { key: "disponivel", label: "Disponivel", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true }
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
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  created() {
    //let pedidoId = this.$route.params.id;
    //if (pedidoId) this.Obter(pedidoId);
    // this.ObterProdutosSelect();
  },
  methods: {
    IsNovo() {
      return this.pedidoId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {
      evt.preventDefault();

      if (!this.viewModel.produto || this.viewModel.produto.id == undefined) {
        this.loading = false;
        this.$notify({
          data: ["Informe um produto."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = true;
      PedidoProdutoServico.Obter(id)
        .then((resposta) => {
          this.loading = false;
          //resposta.data.validade = DateTime.formatar(resposta.data.validade);
          this.viewModel = resposta.data;
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
    ObterGrid(val) {
      this.loading = true;

      PedidoProdutoClienteServico.ObterGridTotal(
        val,
        this.itensPorPagina,
        this.pedidoId,
        this.filtro.produto,
        this.filtro.produtosNoPedido
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
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      PedidoProdutoServico.Remover(this.itemRemover)
        .then(() => {
          this.ObterGrid(1);
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
    Remover(id) {
      this.modalRemover = true;
      this.itemRemover = id;
    },
    Novo() {
      this.loading = true;
      this.viewModel.pedidoId = this.pedidoId;
      this.viewModel.produtoId = this.viewModel.produto.id;
      PedidoProdutoServico.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Produto cadastrado com sucesso."],
            type: "success",
            duration: 5000
          });
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
    Editar() {
      this.loading = true;
      this.viewModel.pedidoId = this.pedidoId;
      this.viewModel.produtoId = this.viewModel.produto.id;
      PedidoProdutoServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Produto editado com sucesso."],
            type: "success",
            duration: 5000
          });
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
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.produtoId = "";
      this.viewModel.pedidoId = "";
      this.viewModel.valor = 0;
      this.viewModel.quantidade = 0;
      this.viewModel.produto = {};
      this.filtro.props = "";
      this.filtro.produtosNoPedido = false;
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
      if (valor != null) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
    },
    // ObterProdutosSelect() {
    //   this.$http({
    //     url: "/produto/obter-select",
    //     method: "GET"
    //   })
    //     .then((response) => {
    //       this.produtoOptions = response.data;
    //     })
    //     .catch((erro) => {
    //       this.$notify({
    //         data: erro.response.data.erros,
    //         type: "warn",
    //         duration: 5000
    //       });
    //     });
    // },
    ObterProdutosVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      this.$http({
        url: "/produto/obter-v-select/" + busca,
        method: "GET"
      })
        .then((response) => {
          this.produtoOptions = response.data;
        })
        .catch((erro) => {
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
