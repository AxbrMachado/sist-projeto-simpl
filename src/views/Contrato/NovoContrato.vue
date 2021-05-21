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
                      ? "Novo Contrato"
                      : "Editar Contrato"
                  }}
                </strong>
                <a
                  @click="Limpar()"
                  class="ml-auto btn btn-primary"
                  href="/#/contrato/novo"
                  title="Adicionar novo contrato"
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
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Descricao</label>
                    <input
                      v-model="viewModel.descricao"
                      class="form-control"
                      type="text"
                      placeholder="Digite a descrição"
                      required
                    />
                  </div>
                </div>
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
                    <label for>* Licitação</label>
                    <b-form-select
                      v-model="viewModel.licitacaoId"
                      :options="licitacaoOptions"
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
                    <label for>* Data Início</label>
                    <input
                      v-model="viewModel.dataInicio"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data de início"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Data de Término</label>
                    <input
                      v-model="viewModel.dataTermino"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data de término"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="form-group">
                    <label for>Observação</label>
                    <b-form-textarea
                      v-model="viewModel.observacao"
                      rows="4"
                      max-rows="12"
                      placeholder="Observações gerais..."
                    ></b-form-textarea>
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
                  @click="$router.push('/contrato')"
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
      <ContratoCliente :contratoId="viewModel.id"> </ContratoCliente>
      <ContratoFornecedor :contratoId="viewModel.id"> </ContratoFornecedor>
      <ContratoProduto :contratoId="viewModel.id"> </ContratoProduto>
      <NovoDocumento :contratoId="viewModel.id"> </NovoDocumento>
      <Contato :referenciaId="viewModel.id"> </Contato>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import ContratoProduto from "./ContratoProduto";
import ContratoFornecedor from "./ContratoFornecedor";
import ContratoCliente from "./ContratoCliente";
import DateTime from "../../util/DateTime";
import Contato from "../../components/Contato";
import NovoDocumento from "./NovoDocumento";

export default {
  name: "NovoContrato",
  components: {
    RotateSquare,
    NovoDocumento,
    ContratoProduto,
    ContratoFornecedor,
    ContratoCliente,
    Contato
  },
  data() {
    return {
      loading: false,
      tiposInstituicaoOptions: [],
      licitacaoOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: "",
        observacao: "",
        licitacaoId: "",
        numero: "",
        dataInicio: "",
        dataTermino: "",
        valor: 0,
        produtos: []
      }
    };
  },
  created() {
    let contratoId = this.$route.params.id;
    if (contratoId) this.Obter(contratoId);
    this.ObterInstituicoesSelect();
    this.ObterTiposInstituicoesSelect();
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(contratoId) {
      this.loading = true;
      this.$http({
        url: "contrato/obter/" + contratoId,
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          resposta.data.dataInicio = DateTime.formatar(
            resposta.data.dataInicio
          );
          resposta.data.dataTermino = DateTime.formatar(
            resposta.data.dataTermino
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
        url: "contrato/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          // this.$router.push(
          //   "/contrato/editar/" + "68f2d01a-a002-4c2c-b640-169d47f52c91"
          // );

          this.$router.push("/contrato");
          this.$notify({
            data: ["Contrato cadastrada com sucesso."],
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
        url: "contrato/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/contrato");
          this.$notify({
            data: ["Contrato editada com sucesso."],
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
        url: "/licitacao/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.licitacaoOptions = response.data;
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
    },
    Limpar() {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.descricao = "";
      this.viewModel.observacao = "";
      this.viewModel.licitacaoId = "";
      this.viewModel.numero = "";
      this.viewModel.dataInicio = "";
      this.viewModel.dataTermino = "";
      this.viewModel.valor = 0;
      this.viewModel.produtos = [];
    }
  }
};
</script>
