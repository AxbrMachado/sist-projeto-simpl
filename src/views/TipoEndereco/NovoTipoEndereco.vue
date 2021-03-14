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
              <strong class="align-self-center">Novo Tipo de endereço</strong>
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
            @click="$router.push('/tipoEndereco')"
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
  name: "NovoTipoEndereco",
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
    let tipoEnderecoId = this.$route.params.id;
    if (tipoEnderecoId) this.Obter(tipoEnderecoId);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.state.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(tipoEnderecoId) {
      this.loading = true;
      this.$http({
        url: "tipoEndereco/obter/" + tipoEnderecoId,
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
        url: "tipoEndereco/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/tipoEndereco");
          this.$notify({
            data: ["Tipo de endereço cadastrado com sucesso."],
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
        url: "tipoEndereco/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/tipoEndereco");
          this.$notify({
            data: ["Tipo de endereço editado com sucesso."],
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
