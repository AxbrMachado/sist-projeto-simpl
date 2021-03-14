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
              <strong class="align-self-center">Novo Tipo Documento</strong>
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
              </div>
            </div>
          </div>
          <button class="btn btn-success mr-2" type="submit">Salvar</button>
          <button
            class="btn btn-secondary"
            type="reset"
            @click="$router.push('/tipoDocumento')"
          >
            Voltar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";

export default {
  name: "NovoTipoDocumento",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      contaOptions: [],
      viewModel: {
        id: this.$store.state.emptyGuid,
        descricao: ""
      }
    };
  },
  created() {
    let tipoDocumentoId = this.$route.params.id;
    if (tipoDocumentoId) this.Obter(tipoDocumentoId);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.state.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(tipoDocumentoId) {
      this.loading = true;
      this.$http({
        url: "tipoDocumento/obter/" + tipoDocumentoId,
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
            duration: 10000
          });
        });
    },
    Novo() {
      this.loading = true;
      this.$http({
        url: "tipoDocumento/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/tipoDocumento");
          this.$notify({
            data: ["Tipo de documento cadastrado com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Editar() {
      this.loading = true;
      this.$http({
        url: "tipoDocumento/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/tipoDocumento");
          this.$notify({
            data: ["Tipo de documento editado com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    }
  }
};
</script>
