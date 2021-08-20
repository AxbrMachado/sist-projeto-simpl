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
                <strong class="align-self-center">Fornecedores</strong>
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
                  <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                    <div class="form-group">
                      <label for>* Fornecedor</label>
                      <v-select
                        placeholder="Digite um fornecedor.."
                        v-model="viewModel.pessoa"
                        :options="fornecedorOptions"
                        required
                        @search="ObterFornecedoresVSelect"
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
                      empty-text="Nenhum fornecedor encontrado."
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
                            <i class="fa fa-edit"></i>
                          </b-button>
                          <b-button
                            variant="danger"
                            title="Remover"
                            @click="Remover(data.item.id)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valor)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valor) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(tipoFornecedor)="data">
                        <div class="center">
                          <span>{{
                            ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidade)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidade)
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
import ProdutoFornecedorServico from "../../servico/ProdutoFornecedorServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import PessoaServico from "../../servico/PessoaServico";

export default {
  components: { RotateSquare },
  props: {
    produtoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      fornecedorOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 5,
      itens: [],
      abrir: false,
      fields: [
        { key: "nome", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },
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
        valor: 0,
        quantidade: 0,
        pessoa: {}
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
    // this.ObterFornecedorsSelect();
  },
  methods: {
    IsNovo() {
      return this.produtoId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {
      evt.preventDefault();
      if (!this.viewModel.pessoa || this.viewModel.pessoa.id == undefined) {
        this.loading = false;
        this.$notify({
          data: ["Informe um fornecedor."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = false;
      ProdutoFornecedorServico.Obter(id)
        .then((resposta) => {
          this.loading = false;
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
      this.loading = false;
      ProdutoFornecedorServico.ObterGrid(
        val,
        this.itensPorPagina,
        this.produtoId
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

      ProdutoFornecedorServico.Remover(this.itemRemover)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Fornecedor removido com sucesso."],
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
      this.loading = false;
      this.viewModel.produtoId = this.produtoId;
      ProdutoFornecedorServico.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Fornecedor cadastrado com sucesso."],
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
      this.loading = false;
      this.viewModel.produtoId = this.produtoId;
      ProdutoFornecedorServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Fornecedor editado com sucesso."],
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
      this.viewModel.valor = 0;
      this.viewModel.quantidade = 0;
      this.viewModel.pessoa = {};
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
    ObterFornecedoresVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      PessoaServico.ObterVSelect(busca, TipoPessoaEnum.Fornecedor)
        .then((response) => {
          this.fornecedorOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    }
  }
};
</script>
