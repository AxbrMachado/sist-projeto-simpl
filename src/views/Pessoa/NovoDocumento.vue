<template>
  <!-- <div v-show="!IsNovo()"> -->
    <div class="animated fadeIn">
      <div v-if="loading" class="loading-container">
        <RotateSquare
          class="loading-position animated fadeIn"
          size="60px"
        ></RotateSquare>
      </div>
      <form v-else @submit="ValidarFormDocumento">
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="card">
              <header class="card-header">
                <strong class="align-self-center">Documentos</strong>
              </header>
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
                    @click="$router.push('/pessoa')"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  <!-- </div> -->
</template>

<script>
import RotateSquare from "../../components/RotateSquare";

export default {
  name: "NovoDocumento",
  components: { RotateSquare },
  props: {
    pessoaId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      viewModelDocumento: {
        tipoDocumentoId: "",
        numero: "",
        observacao: "",
        validade: ""
      }
    };
  },
  methods: {
    IsNovo() {
      console.log("pessoa id: ", this.pessoaId);
      return this.pessoaId === this.$store.getters.emptyGuid;
    },
    ValidarFormDocumento(evt) {
      evt.preventDefault();
    },
    Obter(id) {
      this.loading = true;
      this.$http({
        url: "pessoa/obter/" + id,
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          this.viewModelPessoa = resposta.data;
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
        url: "pessoa/novo",
        data: this.viewModelPessoa,
        method: "POST"
      })
        .then((resposta) => {
          this.viewModelPessoa.id = resposta.data.id;
          this.loading = false;
          this.$notify({
            data: ["Pessoa cadastrado com sucesso."],
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
        url: "pessoa/editar",
        data: this.viewModelPessoa,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/pessoa");
          this.$notify({
            data: ["Pessoa editado com sucesso."],
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
