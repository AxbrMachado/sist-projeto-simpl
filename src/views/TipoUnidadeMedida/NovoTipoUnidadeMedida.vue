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
                    ? "Novo Tipo de Unidade Medida"
                    : "Editar Tipo de Unidade Medida"
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
                <div
                  class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                  title="Permite efetuar rateio de produtos desta unidade com margem."
                >
                  <label for>Permite Margem Rateio</label>
                  <b-form-checkbox
                    v-model="viewModel.permiteMargemRateio"
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
      <TipoUnidadeMedidaConversao :tipoUnidadeMedidaId="viewModel.id" />
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import TipoUnidadeMedidaConversao from "./TipoUnidadeMedidaConversao";
import TipoUnidadeMedidaServico from "../../servico/TipoUnidadeMedidaServico";

export default {
  name: "NovoTipoUnidadeMedida",
  components: {
    RotateSquare,
    TipoUnidadeMedidaConversao
  },
  data() {
    return {
      loading: false,
      contaOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: "",
        permiteMargemRateio: false
      }
    };
  },
  created() {
    let tipoUnidadeMedidaId = this.$route.params.id;
    if (tipoUnidadeMedidaId) this.Obter(tipoUnidadeMedidaId);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(tipoUnidadeMedidaId) {
      this.loading = false;

      TipoUnidadeMedidaServico.Obter(tipoUnidadeMedidaId)
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
      this.loading = false;

      TipoUnidadeMedidaServico.Novo(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/tipo-unidade-medida");
          this.$notify({
            data: ["Tipo de unidade medida cadastrado com sucesso."],
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

      TipoUnidadeMedidaServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/tipo-unidade-medida");
          this.$notify({
            data: ["Tipo de unidade medida editado com sucesso."],
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
    IsEdicao() {
      return this.viewModel.id !== this.$store.getters.emptyGuid;
    }
  }
};
</script>
