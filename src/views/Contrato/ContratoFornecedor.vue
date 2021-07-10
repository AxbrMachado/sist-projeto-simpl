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
                <strong class="align-self-center">Fornecedor(s)</strong>
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
                  <a
                    @click="AdicionarTodos()"
                    class="ml-auto btn btn-primary"
                    href="/#/contrato/novo"
                    title="Adicionar todos fornecedores ao contrato"
                  >
                    Adicionar Todos Fornecedores
                  </a>
                </div>
                <div class="row">
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
                      <label for>* Valor Limite</label>
                      <currency-input
                        v-model="viewModel.valorLimite"
                        class="form-control"
                        placeholder="Digite o valor limite"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Quantidade Limite</label>
                      <vue-numeric
                        v-bind:precision="3"
                        v-bind:minus="false"
                        thousand-separator="."
                        decimal-separator=","
                        v-model="viewModel.quantidadeLimite"
                        class="form-control"
                        placeholder="Digite a quantidade limite"
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
                      <template v-slot:cell(valorLimite)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorLimite) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeLimite)="data">
                        <div class="left">
                          <span>{{
                            FormataValorDecimal(data.item.quantidadeLimite)
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
    <b-modal
      v-model="modalAdicionarTodos"
      title="Adicionar todos os fornecedores ao contrato"
      class="modal-danger"
      ok-variant="info"
      @ok="AdicionarTodosOk"
      @hidden="AdicionarTodosCancel"
    >
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
          <div class="form-group">
            <label for>* Valor Limite</label>
            <currency-input
              v-model="addTodosValorLimite"
              class="form-control"
              placeholder="Digite o valor limite"
              required
            />
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-6">
          <div class="form-group">
            <label for>* Quantidade Limite</label>
            <vue-numeric
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="addTodosQuantidade"
              class="form-control"
              placeholder="Digite a quantidade limite"
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
import ContratoFornecedorServico from "../../servico/ContratoFornecedorServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import TipoPessoaContratoEnum from "../../enums/TipoPessoaContratoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";

export default {
  components: { RotateSquare },
  props: {
    contratoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalAdicionarTodos: false,
      addTodosQuantidade: 0,
      addTodosValorLimite: 0,
      modalRemover: false,
      itemRemover: null,
      fornecedorOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 10,
      itens: [],
      abrir: false,
      fields: [
        { key: "pessoa", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },
        { key: "valorLimite", label: "Valor Limite", sortable: true },
        { key: "quantidadeLimite", label: "Quantidade Limite", sortable: true },
        {
          key: "quantidadeConsumida",
          label: "Quantidade Consumida",
          sortable: true
        },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        pessoaId: "",
        pessoa: {},
        contratoId: "",
        valorLimite: 0,
        quantidadeLimite: 0,
        tipoPessoaContrato: TipoPessoaContratoEnum.Fornecedor
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
    //let contratoId = this.$route.params.id;
    //if (contratoId) this.Obter(contratoId);
    // this.ObterFornecedorFsSelect();
  },
  methods: {
    IsNovo() {
      return this.contratoId === this.$store.getters.emptyGuid;
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
      ContratoFornecedorServico.Obter(id)
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
      this.loading = false;
      this.addTodosQuantidade = 0;
      this.addTodosValorLimite = 0;
      this.modalAdicionarTodos = false;
      ContratoFornecedorServico.ObterGrid(val, this.itensPorPagina, this.contratoId)
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
      this.addTodosQuantidade = 0;
      this.addTodosValorLimite = 0;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      ContratoFornecedorServico.Remover(this.itemRemover)
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
      this.viewModel.contratoId = this.contratoId;
      this.viewModel.pessoaId = this.viewModel.pessoa.id;
      ContratoFornecedorServico.Novo(this.viewModel)
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
      this.viewModel.contratoId = this.contratoId;
      this.viewModel.pessoaId = this.viewModel.pessoa.id;
      ContratoFornecedorServico.Editar(this.viewModel)
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
      this.viewModel.pessoaId = "";
      this.viewModel.contratoId = "";
      this.viewModel.valorLimite = 0;
      this.viewModel.quantidadeLimite = 0;
      this.viewModel.pessoa = {};
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
    FormataValorDecimal(valor) {
      return valor;
      if (valor) {
        return valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      } else {
        return valor;
      }
    },
    RemoverCifrao(valor) {
      if (valor) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
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

      this.$http({
        url:
          "/pessoa/obter-v-select/" + TipoPessoaEnum.Fornecedor + "/" + busca,
        method: "GET"
      })
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
    AdicionarTodos() {
      this.modalAdicionarTodos = true;
      this.addTodosQuantidade = 0;
      this.addTodosValorLimite = 0;
    },
    AdicionarTodosCancel(evento) {
      evento.preventDefault();
    },

    AdicionarTodosOk(evento) {
      evento.preventDefault();

      if (!this.addTodosValorLimite || this.addTodosValorLimite <= 0) {
        this.$notify({
          data: ["Informe um valor límite."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      if (!this.addTodosQuantidade) {
        this.addTodosQuantidade = 0;
      }

      this.modalAdicionarTodos = false;

      ContratoFornecedorServico.AdicionarTodosFornecedores(
        this.contratoId,
        this.addTodosValorLimite,
        this.addTodosQuantidade
      )
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Fornecedores cadastrados com sucesso."],
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
    }
  }
};
</script>
