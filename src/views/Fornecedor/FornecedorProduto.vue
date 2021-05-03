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
                  <div class="col">
                    <div class="form-group">
                      <small
                        >Campos com * são de preenchimento obrigatório</small
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Produto</label>
                      <v-select
                        placeholder="Digite um produto.."
                        v-model="viewModel.produto"
                        :options="produtoOptions"
                        required
                        @search="ObterProdutosVSelect"
                      >
                        <template slot="no-options">
                          Nenhum resultado para a busca.
                        </template>
                      </v-select>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Valor</label>
                      <currency-input
                        v-model="viewModel.valor"
                        class="form-control"
                        placeholder="Digite o valor"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Quantidade</label>
                      <vue-numeric
                        v-bind:precision="3"
                        v-bind:minus="false"
                        thousand-separator="."
                        decimal-separator=","
                        v-model="viewModel.quantidade"
                        class="form-control"
                        placeholder="Digite a quantidade"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="btn-toolbar mb-3" role="toolbar">
                  <div class="btn-group" role="group">
                    <button class="btn btn-success mr-2" type="submit">
                      Salvar
                    </button>
                  </div>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-secondary"
                      type="reset"
                      @click="abrir = !abrir"
                    >
                      Voltar
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
                      <template v-slot:cell(valor)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valor) }}</span>
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
import FornecedorProduto from "../../servico/FornecedorProdutoServico";

export default {
  name: "FornecedorProduto",
  components: { RotateSquare },
  props: {
    fornecedorId: {
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
      itensPorPagina: 5,
      itens: [],
      abrir: false,
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "quantidade", label: "Quantidade", sortable: true },
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
        fornecedorId: "",
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
    //let fornecedorId = this.$route.params.id;
    //if (fornecedorId) this.Obter(fornecedorId);
    // this.ObterProdutosSelect();
  },
  methods: {
    IsNovo() {
      return this.fornecedorId === this.$store.getters.emptyGuid;
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
      FornecedorProduto.Obter(id)
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
      FornecedorProduto.ObterGrid(val, this.itensPorPagina, this.fornecedorId)
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

      FornecedorProduto.Remover(this.itemRemover)
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
      this.viewModel.fornecedorId = this.fornecedorId;
      this.viewModel.produtoId = this.viewModel.produto.id;
      FornecedorProduto.Novo(this.viewModel)
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
      this.viewModel.fornecedorId = this.fornecedorId;
      this.viewModel.produtoId = this.viewModel.produto.id;
      FornecedorProduto.Editar(this.viewModel)
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
      this.viewModel.fornecedorId = "";
      this.viewModel.valor = 0;
      this.viewModel.quantidade = 0;
      this.viewModel.produto = {};
    },
    FormataValor(valor) {
      if (valor != null) {
        return valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      } else {
        return valor;
      }
    },
    RemoverCifrao(valor) {
      if (valor != null) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
    },
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
