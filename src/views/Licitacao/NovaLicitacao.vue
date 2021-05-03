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
              <strong class="align-self-center"
                >{{
                  viewModel.id == this.$store.getters.emptyGuid
                    ? "Nova Licitação"
                    : "Editar Licitação"
                }}
              </strong>
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
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Instituição</label>
                    <b-form-select
                      v-model="viewModel.pessoaId"
                      :options="instituicaoOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Tipo Instituição</label>
                    <b-form-select
                      v-model="viewModel.tipoInstituicaoId"
                      :options="tiposInstituicaoOptions"
                      required
                    ></b-form-select>
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
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Local</label>
                    <input
                      v-model="viewModel.local"
                      class="form-control"
                      type="text"
                      placeholder="Digite o local"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Regimento</label>
                    <input
                      v-model="viewModel.regimento"
                      class="form-control"
                      type="text"
                      placeholder="Digite o regimento"
                      required
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
                  @click="$router.push('/licitacao')"
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

export default {
  name: "NovoLicitacao",
  components: {
    RotateSquare,
    TipoPessoaEnum,
    LicitacaoContrato,
    Contato
  },
  data() {
    return {
      loading: false,
      tiposInstituicaoOptions: [],
      instituicaoOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        pessoaId: "",
        tipoInstituicaoId: "",
        valor: 0,
        local: "",
        regimento: "",
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
      this.loading = true;
      this.$http({
        url: "licitacao/obter/" + licitacaoId,
        method: "GET"
      })
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
      this.loading = true;
      this.$http({
        url: "licitacao/novo",
        data: this.viewModel,
        method: "POST"
      })
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
      this.loading = true;
      this.$http({
        url: "licitacao/editar",
        data: this.viewModel,
        method: "PUT"
      })
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
      this.$http({
        url: "/pessoa/obter-select/" + TipoPessoaEnum.Instituicao,
        method: "GET"
      })
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
      this.$http({
        url: "/tipoInstituicao/obter-select",
        method: "GET"
      })
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
    }
  }
};
</script>
