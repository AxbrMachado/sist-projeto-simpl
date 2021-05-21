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
                      ? "Novo Produto"
                      : "Editar Produto"
                  }}
                </strong>
                <a
                  @click="Limpar()"
                  class="ml-auto btn btn-primary"
                  href="/#/produto/novo"
                  title="Adicionar novo produto"
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
                    <label for>* Descrição</label>
                    <input
                      v-model="viewModel.descricao"
                      class="form-control"
                      type="text"
                      placeholder="Digite a descrição"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Valor Base</label>
                    <currency-input
                      v-model="viewModel.valorBase"
                      class="form-control"
                      placeholder="Digite o valor base"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Tipo Produto</label>
                    <b-form-select
                      v-model="viewModel.tipoProdutoId"
                      :options="tiposProdutoOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Unidade Medida</label>
                    <b-form-select
                      v-model="viewModel.tipoUnidadeMedidaId"
                      :options="tiposUnidadeMedidaOptions"
                      required
                    ></b-form-select>
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
                  @click="$router.push('/produto')"
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
      <ProdutoContrato :produtoId="viewModel.id"></ProdutoContrato>
      <ProdutoFornecedor :produtoId="viewModel.id"> </ProdutoFornecedor>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import ProdutoFornecedor from "./ProdutoFornecedor";
import ProdutoContrato from "./ProdutoContrato";

export default {
  name: "NovoProduto",
  components: {
    RotateSquare,
    ProdutoFornecedor,
    ProdutoContrato
  },
  data() {
    return {
      loading: false,
      tiposProdutoOptions: [],
      tiposUnidadeMedidaOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: "",
        valorBase: 0,
        tipoProdutoId: "",
        tipoUnidadeMedidaId: ""
      }
    };
  },
  created() {
    let produtoId = this.$route.params.id;
    if (produtoId) this.Obter(produtoId);
    this.ObterTiposProdutoSelect();
    this.ObterTiposUnidadeMedidaSelect();
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(produtoId) {
      this.loading = true;
      this.$http({
        url: "produto/obter/" + produtoId,
        method: "GET"
      })
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
    Novo() {
      this.loading = true;
      this.$http({
        url: "produto/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/produto");
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
      this.$http({
        url: "produto/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/produto");
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

    ObterTiposProdutoSelect() {
      this.$http({
        url: "/tipoProduto/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.tiposProdutoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    ObterTiposUnidadeMedidaSelect() {
      this.$http({
        url: "/tipoUnidadeMedida/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.tiposUnidadeMedidaOptions = response.data;
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
      this.viewModel.valorBase = 0;
      this.viewModel.tipoProdutoId = "";
      this.viewModel.tipoUnidadeMedidaId = "";
    }
  }
};
</script>
