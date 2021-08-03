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
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <div class="form-group">
                      <label>Nome</label>
                      <input
                        type="text"
                        v-model="filtro.nome"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas fornecedores vinculados ao contrato."
                  >
                    <label for>Vinculado ao contrato</label>
                    <b-form-checkbox
                      v-model="filtro.vinculadoAoContrato"
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
                            v-if="isFornecedorVinculado(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Fornecedor não vinculado ao contrato"
                            @click="AdicionarFornecedorContrato(data.item)"
                          >
                            <i class="fas fa-times"></i>
                          </b-button>
                          <b-button
                            v-if="!isFornecedorVinculado(data.item)"
                            variant="success"
                            style="margin-right: 10px"
                            title="Fornecedor vinculado ao contrato"
                            @click="RemoverFornecedorContrato(data.item)"
                          >
                            <i class="fas fa-check"></i>
                          </b-button>
                          <b-button
                            v-if="!isFornecedorVinculado(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar fornecedor do contrato"
                            @click="Edicao(data.item)"
                          >
                            <i class="fa fa-edit"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorLimite)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorLimite) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(tipoFornecedor)="data">
                        <div class="center">
                          <span>{{
                            ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeLimite)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeLimite)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(tipoPessoa)="data">
                        <div class="center">
                          <span>{{
                            ObterTipoPessoa(data.item.tipoPessoa)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorConsumido)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorConsumido)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorRestante)="data">
                        <div class="left">
                          <span>{{ FormataValorRestante(data.item) }}</span>
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
      v-model="modalEditarInfoFornecedor"
      title="Editar informação do fornecedor no contrato"
      class="modal-danger"
      ok-variant="info"
      @ok="EditarFornecedor"
      @hidden="CancelEdicao"
    >
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
          <div class="form-group">
            <label for>* Valor Limite</label>
            <currency-input
              v-model="valorLimite"
              class="form-control"
              placeholder="Informe valor limite"
              required
            />
          </div>
        </div>
        <!-- <div class="col-sm-12 col-md-3 col-lg-3 col-xl-6">
          <div class="form-group">
            <label for>* Quantidade Limite</label>
            <vue-numeric
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="quantidadeLimite"
              class="form-control"
              placeholder="Informe quantidade limite"
              required
            />
          </div>
        </div> -->
      </div>
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
        <!-- <div class="col-sm-12 col-md-3 col-lg-3 col-xl-6">
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
        </div> -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import ContratoFornecedorServico from "../../servico/ContratoFornecedorServico";
import TipoPessoaContratoEnum from "../../enums/TipoPessoaContratoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";

export default {
  name: "ContratoFornecedorSelect",
  components: {
    RotateSquare,
    TipoPessoaContratoEnum,
    TipoFornecedorEnum,
    TipoPessoaEnum
  },
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
      modalEditarInfoFornecedor: false,
      valorLimite: 0,
      quantidadeLimite: 0,
      pessoaId: this.$store.getters.emptyGuid,
      contratoClienteId: this.$store.getters.emptyGuid,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      itens: [],
      abrir: false,
      filtro: {
        nome: "",
        vinculadoAoContrato: false
      },
      fields: [
        { key: "pessoa", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },
        { key: "valorLimite", label: "Valor Limite", sortable: true },
        // { key: "quantidadeLimite", label: "Quantidade Limite", sortable: true },
        { key: "valorConsumido", label: "Valor Consumido", sortable: true },
        { key: "valorRestante", label: "Valor Disponível", sortable: true },
        // {
        //   key: "quantidadeConsumida",
        //   label: "Quantidade Consumida",
        //   sortable: true
        // },
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
    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  created() {},
  methods: {
    ValidarForm(evt) {},
    ObterGrid(pagina) {
      this.loading = false;
      this.modalAdicionarTodos = false;

      ContratoFornecedorServico.ObterGridContrato(
        pagina,
        this.itensPorPagina,
        this.contratoId,
        this.filtro.vinculadoAoContrato,
        this.filtro.nome,
        TipoPessoaContratoEnum.Fornecedor
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
    RemoverFornecedorContrato(item) {
      ContratoFornecedorServico.Remover(item.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Fornecedor removido com sucesso."],
            type: "success",
            duration: 1000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 1000
          });
        });
    },
    AdicionarFornecedorContrato(item) {
      ContratoFornecedorServico.Adicionar(
        this.contratoId,
        item.pessoaId,
        TipoPessoaContratoEnum.Fornecedor
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Fornecedor vinculado com sucesso."],
            type: "success",
            duration: 1000
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
      this.filtro.nome = "";
      this.filtro.vinculadoAoContrato = false;
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
    isFornecedorVinculado(item) {
      return item.id === this.$store.getters.emptyGuid;
    },
    EditarFornecedor(evento) {
      evento.preventDefault();

      if (!this.valorLimite || this.valorLimite <= 0) {
        this.$notify({
          data: ["Informe um valor limite válido."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      if (!this.quantidadeLimite) {
        this.quantidadeLimite = 0;
      }

      this.modalEditarInfoFornecedor = false;

      ContratoFornecedorServico.EditarFornecedor(
        this.contratoClienteId,
        this.valorLimite,
        this.quantidadeLimite,
        TipoPessoaContratoEnum.Fornecedor,
        this.contratoId
      )
        .then((resposta) => {
          this.loading = false;
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Fornecedor alterado com sucesso."],
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
    CancelEdicao(evento) {
      evento.preventDefault();
      this.modalEditarInfoFornecedor = false;
    },
    Edicao(item) {
      this.modalEditarInfoFornecedor = true;
      this.pessoaId = item.pessoaId;
      this.contratoClienteId = item.id;
      this.valorLimite = item.valorLimite;
      this.quantidadeLimite = item.quantidadeLimite ? item.quantidadeLimite : 0;
    },
    ObterTipoPessoa(item) {
      switch (item) {
        case TipoPessoaEnum.Funcionario:
          return "Funcionário";
        case TipoPessoaEnum.Fornecedor:
          return "Fornecedor";
        case TipoPessoaEnum.Cliente:
          return "Cliente";
        case TipoPessoaEnum.Instituicao:
          return "Instituição";
        default:
          return "Inválido";
      }
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
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
    },
    FormataValorRestante(item) {
      return (item.valorConsumido >= item.valorLimite
        ? 0
        : item.valorLimite - item.valorConsumido
      ).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    }
  }
};
</script>
