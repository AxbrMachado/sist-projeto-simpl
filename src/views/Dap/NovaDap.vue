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
            <header class="card-header">
              <div class="d-flex">
                <strong class="align-self-center"
                  >{{
                    viewModel.id == this.$store.getters.emptyGuid
                      ? "Nova Dap"
                      : "Editar Dap"
                  }}
                </strong>
                <a
                  @click="Limpar()"
                  class="ml-auto btn btn-primary"
                  href="/#/dap/novo"
                  title="Adicionar nova dap"
                >
                  Adicionar
                </a>
              </div>
            </header>
            <div class="card-body">
              <div class="row">
                <a
                  @click="ImportarConfiguracoes()"
                  class="ml-auto btn btn-info"
                  href="javascript:"
                  title="Importar configurações de Contratos e Produtos"
                >
                  Importar Configurações
                </a>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <small>Campos com * são de preenchimento obrigatório</small>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <div class="form-group">
                    <label for>* Número</label>
                    <input
                      v-model="viewModel.numero"
                      class="form-control"
                      type="text"
                      placeholder="Digite o numero"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>* Tipo Enquadramento</label>
                    <b-form-select
                      v-model="viewModel.tipoEnquadramento"
                      :options="tipoEnquadramentos"
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>* Validade</label>
                    <input
                      v-model="viewModel.validade"
                      class="form-control"
                      type="date"
                      placeholder="Digite a validade"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-5 col-lg-5 col-xl-3">
                  <div class="form-group">
                    <label for>Responsável</label>
                    <v-select
                      placeholder="Digite um responsável.."
                      v-model="viewModel.responsavel"
                      :options="responsaveisOptions"
                      @search="ObterResponsavelVSelect"
                    >
                      <template slot="no-options">
                        Nenhum resultado para a busca.
                      </template>
                    </v-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                  <div class="form-group">
                    <label for>* Pessoa(s)</label>
                    <v-select
                      placeholder="Digite pessoa(s)"
                      multiple
                      v-model="viewModel.pessoas"
                      :options="pessoasOptions"
                      required
                      @search="ObterPessoasVSelect"
                    >
                      <template slot="no-options">
                        Nenhum resultado para a busca.
                      </template>
                    </v-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Exclusão Rateio Até</label>
                    <input
                      v-model="viewModel.limiteExclusaoRateio"
                      class="form-control"
                      type="date"
                      placeholder="Data limite onde os fornecedores da DAP ficam foram de rateios"
                    />
                  </div>
                </div>
                <div
                  class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                  title="Dap com fornecedor designado."
                >
                  <label for>Fornecedor Designado</label>
                  <b-form-checkbox
                    v-model="viewModel.fornecedorDesignado"
                    name="check-button"
                    switch
                  >
                  </b-form-checkbox>
                </div>
              </div>
            </div>
            <div class="btn-toolbar mb-3 ml-3" role="toolbar">
              <div class="btn-group" role="group">
                <button class="btn btn-success mr-2" type="submit">
                  Salvar
                </button>
              </div>
              <div class="btn-group" role="group">
                <button
                  class="btn btn-secondary"
                  type="reset"
                  @click="$router.go(-1)"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div v-if="IsEdicao()">
      <NovoDocumento :referenciaId="viewModel.id"> </NovoDocumento>
      <Contato :referenciaId="viewModel.id"> </Contato>
    </div>
    <b-modal
      v-model="modalImportarConfiguracoes"
      title="Importar configurações de Contrato e Produtos"
      class="modal-danger"
      ok-variant="info"
      @ok="ImportarConfiguracoesOK"
      @hidden="ImportarConfiguracoesCancel"
    >
      <div class="row">
        <div class="col-sm-12 col-md-5 col-lg-5 col-xl-12">
          <div class="form-group">
            <label for>* Fornecedor</label>
            <v-select
              placeholder="Digite um fornecedor"
              v-model="fornecedorBase"
              :options="fornecedoresBaseConfiguracaoOptions"
              @search="ObterCooperadoBaseVSelect"
            >
              <template slot="no-options">
                Nenhum resultado para a busca.
              </template>
            </v-select>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import TipoEnquadramentoEnum from "../../enums/TipoEnquadramentoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import DateTime from "../../util/DateTime";
import DapServico from "../../servico/DapServico";
import DapContrato from "./DapContrato";
import Contato from "../../components/Contato";
import NovoDocumento from "../../components/NovoDocumento";
import PessoaServico from "../../servico/PessoaServico";

export default {
  name: "NovoDap",
  components: {
    RotateSquare,
    DapContrato,
    TipoPessoaEnum,
    Contato,
    NovoDocumento
  },
  data() {
    return {
      modalImportarConfiguracoes: false,
      addTodosValorLimite: 0,
      fornecedoresBaseConfiguracaoOptions: [],
      fornecedorBase: null,
      loading: false,
      pessoasOptions: [],
      responsaveisOptions: [],
      tipoEnquadramentos: [
        { value: TipoEnquadramentoEnum.Grupo_A, text: "A" },
        { value: TipoEnquadramentoEnum.Grupo_B, text: "B" },
        { value: TipoEnquadramentoEnum.Grupo_AC, text: "AC" },
        { value: TipoEnquadramentoEnum.Grupo_V, text: "V" }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        numero: "",
        validade: "",
        limiteExclusaoRateio: null,
        tipoEnquadramento: 0,
        fornecedorDesignado: false,
        responsavel: null,
        pessoas: []
      }
    };
  },
  created() {
    let dapId = this.$route.params.id;
    if (dapId) this.Obter(dapId);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();

      if (!this.viewModel.pessoas || this.viewModel.pessoas.length <= 0) {
        this.loading = false;
        this.$notify({
          data: ["Informe ao menos uma pessoa."],
          type: "warn",
          duration: 5000
        });
        return;
      }
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(dapId) {
      this.loading = false;
      DapServico.Obter(dapId)
        .then((resposta) => {
          this.loading = false;
          resposta.data.validade = DateTime.formatar(resposta.data.validade);
          resposta.data.limiteExclusaoRateio = DateTime.formatar(
            resposta.data.limiteExclusaoRateio
          );
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
    Novo() {
      this.loading = false;
      DapServico.Novo(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/dap");
          this.$notify({
            data: ["Dap cadastrada com sucesso."],
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
      DapServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/dap");
          this.$notify({
            data: ["Dap editada com sucesso."],
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
    ObterPessoasVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      PessoaServico.ObterVSelect(busca, TipoPessoaEnum.Fornecedor)
        .then((response) => {
          this.pessoasOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    ObterResponsavelVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      PessoaServico.ObterVSelect(busca, TipoPessoaEnum.Fornecedor)
        .then((response) => {
          this.responsaveisOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    IsEdicao() {
      return this.viewModel.id !== this.$store.getters.emptyGuid;
    },
    Limpar() {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.numero = "";
      this.viewModel.validade = "";
      this.viewModel.limiteExclusaoRateio = null;
      this.viewModel.tipoEnquadramento = 0;
      this.viewModel.fornecedorDesignado = false;
      this.viewModel.responsavel = null;
      this.viewModel.pessoas = [];
    },
    ImportarConfiguracoes() {
      this.modalImportarConfiguracoes = true;
      // this.addTodosValorLimite = 0;
    },
    ImportarConfiguracoesCancel(evento) {
      evento.preventDefault();
      this.fornecedoresBaseConfiguracaoOptions = [];
      this.fornecedorBase = null;
    },
    ImportarConfiguracoesOK(evento) {
      evento.preventDefault();

      if (!this.fornecedorBase) {
        this.$notify({
          data: ["Informe um fornecedor."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      this.modalImportarConfiguracoes = false;
      DapServico.ImportarConfiguracoes(
        this.viewModel.id,
        this.fornecedorBase.id
      )
        .then((resposta) => {
          this.loading = false;
          this.$notify({
            data: [
              "Configurações de contrato e produtos importadas com sucesso."
            ],
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
    ObterCooperadoBaseVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      PessoaServico.ObterVSelect(busca, TipoPessoaEnum.Fornecedor)
        .then((response) => {
          this.fornecedoresBaseConfiguracaoOptions = response.data;
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
