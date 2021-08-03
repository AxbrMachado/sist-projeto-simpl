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
                <strong class="align-self-center">Clientes</strong>
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
                      <label for>* Cliente</label>
                      <v-select
                        placeholder="Digite um cliente.."
                        v-model="viewModel.pessoa"
                        :options="clienteOptions"
                        required
                        @search="ObterClientesVSelect"
                      >
                        <template slot="no-options">
                          Nenhum resultado para a busca.
                        </template>
                      </v-select>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div class="form-group">
                      <label for>* Rota</label>
                      <input
                        v-model="viewModel.rota"
                        class="form-control"
                        type="text"
                        placeholder="Digite a descrição"
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
                      empty-text="Nenhum cliente encontrado."
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
                      <template v-slot:cell(tipoPessoa)="data">
                        <div class="center">
                          <span>{{
                            ObterTipoPessoa(data.item.tipoPessoa)
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
import ContratoClienteServico from "../../servico/ContratoClienteServico";
import TipoPessoaContratoEnum from "../../enums/TipoPessoaContratoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";

export default {
  components: {
    RotateSquare,
    ContratoClienteServico,
    TipoPessoaContratoEnum,
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
      modalRemover: false,
      itemRemover: null,
      clienteOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 2,
      itens: [],
      abrir: false,
      fields: [
        { key: "pessoa", label: "Cliente", sortable: true },
        { key: "tipoPessoa", label: "Tipo Pessoa", sortable: true },
        { key: "rota", label: "Rota", sortable: true },
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
        rota: "",
        valorLimite: 0,
        quantidadeLimite: 0,
        tipoPessoaContrato: TipoPessoaContratoEnum.Cliente
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
    // this.ObterClientesSelect();
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
          data: ["Informe um cliente."],
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
      ContratoClienteServico.Obter(id)
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
      ContratoClienteServico.ObterGrid(
        val,
        this.itensPorPagina,
        this.contratoId
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

      ContratoClienteServico.Remover(this.itemRemover)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Cliente removido com sucesso."],
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
      ContratoClienteServico.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Cliente cadastrado com sucesso."],
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
      ContratoClienteServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Cliente editado com sucesso."],
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
      this.viewModel.rota = "";
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
    ObterClientesVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      this.$http({
        url: "/pessoa/obter-v-select/" + busca,
        method: "GET"
      })
        .then((response) => {
          this.clienteOptions = response.data;
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
