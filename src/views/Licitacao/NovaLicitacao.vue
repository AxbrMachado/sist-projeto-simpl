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
                      ? "Nova Licitação"
                      : "Editar Licitação"
                  }}
                </strong>
                <a
                  @click="Limpar()"
                  class="ml-auto btn btn-primary"
                  href="/#/licitacao/novo"
                  title="Adicionar nova licitação"
                >
                  Adicionar
                </a>
              </div>
            </header>
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <small>Campos com * são de preenchimento obrigatório</small>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-2">
                  <div class="form-group">
                    <label for>* Número</label>
                    <input
                      v-model="viewModel.numero"
                      class="form-control"
                      type="text"
                      placeholder="Digite o número"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
                  <div class="form-group">
                    <label for>* Instituição</label>
                    <b-form-select
                      v-model="viewModel.pessoaId"
                      :options="instituicaoOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>* Tipo Instituição</label>
                    <b-form-select
                      v-model="viewModel.tipoInstituicaoId"
                      :options="tiposInstituicaoOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
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
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>* Data Licitação</label>
                    <input
                      v-model="viewModel.dataLicitacao"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data da licitação"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>* Data de Vencimento</label>
                    <input
                      v-model="viewModel.dataVencimento"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data de vencimento"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>* Status</label>
                    <b-form-select
                      v-model="viewModel.status"
                      :options="statusOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>Local</label>
                    <input
                      v-model="viewModel.local"
                      class="form-control"
                      type="text"
                      placeholder="Digite o local"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>Regimento</label>
                    <input
                      v-model="viewModel.regimento"
                      class="form-control"
                      type="text"
                      placeholder="Digite o regimento"
                    />
                  </div>
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
      <LicitacaoContrato :licitacaoId="viewModel.id"> </LicitacaoContrato>
      <NovoDocumento :referenciaId="viewModel.id"> </NovoDocumento>
      <Contato :referenciaId="viewModel.id" />
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import DateTime from "../../util/DateTime";
import LicitacaoContrato from "./LicitacaoContrato";
import Contato from "../../components/Contato";
import NovoDocumento from "../../components/NovoDocumento";
import StatusLicitacaoEnum from "../../enums/StatusLicitacaoEnum";
import LicitacaoServico from "../../servico/LicitacaoServico";
import PessoaServico from "../../servico/PessoaServico";
import TipoInstituicaoServico from "../../servico/TipoInstituicaoServico";

export default {
  name: "NovoLicitacao",
  components: {
    RotateSquare,
    TipoPessoaEnum,
    LicitacaoContrato,
    Contato,
    NovoDocumento,
    StatusLicitacaoEnum
  },
  data() {
    return {
      loading: false,
      tiposInstituicaoOptions: [],
      instituicaoOptions: [],
      statusOptions: [
        { value: StatusLicitacaoEnum.Pendente, text: "Pendente" },
        { value: StatusLicitacaoEnum.Aprovada, text: "Aprovada" },
        { value: StatusLicitacaoEnum.Reprovada, text: "Reprovada" },
        { value: StatusLicitacaoEnum.Cancelada, text: "Cancelada" }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        pessoaId: "",
        tipoInstituicaoId: "",
        valor: 0,
        local: "",
        regimento: "",
        status: 0,
        numero: "",
        dataLicitacao: "",
        dataVencimento: "",
        contratos: []
      }
    };
  },
  created() {
    let licitacaoId = this.$route.params.id;
    if (licitacaoId) this.Obter(licitacaoId);
    this.ObterInstituicoesSelect();
    this.ObterTiposInstituicoesSelect();
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(licitacaoId) {
      this.loading = false;

      LicitacaoServico.Obter(licitacaoId)
        .then((resposta) => {
          this.loading = false;
          resposta.data.dataLicitacao = DateTime.formatar(
            resposta.data.dataLicitacao
          );
          resposta.data.dataVencimento = DateTime.formatar(
            resposta.data.dataVencimento
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

      LicitacaoServico.Novo(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$notify({
            data: ["Licitacao cadastrada com sucesso."],
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

      LicitacaoServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/licitacao");
          this.$notify({
            data: ["Licitação editada com sucesso."],
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

    ObterInstituicoesSelect() {
      PessoaServico.ObterSelect(TipoPessoaEnum.Instituicao)
        .then((response) => {
          this.instituicaoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },

    ObterTiposInstituicoesSelect() {
      TipoInstituicaoServico.ObterSelect()
        .then((response) => {
          this.tiposInstituicaoOptions = response.data;
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
      this.viewModel.pessoaId = "";
      this.viewModel.tipoInstituicaoId = "";
      this.viewModel.valor = 0;
      this.viewModel.local = "";
      this.viewModel.regimento = "";
      this.viewModel.status = 0;
      this.viewModel.numero = "";
      this.viewModel.dataLicitacao = "";
      this.viewModel.dataVencimento = "";
      this.viewModel.contratos = [];
    }
  }
};
</script>
